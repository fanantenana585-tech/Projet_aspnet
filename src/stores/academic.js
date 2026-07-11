import { defineStore } from 'pinia'

export const useAcademicStore = defineStore('academic', {
  state: () => ({
    mentions: [
      {
        id: 'info',
        name: 'Informatique',
        shortName: 'INFO',
        color: '#185FA5',
        levels: {
          'L1': ['AES', 'Info', 'ICM'],
          'L2': ['DA2I', 'CIGSI'],
          'L3': ['DA2I', 'CIGSI'],
          'M1': ['SIGD', 'M2I'],
          'M2': ['SIGD', 'M2I']
        }
      },
      {
        id: 'mgmt',
        name: 'Management',
        shortName: 'MGMT',
        color: '#533AB7',
        levels: {
          'L1': ['AES', 'Info', 'ICM'],
          'L2': ['AES'],
          'L3': ['AES'],
          'M1': ['MD'],
          'M2': ['MD']
        }
      },
      {
        id: 'rpm',
        name: 'Relations Publiques et Multimédia',
        shortName: 'RPM',
        color: '#993C1D',
        levels: {
          'L1': ['AES', 'Info', 'ICM'],
          'L2': ['CM', 'RPCO'],
          'L3': ['CM', 'RPCO'],
          'M1': ['CMN', 'RPC'],
          'M2': ['CMN', 'RPC']
        }
      }
    ],
    specializedTrainings: [
      'Géomatique',
      'Cartographie Numérique et Aménagement Durable',
      'Communication Numérique et Gestion de Projet'
    ],
    semesters: ['Semestre 1', 'Semestre 2']
  }),
  getters: {
    getMentionById: (state) => (id) => state.mentions.find(m => m.id === id),
    getPaths: (state) => (mentionId, level) => {
      const mention = state.mentions.find(m => m.id === mentionId)
      return mention ? (mention.levels[level] || []) : []
    }
  }
})
