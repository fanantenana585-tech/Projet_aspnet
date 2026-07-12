import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          redirect: 'filieres'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: 'Tableau de Bord' }
        },
        {
          path: 'enseignants',
          name: 'enseignants',
          component: () => import('../views/EnseignantsView.vue'),
          meta: { title: 'Gestion des Enseignants' }
        },
        {
          path: 'salles',
          name: 'salles',
          component: () => import('../views/SallesView.vue'),
          meta: { title: 'Gestion des Salles' }
        },
        {
          path: 'matieres',
          name: 'matieres',
          component: () => import('../views/MatieresView.vue'),
          meta: { title: 'Gestion des Matières' }
        },
        {
          path: 'filieres',
          name: 'filieres',
          component: () => import('../views/FilieresView.vue'),
          meta: { title: 'Gestion des Filières' }
        },
        {
          path: 'emplois-du-temps',
          name: 'emplois-du-temps',
          component: () => import('../views/EmploisDuTempsView.vue'),
          meta: { title: 'Emploi du Temps EMIT' }
        },
        {
          path: 'exceptions',
          name: 'exceptions',
          component: () => import('../views/ExceptionsView.vue'),
          meta: { title: 'Exceptions Plannings' }
        },
        {
          path: 'liste-cours',
          name: 'liste-cours',
          component: () => import('../views/CoursesListView.vue'),
          meta: { title: 'Liste des Cours' }
        },
        {
          path: 'parametres',
          name: 'parametres',
          component: () => import('../views/ParametresView.vue'),
          meta: { title: 'Paramètres Système' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Dynamic Title
  document.title = `${to.meta.title || 'EMIT'} - Gestion Scolaire`
  next()
})

export default router
