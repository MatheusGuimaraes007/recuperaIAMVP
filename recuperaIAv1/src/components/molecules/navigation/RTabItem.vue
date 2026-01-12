<script setup>
/**
 * RTabItem - Item Individual de Tab
 *
 * Usado em conjunto com RTabs para definir conteúdo de cada aba.
 */

const props = defineProps({
  value: { type: String, required: true },
  lazy: { type: Boolean, default: false }
})
</script>

<template>
  <div v-show="true" class="r-tab-item" role="tabpanel">
    <slot />
  </div>
</template>

<style scoped>
.r-tab-item {
  animation: fadeIn var(--transition-fast);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>