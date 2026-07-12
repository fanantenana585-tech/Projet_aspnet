import { defineStore } from 'pinia';

export const useFiliereStore = defineStore('filiere', {
  state: () => ({
    mentions: [],
    parcours: [],
    loading: false,
    error: null,
    backendFilieres: []
  }),

  getters: {
    // Liste des mentions (Informatique, Économie, etc.)
    getMentions: (state) => state.mentions,

    // Liste complète de tous les parcours
    getAllParcours: (state) => state.parcours,

    // Obtenir les parcours d'une mention spécifique
    getParcoursByMention: (state) => (mentionId) => {
      return state.parcours.filter(p => p.mentionId === mentionId);
    },

    // Total des étudiants
    totalEtudiants: (state) => {
      return state.parcours.reduce((total, p) => total + (p.nbEtudiants || 0), 0);
    },

    // Total des parcours
    totalParcours: (state) => state.parcours.length
  },

  actions: {
    async fetchFilieresFromApi() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/filieres');
        if (!res.ok) throw new Error('Échec du chargement des filières');
        const data = await res.json();
        
        if (data.mentions) this.mentions = data.mentions;
        if (data.parcours) this.parcours = data.parcours;
      } catch (err) {
        console.error('fetchFilieresFromApi', err);
        this.error = 'Impossible de se connecter à la base de données.';
        this.mentions = [];
        this.parcours = [];
      } finally {
        this.loading = false;
      }
    },
    async ajouterFiliere(data) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/filieres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erreur création');
        const created = await res.json();
        this.parcours.unshift(created);
      } catch (err) {
        console.error('ajouterFiliere error:', err);
        throw err;
      }
    },
    async modifierFiliere(id, data) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/filieres/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erreur modification');
        const index = this.parcours.findIndex(p => p.id === id);
        if (index !== -1) {
          this.parcours[index] = { ...this.parcours[index], ...data };
        }
      } catch (err) {
        console.error('modifierFiliere error:', err);
        throw err;
      }
    },
    async supprimerFiliere(id) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/filieres/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur suppression');
        this.parcours = this.parcours.filter(p => p.id !== id);
      } catch (err) {
        console.error('supprimerFiliere error:', err);
        throw err;
      }
    }
  }
});
