import { defineStore } from 'pinia'

export const useExceptionsStore = defineStore('exceptions', {
  state: () => ({
    exceptions: [
      { id: 1, professorId: 2, week: 2, reason: 'Conférence internationale' },
      { id: 2, professorId: 4, week: 1, reason: 'Congé maladie' }
    ]
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
    addException(exception) {
      this.exceptions.push({
        id: Date.now(),
        ...exception
      })
    }
  }
})
