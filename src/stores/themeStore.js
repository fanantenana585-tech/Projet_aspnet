import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: localStorage.getItem('theme-mode') || 'sombre',
    couleurAccent: localStorage.getItem('theme-accent') || '#3B82F6',
    police: 'Inter',
    taillePolice: 14,
    densite: 'Normal'
  }),

  actions: {
    setMode(mode) {
      this.mode = mode
      localStorage.setItem('theme-mode', mode)
      document.documentElement.classList.toggle('dark', mode !== 'clair')
    },
    setCouleurAccent(couleur) {
      this.couleurAccent = couleur
      localStorage.setItem('theme-accent', couleur)
      document.documentElement.style.setProperty('--emit-blue', couleur)
    },
    updateTheme(data) {
      Object.assign(this, data)
    }
  }
})
