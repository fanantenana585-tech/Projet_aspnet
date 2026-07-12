import { defineStore } from 'pinia';

const S = 25; // semaine ISO 25

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
        const matchMention = state.filtres.mention === 'toutes' || e.mention.id === state.filtres.mention;
        const matchParcours = state.filtres.parcours === 'tous' || e.parcours.id === state.filtres.parcours;
        const matchNiveau = state.filtres.niveau === 'tous' || e.niveau === state.filtres.niveau;
        const matchType = state.filtres.type === 'tous' || e.type === state.filtres.type;
        const matchEnseignant = state.filtres.enseignant === 'tous' || e.enseignant.id === state.filtres.enseignant;
        const matchSalle = state.filtres.salle === 'tous' || e.salle.id === state.filtres.salle;

        return matchMention && matchParcours && matchNiveau && matchType && matchEnseignant && matchSalle;
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

    async fetchEmplois() {
      this.loading = true;
      try {
        const res = await fetch('/api/emploidutemps');
        if (res.ok) {
          const data = await res.json();
          // Map backend model to frontend expectation if needed
          this.emplois = data.map(e => ({
            id: e.id,
            heureDebut: new Date(e.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            heureFin: new Date(e.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            jour: new Date(e.startTime).toLocaleDateString('fr-FR', { weekday: 'long' }),
            matiere: { nom: e.title, code: e.title.split(' ')[0] },
            enseignant: { nom: e.enseignant },
            salle: { nom: e.salle },
            type: e.type
          }));
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
        // Map frontend format to backend format
        const payload = {
          title: data.matiere.nom,
          startTime: new Date(`2026-06-15T${data.heureDebut}`), // Placeholder date
          endTime: new Date(`2026-06-15T${data.heureFin}`),
          salle: data.salle.nom,
          enseignant: data.enseignant.nom,
          type: data.type
        };

        const res = await fetch('/api/emploidutemps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          this.emplois.push(data); // Push original data for UI consistency or handle mapping
          this.detecterConflits();
        }
      } catch (err) {
        console.error('ajouterCreneau error', err);
      }
    },

    async modifierCreneau(id, data) {
      try {
        const res = await fetch(`/api/emploidutemps/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const idx = this.emplois.findIndex(e => e.id === id);
          if (idx !== -1) {
            this.emplois[idx] = { ...this.emplois[idx], ...data };
            this.detecterConflits();
          }
        }
      } catch (err) {
        console.error('modifierCreneau error', err);
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
