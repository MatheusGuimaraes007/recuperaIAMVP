<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useUIStore } from './stores/modules/ui.store'
import RSpinner from './components/atoms/feedback/RSpinner.vue'
import RText from './components/atoms/typography/RText.vue'

const uiStore = useUIStore()
const route = useRoute()


/**
 * Fechar mobile menu ao trocar de rota
 */
watch(() => route.path, () => {
  if (uiStore.isMobileMenuOpen) {
    uiStore.closeMobileMenu()
  }
})

/**
 * Scroll to top ao trocar de rota (exceto quando há hash)
 */
watch(() => route.path, () => {
  if (!route.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <div
      id="app"
      class="min-h-screen bg-gray-50"
      :class="{ 'dark': uiStore.isDarkMode }"
  >
    <!-- ========================================================================
         GLOBAL LOADING OVERLAY
         Mostrado quando uiStore.globalLoading = true
    ========================================================================= -->
    <Transition name="fade">
      <div
          v-if="uiStore.globalLoading"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-message"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center space-y-4 max-w-sm">
          <RSpinner size="lg" class="text-green-600" />
          <RText
              id="loading-message"
              class="text-gray-700 dark:text-gray-300 text-center font-medium"
          >
            {{ uiStore.loadingMessage || 'Carregando...' }}
          </RText>
        </div>
      </div>
    </Transition>

    <!-- ========================================================================
         ROUTER VIEW
         Renderiza o componente da rota atual com transição
    ========================================================================= -->
    <RouterView v-slot="{ Component, route }">
      <Transition
          :name="route.meta.transition || 'fade'"
          mode="out-in"
      >
        <component
            :is="Component"
            :key="route.path"
        />
      </Transition>
    </RouterView>

    <!-- ========================================================================
         TOASTER (VUE SONNER)
         Sistema de notificações toast
    ========================================================================= -->
    <Toaster
        position="top-right"
        :theme="uiStore.theme"
        :duration="4000"
        :close-button="true"
        :rich-colors="true"
        :expand="false"
        :toast-options="{
        style: {
          background: uiStore.isDarkMode ? '#1F2937' : 'white',
          color: uiStore.isDarkMode ? '#F3F4F6' : '#212529',
          border: `1px solid ${uiStore.isDarkMode ? '#374151' : '#E9ECEF'}`,
        },
        className: 'custom-toast',
      }"
    />
  </div>
</template>

<style>


.dark {
  background-color: #0A0B0D;
  color: #F3F4F6;
}

.dark .bg-gray-50 {
  background-color: #1F2937;
}

.dark .bg-white {
  background-color: #111827;
}

.dark .text-gray-900 {
  color: #F3F4F6;
}

.dark .text-gray-600 {
  color: #D1D5DB;
}

/* ============================================================================
   SCROLLBAR STYLES
============================================================================ */

/* Webkit browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #F8F9FA;
}

::-webkit-scrollbar-thumb {
  background: #DEE2E6;
  border-radius: 6px;
  border: 3px solid #F8F9FA;
}

::-webkit-scrollbar-thumb:hover {
  background: #CED4DA;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1F2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #374151;
  border-color: #1F2937;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #DEE2E6 #F8F9FA;
}

.dark * {
  scrollbar-color: #374151 #1F2937;
}

/* ============================================================================
   FOCUS VISIBLE STYLES (Acessibilidade)
============================================================================ */

*:focus-visible {
  outline: 2px solid #00C853;
  outline-offset: 2px;
  border-radius: 4px;
}

/* ============================================================================
   SELECTION STYLES
============================================================================ */

::selection {
  background-color: #00C853;
  color: white;
}

::-moz-selection {
  background-color: #00C853;
  color: white;
}

/* ============================================================================
   PRINT STYLES
============================================================================ */

@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white;
    color: black;
  }
}

/* ============================================================================
   LOADING ANIMATION
============================================================================ */

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>