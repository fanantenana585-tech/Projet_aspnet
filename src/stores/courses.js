import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: []
  }),
  getters: {
    getFilteredCourses: (state) => (filters) => {
      return state.courses.filter(course => {
        if (filters.mentionId && course.mentionId !== filters.mentionId) return false
        if (filters.level && course.level !== filters.level) return false
        if (filters.path && course.path !== filters.path) return false
        if (filters.week && course.week !== filters.week) return false
        if (filters.professorId && course.professorId !== filters.professorId) return false
        if (filters.semester && course.semester !== filters.semester) return false
        return true
      })
    }
  },
  actions: {
    async fetchCourses() {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/courses');
        if (res.ok) {
          this.courses = await res.json();
        }
      } catch (err) {
        console.error('fetchCourses error', err);
      }
    },

    async addCourse(course) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course)
        });
        if (res.ok) {
          const created = await res.json();
          this.courses.push(created);
        }
      } catch (err) {
        console.error('addCourse error', err);
      }
    },

    async removeCourse(id) {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/courses/${id}`, { method: 'DELETE' });
        if (res.ok) {
          this.courses = this.courses.filter(c => c.id !== id);
        }
      } catch (err) {
        console.error('removeCourse error', err);
      }
    }
  }
})
