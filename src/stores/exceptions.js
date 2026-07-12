import { defineStore } from 'pinia'

export const useExceptionsStore = defineStore('exceptions', {
  state: () => ({
    exceptions: []
  }),
  getters: {
    isWeekBlocked: (state) => (professorId, week) => {
      return state.exceptions.some(e => e.professorId === professorId && e.week === week)
    },
    getException: (state) => (professorId, week) => {
      return state.exceptions.find(e => e.professorId === professorId && e.week === week)
    }
  },
  actions: {
    async fetchExceptions() {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/exceptions');
        if (res.ok) {
          this.exceptions = await res.json();
        }
      } catch (err) {
        console.error('fetchExceptions error', err);
      }
    },
    async addException(exception) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/exceptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exception)
        });
        if (res.ok) {
          const created = await res.json();
          this.exceptions.push(created);
        }
      } catch (err) {
        console.error('addException error', err);
      }
    }
  }
})
