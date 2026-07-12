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
    async fetchSettings() {
      this.loading = true
      try {
        const keys = ['profil', 'preferences', 'notifications', 'systeme']
        for (const key of keys) {
          const res = await fetch(`/api/settings/${key}`)
          if (res.ok) {
            this[key] = await res.json()
          }
        }
      } catch (err) {
        console.error('fetchSettings error', err)
      } finally {
        this.loading = false
      }
    },
    async updateProfil(data) {
      this.loading = true
      try {
        const res = await fetch('/api/settings/profil', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (res.ok) {
          this.profil = { ...this.profil, ...data }
        }
      } finally {
        this.loading = false
      }
    },
    async updatePreferences(data) {
      const res = await fetch('/api/settings/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        this.preferences = { ...this.preferences, ...data }
      }
    },
    async updateNotifications(data) {
      const res = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        this.notifications = { ...this.notifications, ...data }
      }
    },
    async updateSysteme(data) {
      const res = await fetch('/api/settings/systeme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        this.systeme = { ...this.systeme, ...data }
      }
    },
    async changerMotDePasse(ancien, nouveau) {
      // Logic for password change would typically go to AuthController
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ancien, nouveau })
      })
      return res.ok
    }
  }
})
