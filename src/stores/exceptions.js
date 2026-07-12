import { defineStore } from 'pinia'

export const useExceptionsStore = defineStore('exceptions', {
  state: () => ({
    exceptions: [],
    loading: false
  }),
  getters: {
    isWeekBlocked: (state) => (professorId, week) => {
      return state.exceptions.some(e => e.enseignantId === professorId && e.weekNumber === week)
    }
  },
  actions: {
    async fetchExceptions() {
      this.loading = true;
      try {
        const res = await fetch('/api/exceptions');
        if (res.ok) {
          this.exceptions = await res.json();
        }
      } catch (err) {
        console.error('fetchExceptions error', err);
      } finally {
        this.loading = false;
      }
    },
    async addException(exception) {
      try {
        const payload = {
            enseignantId: exception.professorId,
            weekNumber: exception.week,
            reason: exception.reason
        };
        const res = await fetch('/api/exceptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          this.exceptions.push(created);
        }
      } catch (err) {
        console.error('addException error', err);
      }
    },
    async deleteException(id) {
        try {
            const res = await fetch(`/api/exceptions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                this.exceptions = this.exceptions.filter(e => e.id !== id);
            }
        } catch (err) {
            console.error('deleteException error', err);
        }
    }
  }
})
