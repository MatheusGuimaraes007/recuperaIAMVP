<script setup>
/**
 * RCode - Código inline ou bloco
 */
const props = defineProps({
  block: { type: Boolean, default: false },
  language: { type: String, default: null }
})
</script>

<template>
  <component
    :is="block ? 'pre' : 'code'"
    :class="['r-code', { 'r-code--block': block }]"
  >
    <code v-if="block" class="r-code__content">
      <slot />
    </code>
    <slot v-else />
  </component>
</template>

<style scoped>
.r-code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-error-700);
  background-color: var(--color-error-50);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.r-code--block {
  display: block;
  padding: var(--spacing-4);
  overflow-x: auto;
  color: var(--text-primary);
  background-color: var(--color-gray-900);
  border-radius: var(--radius-md);
}

.r-code__content {
  color: var(--color-white);
  background: transparent;
  padding: 0;
}
</style>