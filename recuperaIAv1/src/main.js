import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

// Estilos globais
import './style.css'

// Configuração do app
const app = createApp(App)

// Pinia - State Management
const pinia = createPinia()
app.use(pinia)

// Vue Router
app.use(router)

// TanStack Query (Vue Query)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: parseInt(import.meta.env.VITE_QUERY_STALE_TIME) || 5 * 60 * 1000, // 5 minutos
        cacheTime: parseInt(import.meta.env.VITE_QUERY_CACHE_TIME) || 10 * 60 * 1000, // 10 minutos
        retry: parseInt(import.meta.env.VITE_QUERY_RETRY) || 3,
        refetchOnWindowFocus: import.meta.env.VITE_QUERY_REFETCH_ON_WINDOW_FOCUS === 'true',
        refetchOnReconnect: import.meta.env.VITE_QUERY_REFETCH_ON_RECONNECT === 'true',
      },
    },
  },
})

// Montar aplicação
app.mount('#app')

// Log de inicialização
if (import.meta.env.DEV) {
  console.log('🚀 Recupera.IA Frontend v3.0')
  console.log('📦 Ambiente:', import.meta.env.MODE)
  console.log('🔌 API Mode:', import.meta.env.VITE_API_MODE)
}
