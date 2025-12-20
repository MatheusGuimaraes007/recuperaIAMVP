<script setup>

defineProps({
  height: {
    type: String,
    default: 'h-80'
  }
});
</script>

<template>
  <div
      :class="['bg-gray-800/50 rounded-lg animate-pulse flex items-center justify-center', height]"
  >
    <div class="text-gray-600 text-sm">Carregando gráfico...</div>
  </div>
</template>