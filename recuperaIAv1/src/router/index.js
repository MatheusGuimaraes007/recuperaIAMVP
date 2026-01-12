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
import adminGuard from './guards/admin.guard'

// Routes
import authRoutes from './routes/auth.routes'
import dashboardRoutes from './routes/dashboard.routes'
import agentsRoutes from './routes/agents.routes'

// ============================================================================
// CONFIGURAÇÃO DO ROUTER
// ============================================================================

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: (to) => {
      // Redirecionar baseado no estado de autenticação
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? '/dashboard' : '/login'
    }
  },

  // Auth routes
  ...authRoutes,

  // Dashboard routes
  ...dashboardRoutes,

  // Feature routes
  ...agentsRoutes,

  // 404 - Deve ser a última rota
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/errors/NotFoundPage.vue'),
    meta: {
      title: 'Página Não Encontrada'
    }
  }
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

  // ⚠️ IMPORTANTE: Ordem correta dos guards
  // 1. Guest guard - impede autenticados de acessar páginas de login
  // 2. Auth guard - protege rotas autenticadas
  // 3. Admin guard - protege rotas admin
  // 4. Subscription guard - protege rotas de assinatura

  const guards = [
    guestGuard,        // Executar PRIMEIRO
    authGuard,
    adminGuard,
    subscriptionGuard
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
  document.title = title

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

  // Navegar para página de erro se existir
  if (router.hasRoute('server-error')) {
    router.push({
      name: 'server-error',
      params: { message: error.message }
    })
  }
})

export default router