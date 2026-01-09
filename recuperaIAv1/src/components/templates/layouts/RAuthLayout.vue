<script setup>
import RText from '@/components/atoms/typography/RText.vue'

defineProps({
  title: String,
  subtitle: String
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-base relative overflow-hidden">

    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2"></div>
    </div>

    <div class="mb-8 text-center relative z-10">
      <h1 class="text-4xl font-bold mb-2 cursor-default select-none tracking-tight">
        <span class="text-white">recupera</span><span class="text-primary">.ia</span>
      </h1>
      <RText color="secondary" size="sm">Plataforma Inteligente de Recuperação</RText>
    </div>

    <div class="w-full max-w-md bg-bg-primary border border-border-light rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 animate-fade-in">
      <div v-if="title" class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-text-secondary leading-relaxed">
          {{ subtitle }}
        </p>
      </div>

      <slot />
    </div>

    <div class="mt-8 text-center text-xs text-text-tertiary relative z-10">
      &copy; {{ new Date().getFullYear() }} Recupera.ia. Todos os direitos reservados.
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>