<script setup>
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'

// Log de inicialização
onMounted(() => {
  if (import.meta.env.DEV) {
    console.log('✅ App.vue montado com sucesso')
  }
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Vue Sonner Toast Container -->
    <Toaster 
      position="top-right" 
      :duration="4000"
      :toast-options="{
        style: {
          background: 'white',
          color: '#212529',
          border: '1px solid #E9ECEF',
        },
      }"
    />

    <!-- Router View -->
    <RouterView />
  </div>
</template>

<style>
/* Reset básico é aplicado pelo Tailwind */
/* Estilos globais adicionais em style.css */
</style>
