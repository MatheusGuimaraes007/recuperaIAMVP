/**
 * Main.js - Entry Point da Aplicação
 * Recupera.IA Frontend v3.0
 *
 * Inicializa Vue 3, Pinia, TanStack Query, Router e Auth.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

// Estilos globais
import './style.css'

// TanStack Query Client
import { queryClient } from './lib/tanstack-query/client'

// Stores
import { useAuthStore } from './stores/modules/auth.store'
import { useUIStore } from './stores/modules/ui.store'

// ============================================================================
// CRIAR APLICAÇÃO
// ============================================================================

const app = createApp(App)

// ============================================================================
// PINIA - STATE MANAGEMENT
// ============================================================================

const pinia = createPinia()

// Plugin de persistência (localStorage)
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// ============================================================================
// TANSTACK QUERY (VUE QUERY)
// ============================================================================

app.use(VueQueryPlugin, {
  queryClient,
  enableDevtools: import.meta.env.DEV
})

// ============================================================================
// VUE ROUTER
// ============================================================================

app.use(router)

// ============================================================================
// INICIALIZAÇÃO ASSÍNCRONA
// ============================================================================

/**
 * Inicializa a aplicação de forma assíncrona
 * Garante que auth está pronto antes de montar o app
 */
const initializeApp = async () => {
  try {
    console.log('🚀 Inicializando Recupera.IA...')

    // Obter stores
    const authStore = useAuthStore()
    const uiStore = useUIStore()

    // 1. Inicializar tema
    uiStore.initTheme()
    console.log('🎨 Tema inicializado')

    // 2. Inicializar autenticação
    await authStore.initializeAuth()
    console.log('🔐 Autenticação inicializada')

    // 3. Montar aplicação
    app.mount('#app')
    console.log('✅ Aplicação montada com sucesso')

    // Log de ambiente (apenas DEV)
    if (import.meta.env.DEV) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📦 Ambiente:', import.meta.env.MODE)
      console.log('🔌 API Mode:', import.meta.env.VITE_API_MODE)
      console.log('👤 Autenticado:', authStore.isAuthenticated)
      console.log('🌐 URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }

  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error)

    // Mesmo com erro, montar app para mostrar página de erro
    app.mount('#app')
  }
}

// Inicializar aplicação
initializeApp()

// ============================================================================
// ERROR HANDLERS GLOBAIS
// ============================================================================

/**
 * Handler de erros não capturados
 */
app.config.errorHandler = (err, instance, info) => {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('❌ Global Error Handler')
  console.error('Error:', err)
  console.error('Component:', instance?.$options?.name || 'Unknown')
  console.error('Info:', info)
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // TODO: Enviar para serviço de tracking (Sentry, LogRocket, etc)
  if (import.meta.env.PROD && window.Sentry) {
    window.Sentry.captureException(err, {
      contexts: {
        vue: {
          componentName: instance?.$options?.name,
          info
        }
      }
    })
  }
}

/**
 * Handler de warnings (apenas DEV)
 */
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('⚠️ Vue Warning:', msg)
    if (trace) {
      console.warn('Trace:', trace)
    }
  }
}

/**
 * Handler de performance (apenas DEV)
 */
if (import.meta.env.DEV) {
  app.config.performance = true
}

// ============================================================================
// UNHANDLED PROMISE REJECTION
// ============================================================================

window.addEventListener('unhandledrejection', (event) => {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('❌ Unhandled Promise Rejection')
  console.error('Reason:', event.reason)
  console.error('Promise:', event.promise)
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Prevenir erro padrão
  event.preventDefault()

  // TODO: Enviar para serviço de tracking
  if (import.meta.env.PROD && window.Sentry) {
    window.Sentry.captureException(event.reason)
  }
})