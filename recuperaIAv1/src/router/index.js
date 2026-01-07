import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@pages/HomePage.vue'),
      meta: {
        title: 'Home',
        requiresAuth: false,
      },
    },
    // Rotas serão adicionadas nas próximas semanas
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guard para atualizar título da página
router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || 'Recupera.IA'
  document.title = to.meta.title ? `${to.meta.title} - ${appName}` : appName
})

export default router
