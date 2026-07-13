import { defineStore } from 'pinia';
import { useFiliereStore } from './filiereStore';
import { useMatiereStore } from './matiereStore';

const S = 25; // semaine ISO 25

const normalizeString = (value) => String(value ?? '').trim().toLowerCase();
const normalizeNiveau = (value) => normalizeString(value);
const isNiveauMatch = (entryNiveau, filterNiveau) => {
  const entry = normalizeNiveau(entryNiveau);
  const filter = normalizeNiveau(filterNiveau);
  if (filter === 'tous' || filter === 'toutes') return true;
  if (['l1', 'l2', 'l3'].includes(filter)) {
    return entry === filter || entry === 'licence' || entry.startsWith(filter);
  }
  if (['m1', 'm2'].includes(filter)) {
    return entry === filter || entry === 'master' || entry.startsWith(filter);
  }
  return entry === filter;
};

export const useEmploiStore = defineStore('emploi', {
  state: () => ({
    emplois: [],
    creneauSelectionne: null,
    filtres: {
      mention: 'toutes',
      parcours: 'tous',
      niveau: 'tous',
      groupe: 'tous',
      enseignant: 'tous',
      salle: 'toutes',
      type: 'tous'
    },
    semaineCourante: new Date('2026-06-15'), // Lundi S25
    loading: false,
    modeVue: 'semaine',
    drawerOuvert: false,
    modalOuverte: false,
    creneauEnEdition: null,
    donneesParDefaut: null,
    printModalOuverte: false,
    pixelsParMinute: 1.2,
    conflits: [],
    conflitsIgnores: false
  }),
  getters: {
    emploisFiltres: (state) => {
      return state.emplois.filter(e => {
          const mentionId = normalizeString(e.mention?.id ?? e.mention ?? '');
          const parcoursId = normalizeString(e.parcours?.id ?? e.parcours ?? '');
          const niveau = normalizeString(e.niveau ?? '');
          const type = normalizeString(e.type ?? '');
          const enseignantId = normalizeString(e.enseignant?.id ?? e.enseignant?.nom ?? e.enseignant ?? '');
          const salleId = normalizeString(e.salle?.id ?? e.salle?.nom ?? e.salle ?? '');
          const groupe = normalizeString(e.groupe ?? '');

          const matchMention = state.filtres.mention === 'toutes' || mentionId === normalizeString(state.filtres.mention);
          const matchParcours = state.filtres.parcours === 'tous' || parcoursId === normalizeString(state.filtres.parcours);
          const matchNiveau = isNiveauMatch(niveau, state.filtres.niveau);
          const matchType = state.filtres.type === 'tous' || type === normalizeString(state.filtres.type);
          const matchEnseignant = state.filtres.enseignant === 'tous' || enseignantId === normalizeString(state.filtres.enseignant);
          const matchSalle = state.filtres.salle === 'toutes' || salleId === normalizeString(state.filtres.salle);
          const matchGroupe = state.filtres.groupe === 'tous' || groupe === normalizeString(state.filtres.groupe);

        return matchMention && matchParcours && matchNiveau && matchType && matchEnseignant && matchSalle && matchGroupe;
      });
    },
    numeroSemaine: (state) => 25,
    dateDebutSemaine: (state) => {
      const d = new Date(state.semaineCourante);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    },
    dateFinSemaine: (state) => {
      const d = new Date(state.semaineCourante);
      d.setDate(d.getDate() + 5);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    chargesEnseignants: (state) => {
      const charges = {};
      state.emplois.forEach(e => {
        if (!charges[e.enseignant.id]) charges[e.enseignant.id] = 0;
        const start = e.heureDebut.split(':').map(Number);
        const end = e.heureFin.split(':').map(Number);
        const duree = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
        charges[e.enseignant.id] += duree / 60;
      });
      return charges;
    }
  },
  actions: {
    detecterConflits() {
      this.conflits = [];
      const slots = this.emplois;

      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const c1 = slots[i];
          const c2 = slots[j];

          if (c1.jour === c2.jour && this.chevauchement(c1, c2)) {
            // Conflit Enseignant
            if (c1.enseignant.id === c2.enseignant.id) {
              this.conflits.push({
                id: Date.now() + i + j,
                type: 'Enseignant',
                message: `${c1.enseignant.prenom} ${c1.enseignant.nom} est déjà en cours (${c1.matiere.code} et ${c2.matiere.code}) le ${c1.jour} à ${c1.heureDebut}`
              });
            }
            // Conflit Salle
            if (c1.salle.id === c2.salle.id) {
              this.conflits.push({
                id: Date.now() + i + j + 1,
                type: 'Salle',
                message: `La salle ${c1.salle.nom} est occupée par ${c1.matiere.code} et ${c2.matiere.code} le ${c1.jour} à ${c1.heureDebut}`
              });
            }
            // Conflit Groupe
            if (c1.parcours.id === c2.parcours.id && c1.niveau === c2.niveau && (c1.groupe === c2.groupe || !c1.groupe || !c2.groupe)) {
              this.conflits.push({
                id: Date.now() + i + j + 2,
                type: 'Groupe',
                message: `Le groupe ${c1.parcours.code} ${c1.niveau} a deux cours en même temps (${c1.matiere.code} et ${c2.matiere.code})`
              });
            }
          }
        }
      }
    },

    chevauchement(c1, c2) {
      const h2m = (h) => {
        const [hh, mm] = h.split(':').map(Number);
        return hh * 60 + mm;
      };
      const start1 = h2m(c1.heureDebut);
      const end1 = h2m(c1.heureFin);
      const start2 = h2m(c2.heureDebut);
      const end2 = h2m(c2.heureFin);

      return Math.max(start1, start2) < Math.min(end1, end2);
    },

    /**
     * Vérifie les conflits d'un créneau avant enregistrement
     * Retourne un objet avec les détails du conflit si détecté
     */
    verifierConflitsAvantEnregistrement(creneauData, creneauIdAExclure = null) {
      const conflits = [];

      // Extraire les infos du créneau à vérifier
      const enseignantNom = `${creneauData.enseignant?.prenom ?? ''} ${creneauData.enseignant?.nom ?? ''}`.trim();
      const enseignantId = creneauData.enseignant?.id;
      const salleNom = creneauData.salle?.nom ?? creneauData.salle ?? '';
      const jour = creneauData.jour ?? '';
      const heureDebut = creneauData.heureDebut ?? '';
      const heureFin = creneauData.heureFin ?? '';

      // Boucler sur tous les créneaux existants
      for (const emploi of this.emplois) {
        // Ignorer le créneau qu'on est en train de modifier
        if (creneauIdAExclure !== null && emploi.id === creneauIdAExclure) continue;

        // Vérifier si même jour et chevauchement horaire
        if (emploi.jour !== jour) continue;

        const c1 = { heureDebut, heureFin };
        const c2 = { heureDebut: emploi.heureDebut, heureFin: emploi.heureFin };
        if (!this.chevauchement(c1, c2)) continue;

        // --- Conflit ENSEIGNANT ---
        if (enseignantId && emploi.enseignant?.id === enseignantId) {
          conflits.push({
            type: 'enseignant',
            message: `Enregistrement impossible : l'enseignant ${enseignantNom} est déjà affecté à un autre cours à cette heure. (Classe : ${emploi.parcours?.code || 'N/A'} ${emploi.niveau || ''} - ${emploi.groupe || 'sans groupe'})`,
            creneauExistant: emploi
          });
        }

        // --- Conflit SALLE ---
        if (salleNom && emploi.salle?.nom === salleNom) {
          conflits.push({
            type: 'salle',
            message: `Enregistrement impossible : cette salle est déjà occupée pour ce créneau horaire. (Classe occupant la salle : ${emploi.parcours?.code || 'N/A'} ${emploi.niveau || ''} - ${emploi.groupe || 'sans groupe'})`,
            creneauExistant: emploi
          });
        }
      }

      // Retourner le résultat
      if (conflits.length > 0) {
        return {
          hasConflict: true,
          conflits: conflits,
          firstConflict: conflits[0]
        };
      }

      return {
        hasConflict: false,
        conflits: [],
        firstConflict: null
      };
    },

    async fetchEmplois() {
      this.loading = true;
      try {
        const res = await fetch('/api/emploidutemps');
        if (res.ok) {
          const data = await res.json();
          const normalizeDay = (value) => {
            if (!value) return '';
            const text = String(value).trim();
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
          };

          const filiereStore = useFiliereStore();
          const matiereStore = useMatiereStore();

          this.emplois = data.map(e => {
            const startTime = e.startTime ? new Date(e.startTime) : null;
            const rawJour = e.jour ? String(e.jour).trim() : '';
            const jour = rawJour
              ? normalizeDay(rawJour)
              : (startTime ? normalizeDay(startTime.toLocaleDateString('fr-FR', { weekday: 'long' })) : '');

            // Try to find matching parcours or matiere information from other stores
            const parcoursObj = (e.parcoursId && filiereStore.parcours)
              ? filiereStore.parcours.find(p => String(p.id) === String(e.parcoursId))
              : null;

            // Try to match matiere by title if available
            const matchedMatiere = (e.title && matiereStore.matieres)
              ? matiereStore.matieres.find(m => (m.nom || '').toLowerCase() === (e.title || '').toLowerCase())
              : null;

            // Normalize enseignant string into object
            let enseignantObj = { id: null, prenom: '', nom: '', initiales: '' };
            if (e.enseignant) {
              const parts = String(e.enseignant).trim().split(' ');
              enseignantObj.prenom = parts.length > 1 ? parts.slice(0, -1).join(' ') : '';
              enseignantObj.nom = parts.length > 0 ? parts[parts.length - 1] : String(e.enseignant);
              enseignantObj.initiales = `${enseignantObj.prenom?.[0] || ''}${enseignantObj.nom?.[0] || ''}`;
            }

            return {
              id: e.id,
              heureDebut: startTime ? startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
              heureFin: e.endTime ? new Date(e.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
              jour,
              matiere: matchedMatiere ? { ...matchedMatiere } : { id: null, nom: e.title ?? '', code: (e.title || '').split(' ')[0], couleur: '#38BDF8' },
              enseignant: enseignantObj,
              salle: { id: null, nom: e.salle ?? '', batiment: '' },
              type: e.type ?? 'Cours',
              mention: { id: e.mentionId ?? null },
              parcours: parcoursObj ? { ...parcoursObj } : { id: e.parcoursId ?? null, code: e.parcoursId ?? '', nom: '' },
              niveau: e.niveau ?? null,
              groupe: e.groupe ?? null,
              note: e.note ?? null
            };
          });
        }
      } catch (err) {
        console.error('fetchEmplois error', err);
      } finally {
        this.loading = false;
        this.detecterConflits();
      }
    },

    async ajouterCreneau(data) {
      try {
        const payload = {
          title: data.matiere?.nom ?? data.title ?? '',
          description: data.description ?? '',
          startTime: new Date(`2026-06-15T${data.heureDebut}`),
          endTime: new Date(`2026-06-15T${data.heureFin}`),
          salle: data.salle?.nom ?? data.salle ?? '',
          enseignant: `${data.enseignant?.prenom ?? ''} ${data.enseignant?.nom ?? ''}`.trim(),
          type: data.type,
          // include optional meta fields so backend persists them
          mentionId: String(data.mention?.id ?? data.mention ?? ''),
          parcoursId: String(data.parcours?.id ?? data.parcours ?? ''),
          niveau: data.niveau ?? '',
          groupe: data.groupe ?? null,
          jour: data.jour ?? '',
          note: data.note ?? ''
        };

        const res = await fetch('/api/emploidutemps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || body?.error || res.statusText || 'Erreur lors de la création du créneau.');
        }

        const created = await res.json();
        const newCreneau = {
          ...data,
          id: created.id ?? data.id ?? Date.now(),
          enseignant: data.enseignant,
          salle: data.salle,
          matiere: data.matiere,
          mention: data.mention,
          parcours: data.parcours
        };

        this.emplois = [...this.emplois, newCreneau];
        this.detecterConflits();
        return newCreneau;
      } catch (err) {
        console.error('ajouterCreneau error', err);
        throw err;
      }
    },

    async modifierCreneau(id, data) {
      try {
        const payload = {
          title: data.matiere?.nom ?? data.title ?? '',
          description: data.description ?? '',
          startTime: data.startTime ?? (data.heureDebut ? new Date(`2026-06-15T${data.heureDebut}`) : undefined),
          endTime: data.endTime ?? (data.heureFin ? new Date(`2026-06-15T${data.heureFin}`) : undefined),
          salle: data.salle?.nom ?? data.salle ?? '',
          enseignant: data.enseignant?.prenom ? `${data.enseignant.prenom} ${data.enseignant.nom}` : (data.enseignant ?? ''),
          type: data.type ?? '',
          mentionId: String(data.mention?.id ?? data.mention ?? ''),
          parcoursId: String(data.parcours?.id ?? data.parcours ?? ''),
          niveau: data.niveau ?? '',
          groupe: data.groupe ?? null,
          jour: data.jour ?? '',
          note: data.note ?? ''
        };

        const res = await fetch(`/api/emploidutemps/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || body?.error || res.statusText || 'Erreur lors de la modification du créneau.');
        }

        const updated = await res.json().catch(() => null);
        const idx = this.emplois.findIndex(e => e.id === id);
        if (idx !== -1) {
          this.emplois[idx] = {
            ...this.emplois[idx],
            ...data,
            id: updated?.id ?? id
          };
          this.emplois = [...this.emplois];
          this.detecterConflits();
          return this.emplois[idx];
        }

        return data;
      } catch (err) {
        console.error('modifierCreneau error', err);
        throw err;
      }
    },

    async supprimerCreneau(id, deleteAllRecurrent = false) {
      try {
        const url = `/api/emploidutemps/${id}${deleteAllRecurrent ? '?recurrent=true' : ''}`;
        const res = await fetch(url, { method: 'DELETE' });
        if (res.ok) {
          const target = this.emplois.find(e => e.id === id);
          if (!target) return;
          if (deleteAllRecurrent && target.recurrent) {
            this.emplois = this.emplois.filter(e =>
              !(e.matiere.id === target.matiere.id && e.jour === target.jour)
            );
          } else {
            this.emplois = this.emplois.filter(e => e.id !== id);
          }
          this.detecterConflits();
        }
      } catch (err) {
        console.error('supprimerCreneau error', err);
      }
    },

    changerSemaine(dir) {
      const newDate = new Date(this.semaineCourante);
      newDate.setDate(newDate.getDate() + (dir * 7));
      this.semaineCourante = newDate;
    },
    ouvrirModal(c = null, defaultData = null) {
      this.creneauEnEdition = c ? { ...c } : null;
      this.donneesParDefaut = defaultData;
      this.modalOuverte = true;
    },
    fermerModal() {
      this.modalOuverte = false;
    },
    setZoom(val) {
      this.pixelsParMinute = Math.max(0.8, Math.min(2.5, val));
    }
  }
});
