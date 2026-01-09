/**
 * Vue Router - Index
 *
 * Configuração central do Vue Router com guards e rotas.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.store'
import { useUIStore } from '@/stores/modules/ui.store'

// Guards
import authGuard from './guards/auth.guard'

import subscriptionGuard from './guards/subscription.guard'
import guestGuard from './guards/guest.guard'

// Routes
import authRoutes from './routes/auth.routes'
// import dashboardRoutes from './routes/dashboard.routes'
// import clientsRoutes from './routes/clients.routes'
// import opportunitiesRoutes from './routes/opportunities.routes'
// import agentsRoutes from './routes/agents.routes'
// import productsRoutes from './routes/products.routes'
// import adminRoutes from './routes/admin.routes'
// import profileRoutes from './routes/profile.routes'
// import knowledgeBaseRoutes from "@router/routes/knowledgeBase.routes.js";
// import errorRoutes from "@router/routes/error.routes.js";
import adminGuard from "@router/guards/admin.guard.js";

// ============================================================================
// CONFIGURAÇÃO DO ROUTER
// ============================================================================

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard'
  },

  // Auth routes
  ...authRoutes,

  // // Dashboard routes
  // ...dashboardRoutes,
  //
  // // Feature routes
  // ...clientsRoutes,
  // ...opportunitiesRoutes,
  // ...agentsRoutes,
  // ...productsRoutes,
  // ...knowledgeBaseRoutes,
  //
  // // Admin routes
  // ...adminRoutes,
  //
  // // Profile routes
  // ...profileRoutes,
  //
  // // Error routes
  // ...errorRoutes,

  // 404 - Deve ser a última rota
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: () => import('@/pages/errors/NotFoundPage.vue'),
  //   meta: {
  //     title: 'Página Não Encontrada'
  //   }
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// ============================================================================
// NAVIGATION GUARDS
// ============================================================================

/**
 * Before Each - Executa antes de cada navegação
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  // Garantir que auth foi inicializado
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }

  // Aplicar guards em ordem
  const guards = [
    guestGuard,        // Redireciona autenticados de páginas guest
    authGuard,         // Protege rotas autenticadas
    adminGuard,        // Protege rotas admin
    subscriptionGuard  // Protege rotas de assinatura
  ]

  // Executar guards sequencialmente
  for (const guard of guards) {
    const result = await new Promise((resolve) => {
      guard(to, from, (value) => resolve(value))
    })

    // Se guard retornou algo diferente de undefined, interromper
    if (result !== undefined) {
      next(result)
      return
    }
  }

  // Fechar mobile menu ao navegar
  if (uiStore.isMobileMenuOpen) {
    uiStore.closeMobileMenu()
  }

  next()
})

/**
 * After Each - Executa após cada navegação
 */
router.afterEach((to) => {
  const uiStore = useUIStore()

  // Atualizar page title
  const title = to.meta.title || 'Recupera.IA'
  uiStore.setPageTitle(title)

  // Atualizar breadcrumbs se definido
  if (to.meta.breadcrumb) {
    uiStore.setBreadcrumbs(to.meta.breadcrumb)
  } else {
    uiStore.clearBreadcrumbs()
  }

  // Analytics tracking (se configurado)
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_ID, {
      page_path: to.fullPath,
      page_title: title
    })
  }
})

/**
 * Error Handler
 */
router.onError((error) => {
  console.error('Router Error:', error)

  // Navegar para página de erro
  router.push({
    name: 'server-error',
    params: { message: error.message }
  })
})

export default router