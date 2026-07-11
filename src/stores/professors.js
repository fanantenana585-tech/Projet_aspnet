import { defineStore } from 'pinia'

export const useProfessorsStore = defineStore('professors', {
  state: () => ({
    professors: [
      { id: 1, nom: 'RAZAFINDRAKOTO', prenom: 'Andry', specialite: 'Développement Web (INFO)', mentionId: 'info', initiales: 'AR' },
      { id: 2, nom: 'RANDRIANARIVO', prenom: 'Lova', specialite: 'Base de Données (INFO)', mentionId: 'info', initiales: 'LR' },
      { id: 3, nom: 'RAKOTOMALALA', prenom: 'Hery', specialite: 'Management Stratégique (MGMT)', mentionId: 'mgmt', initiales: 'HR' },
      { id: 4, nom: 'ANDRIAMIFIDY', prenom: 'Sitraka', specialite: 'Économie (MGMT)', mentionId: 'mgmt', initiales: 'SA' },
      { id: 5, nom: 'RASOAMALALA', prenom: 'Miora', specialite: 'Communication (RPM)', mentionId: 'rpm', initiales: 'MR' },
      { id: 6, nom: 'RAVELOSON', prenom: 'Tahina', specialite: 'Multimédia (RPM)', mentionId: 'rpm', initiales: 'TR' }
    ],
    // Structure: { profId: { weekNum: { 'Lundi': [7, 8, 9], ... } } }
    // Initialized for week 1
    availabilities: {
      1: { 1: { 'Lundi': [7, 8, 9, 10, 11], 'Mardi': [14, 15, 16, 17], 'Mercredi': [8, 9, 10] } },
      2: { 1: { 'Lundi': [14, 15, 16], 'Mercredi': [7, 8, 9, 10, 11], 'Vendredi': [8, 9, 10] } },
      3: { 1: { 'Mardi': [7, 8, 9, 10, 11], 'Jeudi': [14, 15, 16, 17] } },
      4: { 1: { 'Lundi': [7, 8, 9, 10, 11, 14, 15, 16, 17], 'Vendredi': [14, 15, 16] } },
      5: { 1: { 'Mercredi': [14, 15, 16, 17], 'Samedi': [8, 9, 10, 11] } },
      6: { 1: { 'Jeudi': [7, 8, 9, 10, 11], 'Vendredi': [7, 8, 9, 10, 11] } }
    }
  }),
  getters: {
    getProfessorById: (state) => (id) => state.professors.find(p => p.id === id),
    isProfAvailable: (state) => (profId, week, day, hour) => {
      return state.availabilities[profId]?.[week]?.[day]?.includes(hour) || false
    }
  },
  actions: {
    updateAvailability(profId, week, day, hour) {
      if (!this.availabilities[profId]) this.availabilities[profId] = {}
      if (!this.availabilities[profId][week]) this.availabilities[profId][week] = {}
      if (!this.availabilities[profId][week][day]) this.availabilities[profId][week][day] = []

      const index = this.availabilities[profId][week][day].indexOf(hour)
      if (index === -1) {
        this.availabilities[profId][week][day].push(hour)
      } else {
        this.availabilities[profId][week][day].splice(index, 1)
      }
    }
  }
})
