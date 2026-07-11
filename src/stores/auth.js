import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    role: null // 'admin' or 'enseignant'
  }),
  actions: {
    login(email, password) {
      // Mocked login logic
      if (email === 'admin@emit.mg' && password === 'password123') {
        this.user = { email, name: 'Administrateur' }
        this.isAuthenticated = true
        this.role = 'admin'
        return true
      } else if (email === 'enseignant@emit.mg' && password === 'password123') {
        this.user = { email, name: 'Enseignant' }
        this.isAuthenticated = true
        this.role = 'enseignant'
        return true
      }
      return false
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      this.role = null
    }
  }
})
