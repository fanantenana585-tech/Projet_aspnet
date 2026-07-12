import { defineStore } from 'pinia'

export const useSalleStore = defineStore('salle', {
  state: () => ({
    salles: [],
    salleSelectionnee: null,
    filtres: {
      search: '',
      type: 'Tous',
      batiment: 'Tous',
      capacite: 0,
      disponibilite: 'Tous'
    },
    loading: false,
    viewMode: 'grid' // 'grid', 'list', or 'map'
  }),

  getters: {
    sallesFiltrees: (state) => {
      return state.salles.filter(s => {
        const matchesSearch = s.nom.toLowerCase().includes(state.filtres.search.toLowerCase());
        const matchesType = state.filtres.type === 'Tous' || s.type === state.filtres.type;
        const matchesBatiment = state.filtres.batiment === 'Tous' || s.batiment === state.filtres.batiment;
        const matchesCapacite = s.capacite >= state.filtres.capacite;
        const matchesDisponibilite = state.filtres.disponibilite === 'Tous' || s.statut === state.filtres.disponibilite.toLowerCase();

        return matchesSearch && matchesType && matchesBatiment && matchesCapacite && matchesDisponibilite;
      });
    },
    stats: (state) => {
      const total = state.salles.length;
      const disponible = state.salles.filter(s => s.statut === 'disponible').length;
      const occupee = state.salles.filter(s => s.statut === 'occupée').length;
      const maintenance = state.salles.filter(s => s.statut === 'maintenance').length;
      const tauxMoyen = total > 0 ? Math.round(state.salles.reduce((acc, s) => acc + s.tauxOccupation, 0) / total) : 0;

      return { disponible, occupee, maintenance, tauxMoyen };
    }
  },

  actions: {
    async fetchSalles() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch('/api/salles');
        if (!res.ok) throw new Error('Échec du chargement des salles');
        this.salles = await res.json();
      } catch (err) {
        console.error('fetchSalles', err);
        this.error = 'Impossible de se connecter à la base de données.';
        this.salles = [];
      } finally {
        this.loading = false;
      }
    },

    async ajouterSalle(data) {
      try {
        const res = await fetch('/api/salles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erreur création');
        const created = await res.json();
        this.salles.unshift(created);
      } catch (err) {
        console.error('ajouterSalle', err);
        throw err;
      }
    },

    async modifierSalle(id, data) {
      try {
        const res = await fetch(`/api/salles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erreur modification');
        const index = this.salles.findIndex(s => s.id === id);
        if (index !== -1) {
          this.salles[index] = { ...this.salles[index], ...data };
        }
      } catch (err) {
        console.error('modifierSalle', err);
        throw err;
      }
    },

    async supprimerSalle(id) {
      try {
        const res = await fetch(`/api/salles/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur suppression');
        this.salles = this.salles.filter(s => s.id !== id);
      } catch (err) {
        console.error('supprimerSalle', err);
        throw err;
      }
    }
  }
})
