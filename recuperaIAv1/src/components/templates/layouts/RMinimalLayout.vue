<script setup>
import RLogo from '@/components/atoms/icons/RLogo.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg-base">
    <header class="p-6">
      <RLogo />
    </header>

    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-lg text-center">
        <slot />
      </div>
    </main>

    <footer class="p-6 text-center text-xs text-text-tertiary">
      &copy; {{ new Date().getFullYear() }} Recupera.ia
    </footer>
  </div>
</template>