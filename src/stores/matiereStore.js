import { defineStore } from 'pinia';

export const MENTIONS_EMIT = [
  {
    id: 'mention-info',
    nom: 'Informatique',
    couleur: '#38BDF8',
    icone: '💻',
    parcours: [
      { id: 'DA2I',  nom: 'Développement d\'Application Internet/Intranet',          niveau: 'Licence', code: 'DA2I',  couleur: '#0EA5E9' },
      { id: 'CIGSI', nom: 'Conception, Intégration et Gestion des Systèmes d\'Information', niveau: 'Licence', code: 'CIGSI', couleur: '#38BDF8' },
      { id: 'SIGD',  nom: 'Systèmes d\'Information, Géomatique et Décision',          niveau: 'Master',  code: 'SIGD',  couleur: '#0284C7' },
      { id: 'M2I',   nom: 'Modélisation et Ingénierie Informatique',                  niveau: 'Master',  code: 'M2I',   couleur: '#2563EB' },
      { id: 'GEO',   nom: 'Géomatique et Cartographie Numérique',                     niveau: 'Licence', code: 'GEO',   couleur: '#6D28D9' },
    ]
  },
  {
    id: 'mention-mgt',
    nom: 'Management',
    couleur: '#059669',
    icone: '📊',
    parcours: [
      { id: 'AES', nom: 'Administration Économique et Sociale', niveau: 'Licence', code: 'AES', couleur: '#10B981' },
      { id: 'MD',  nom: 'Management Décisionnel',               niveau: 'Master',  code: 'MD',  couleur: '#059669' },
    ]
  },
  {
    id: 'mention-rpm',
    nom: 'Relations Publiques et Multimédia',
    couleur: '#EC4899',
    icone: '📢',
    parcours: [
      { id: 'CM',   nom: 'Communication Multimédia',                      niveau: 'Licence', code: 'CM',   couleur: '#F472B6' },
      { id: 'RPCO', nom: 'Relations Publiques et Communication Organisationnelle', niveau: 'Licence', code: 'RPCO', couleur: '#EC4899' },
      { id: 'CMN',  nom: 'Communications et Médias Numériques',            niveau: 'Master',  code: 'CMN',  couleur: '#DB2777' },
      { id: 'RPC',  nom: 'Relations Publiques et Communications',           niveau: 'Master',  code: 'RPC',  couleur: '#BE185D' },
      { id: 'ICM',  nom: 'Information et Communication Multimédia',         niveau: 'Licence', code: 'ICM',  couleur: '#F43F5E' },
      { id: 'CNGP', nom: 'Communication Numérique et Gestion de Projet',    niveau: 'Licence', code: 'CNGP', couleur: '#E11D48' },
    ]
  }
];

