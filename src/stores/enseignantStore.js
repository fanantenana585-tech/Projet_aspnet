import { defineStore } from 'pinia'

export const useEnseignantStore = defineStore('enseignant', {
  state: () => ({
    enseignants: [],
    enseignantSelectionne: null,
    filtres: {
      search: '',
      specialite: 'Toutes',
      statut: 'Tous'
    },
    loading: false,
    viewMode: 'grid' // 'grid' or 'list'
  }),

  getters: {
    enseignantsFiltres: (state) => {
      return state.enseignants.filter(e => {
        const matchesSearch =
          e.nom.toLowerCase().includes(state.filtres.search.toLowerCase()) ||
          e.prenom.toLowerCase().includes(state.filtres.search.toLowerCase()) ||
          e.email.toLowerCase().includes(state.filtres.search.toLowerCase()) ||
          e.specialite.toLowerCase().includes(state.filtres.search.toLowerCase());

        const matchesSpecialite = state.filtres.specialite === 'Toutes' || e.specialite === state.filtres.specialite;
        const matchesStatut = state.filtres.statut === 'Tous' || e.statut === state.filtres.statut;

        return matchesSearch && matchesSpecialite && matchesStatut;
      });
    },
    totalEnseignants: (state) => state.enseignants.length
  },

  actions: {
    async fetchEnseignants() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/enseignants');
        if (!res.ok) throw new Error('Échec du chargement des enseignants');
        this.enseignants = await res.json();
      } catch (err) {
        console.error('fetchEnseignants', err);
        this.error = 'Impossible de se connecter à la base de données.';
        this.enseignants = []; // Fallback to empty
      } finally {
        this.loading = false;
      }
    },

    async ajouterEnseignant(data) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/enseignants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erreur création');
        const created = await res.json();
        this.enseignants.unshift(created);
      } catch (err) {
        console.error('ajouterEnseignant', err);
        throw err;
      }
    },

    async modifierEnseignant(id, data) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/enseignants/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erreur modification');
        const index = this.enseignants.findIndex(e => e.id === id);
        if (index !== -1) {
          this.enseignants[index] = { ...this.enseignants[index], ...data };
        }
      } catch (err) {
        console.error('modifierEnseignant', err);
        throw err;
      }
    },

    async supprimerEnseignant(id) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/enseignants/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur suppression');
        this.enseignants = this.enseignants.filter(e => e.id !== id);
      } catch (err) {
        console.error('supprimerEnseignant', err);
        throw err;
      }
    },

    setFiltre(key, value) {
      this.filtres[key] = value;
    },

    resetFiltres() {
      this.filtres = {
        search: '',
        specialite: 'Toutes',
        statut: 'Tous'
      };
    },

    toggleViewMode() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    }
  }
})
