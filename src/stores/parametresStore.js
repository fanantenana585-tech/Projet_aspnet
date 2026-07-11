import { defineStore } from 'pinia'

export const useParametresStore = defineStore('parametres', {
  state: () => ({
    profil: {
      nom: 'BOTSOKAYA',
      prenom: 'Admin',
      email: 'admin@emit.mg',
      role: 'Administrateur',
      avatar: null,
      bio: 'Responsable de la gestion des emplois du temps à l\'EMIT.',
      telephone: '+261 34 00 000 00',
      poste: 'Chef de Département',
      departement: 'Informatique'
    },
    preferences: {
      langue: 'Français',
      timezone: 'Indian/Antananarivo',
      formatDate: 'DD/MM/YYYY',
      formatHeure: '24h',
      formatSemaine: 'Lundi'
    },
    notifications: {
      email: true,
      navigateur: true,
      sons: false,
      rappelCours: true,
      conflits: true,
      nouveautes: false
    },
    systeme: {
      anneeScolaire: '2025 - 2026',
      semaineDebut: '2025-09-01',
      creneauxHoraires: [
        { id: 1, debut: '07:30', fin: '09:00', label: 'Créneau 1' },
        { id: 2, debut: '09:15', fin: '10:45', label: 'Créneau 2' },
        { id: 3, debut: '11:00', fin: '12:30', label: 'Créneau 3' },
        { id: 4, debut: '14:00', fin: '15:30', label: 'Créneau 4' },
        { id: 5, debut: '15:45', fin: '17:15', label: 'Créneau 5' },
        { id: 6, debut: '17:30', fin: '19:00', label: 'Créneau 6' }
      ],
      joursActifs: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    },
    loading: false
  }),

  actions: {
    async updateProfil(data) {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 800))
      this.profil = { ...this.profil, ...data }
      this.loading = false
    },
    async updatePreferences(data) {
      this.preferences = { ...this.preferences, ...data }
    },
    async updateNotifications(data) {
      this.notifications = { ...this.notifications, ...data }
    },
    async updateSysteme(data) {
      this.systeme = { ...this.systeme, ...data }
    },
    async changerMotDePasse(ancien, nouveau) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    }
  }
})