export const useMatiereStore = defineStore('matiere', {
  state: () => ({
    matieres: [],
    matiereSelectionnee: null,
    filtres: {
      search: '',
      mention: 'toutes',
      parcours: 'tous',
      niveau: 'tous',
      semestre: 'tous',
      type: 'tous',
      statut: 'actif'
    },
    loading: false,
    error: null,
    drawerOuvert: false,
    modalOuverte: false,
    matiereEnEdition: null,
    modeVue: 'cartes' // 'cartes' | 'liste' | 'dashboard'
  }),
  getters: {
    matieresFiltrees: (state) => {
      return state.matieres.filter(m => {
        const matchSearch = state.filtres.search === '' ||
          (m.nom && m.nom.toLowerCase().includes(state.filtres.search.toLowerCase())) ||
          (m.code && m.code.toLowerCase().includes(state.filtres.search.toLowerCase()));

        const matchMention = state.filtres.mention === 'toutes' || m.mentionId === state.filtres.mention;
        const matchParcours = state.filtres.parcours === 'tous' || m.parcours === state.filtres.parcours;
        const matchNiveau = state.filtres.niveau === 'tous' || m.niveau === state.filtres.niveau;
        const matchSemestre = state.filtres.semestre === 'tous' || m.semestre === state.filtres.semestre;
        const matchType = state.filtres.type === 'tous' || (m.type && m.type.includes(state.filtres.type));
        const matchStatut = state.filtres.statut === 'tous' || m.statut === state.filtres.statut;

        return matchSearch && matchMention && matchParcours && matchNiveau && matchSemestre && matchType && matchStatut;
      });
    },
    statsGlobales: (state) => {
      const actives = state.matieres.filter(m => m.statut === 'actif').length;
      const totalCredits = state.matieres.reduce((acc, m) => acc + (m.credits || 0), 0);
      const mentions = [...new Set(state.matieres.map(m => m.mentionId))].length;
      return {
        total: state.matieres.length,
        actives,
        creditsMoyens: state.matieres.length ? (totalCredits / state.matieres.length).toFixed(1) : 0,
        mentions
      };
    }
  },
  actions: {
    ouvrirDetail(matiere) {
      // Reconstruct volumeHoraire from separate fields if needed
      if (!matiere.volumeHoraire) {
        matiere.volumeHoraire = {
          cours: matiere.volumeCours || 0,
          td: matiere.volumeTd || 0,
          tp: matiere.volumeTp || 0,
          projet: matiere.volumeProjet || 0
        };
      }
      this.matiereSelectionnee = matiere;
      this.drawerOuvert = true;
    },
    fermerDetail() {
      this.drawerOuvert = false;
    },
    ouvrirModal(matiere = null) {
      if (matiere && !matiere.volumeHoraire) {
        matiere.volumeHoraire = {
          cours: matiere.volumeCours || 0,
          td: matiere.volumeTd || 0,
          tp: matiere.volumeTp || 0,
          projet: matiere.volumeProjet || 0
        };
      }
      this.matiereEnEdition = matiere ? { ...matiere } : null;
      this.modalOuverte = true;
    },
    fermerModal() {
      this.modalOuverte = false;
    },
    async fetchMatieres() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch('/api/matieres');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.Detailed || errorData.Message || 'Échec du chargement des matières');
        }
        const data = await res.json();
        // Map backend fields to frontend expected fields if necessary
        this.matieres = data.map(m => ({
          ...m,
          type: typeof m.type === 'string' ? m.type.split(', ') : (Array.isArray(m.type) ? m.type : []),
          volumeHoraire: {
            cours: m.volumeCours || 0,
            td: m.volumeTd || 0,
            tp: m.volumeTp || 0,
            projet: m.volumeProjet || 0
          }
        }));
      } catch (err) {
        console.error('fetchMatieres', err);
        this.error = `Erreur backend: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    async ajouterMatiere(data) {
      try {
        // Map frontend fields to backend
        const payload = {
          ...data,
          type: Array.isArray(data.type) ? data.type.join(', ') : data.type,
          volumeCours: data.volumeHoraire?.cours || 0,
          volumeTd: data.volumeHoraire?.td || 0,
          volumeTp: data.volumeHoraire?.tp || 0,
          volumeProjet: data.volumeHoraire?.projet || 0
        };
        delete payload.volumeHoraire;

        const res = await fetch('/api/matieres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Erreur création');
        const created = await res.json();
        // Add back volumeHoraire for frontend
        created.volumeHoraire = { ...data.volumeHoraire };
        this.matieres.unshift(created);
      } catch (err) {
        console.error('ajouterMatiere', err);
        throw err;
      }
    },
    async modifierMatiere(id, data) {
      try {
        const payload = {
          ...data,
          type: Array.isArray(data.type) ? data.type.join(', ') : data.type,
          volumeCours: data.volumeHoraire?.cours || 0,
          volumeTd: data.volumeHoraire?.td || 0,
          volumeTp: data.volumeHoraire?.tp || 0,
          volumeProjet: data.volumeHoraire?.projet || 0
        };
        delete payload.volumeHoraire;

        const res = await fetch(`/api/matieres/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Erreur modification');
        const index = this.matieres.findIndex(m => m.id === id);
        if (index !== -1) {
          this.matieres[index] = { ...data };
        }
      } catch (err) {
        console.error('modifierMatiere', err);
        throw err;
      }
    },
    async supprimerMatiere(id) {
      try {
        const res = await fetch(`/api/matieres/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur suppression');
        this.matieres = this.matieres.filter(m => m.id !== id);
      } catch (err) {
        console.error('supprimerMatiere', err);
        throw err;
      }
    }
  }
});
