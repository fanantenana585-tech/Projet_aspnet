import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    role: localStorage.getItem('role') || null // 'Admin' or 'User'
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Échec de connexion')
        }

        const data = await res.json()

        this.token = data.token
        this.user = { email: data.email, id: data.userId }
        this.role = data.role
        this.isAuthenticated = true

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('role', data.role)

        return true
      } catch (err) {
        console.error('Login error:', err)
        return false
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    }
  }
})
