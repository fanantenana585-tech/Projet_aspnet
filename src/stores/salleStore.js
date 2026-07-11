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
      await new Promise(resolve => setTimeout(resolve, 800));

      this.salles = [
        { id: 1, nom: 'Salle A101', type: 'Salle de cours', capacite: 30, batiment: 'Bâtiment A', etage: 1, equipements: ['Vidéoprojecteur', 'Tableau blanc', 'WiFi'], statut: 'disponible', tauxOccupation: 75 },
        { id: 2, nom: 'Amphi 1', type: 'Amphithéâtre', capacite: 120, batiment: 'Bâtiment A', etage: 0, equipements: ['Vidéoprojecteur', 'Sono', 'Climatisation', 'WiFi'], statut: 'occupée', tauxOccupation: 90 },
        { id: 3, nom: 'Labo Info 2', type: 'Laboratoire', capacite: 25, batiment: 'Bâtiment B', etage: 2, equipements: ['Ordinateurs', 'WiFi', 'Tableau blanc'], statut: 'disponible', tauxOccupation: 60 },
        { id: 4, nom: 'Salle B204', type: 'Salle TD', capacite: 20, batiment: 'Bâtiment B', etage: 2, equipements: ['Tableau blanc', 'WiFi'], statut: 'maintenance', tauxOccupation: 40 },
        { id: 5, nom: 'Salle A102', type: 'Salle de cours', capacite: 50, batiment: 'Bâtiment A', etage: 1, equipements: ['Vidéoprojecteur', 'Tableau blanc', 'WiFi'], statut: 'disponible', tauxOccupation: 65 },
        { id: 6, nom: 'Amphi 2', type: 'Amphithéâtre', capacite: 150, batiment: 'Bâtiment C', etage: 0, equipements: ['Vidéoprojecteur', 'Sono', 'Climatisation', 'WiFi'], statut: 'occupée', tauxOccupation: 85 },
        { id: 7, nom: 'Labo Info 1', type: 'Laboratoire', capacite: 25, batiment: 'Bâtiment B', etage: 1, equipements: ['Ordinateurs', 'WiFi', 'Tableau interactif'], statut: 'disponible', tauxOccupation: 55 },
        { id: 8, nom: 'Salle C101', type: 'Salle de cours', capacite: 40, batiment: 'Bâtiment C', etage: 1, equipements: ['Vidéoprojecteur', 'WiFi'], statut: 'disponible', tauxOccupation: 70 },
        { id: 9, nom: 'Salle A201', type: 'Salle TD', capacite: 25, batiment: 'Bâtiment A', etage: 2, equipements: ['Tableau blanc', 'WiFi', 'Climatisation'], statut: 'occupée', tauxOccupation: 80 },
        { id: 10, nom: 'Salle B101', type: 'Salle de cours', capacite: 35, batiment: 'Bâtiment B', etage: 1, equipements: ['Vidéoprojecteur', 'Tableau blanc'], statut: 'maintenance', tauxOccupation: 30 },
        { id: 11, nom: 'Amphi 3', type: 'Amphithéâtre', capacite: 100, batiment: 'Bâtiment C', etage: 0, equipements: ['Vidéoprojecteur', 'Sono', 'WiFi'], statut: 'disponible', tauxOccupation: 60 },
        { id: 12, nom: 'Labo Info 3', type: 'Laboratoire', capacite: 20, batiment: 'Bâtiment B', etage: 2, equipements: ['Ordinateurs', 'WiFi', 'Webcam'], statut: 'disponible', tauxOccupation: 50 }
      ];
      this.loading = false;
    },

    ajouterSalle(data) {
      this.salles.unshift({
        id: this.salles.length + 1,
        ...data,
        tauxOccupation: 0
      });
    },

    modifierSalle(id, data) {
      const index = this.salles.findIndex(s => s.id === id);
      if (index !== -1) {
        this.salles[index] = { ...this.salles[index], ...data };
      }
    },

    supprimerSalle(id) {
      this.salles = this.salles.filter(s => s.id !== id);
    }
  }
})
