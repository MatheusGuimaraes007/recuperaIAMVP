<script setup>
/**
 * RButtonGroup - Agrupa botões horizontalmente
 */
const props = defineProps({
  spacing: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  },
  vertical: { type: Boolean, default: false }
})
</script>

<template>
  <div
    :class="[
      'r-button-group',
      `r-button-group--spacing-${spacing}`,
      { 'r-button-group--vertical': vertical }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.r-button-group {
  display: inline-flex;
  align-items: center;
}

.r-button-group--vertical {
  flex-direction: column;
  align-items: stretch;
}

.r-button-group--spacing-none { gap: 0; }
.r-button-group--spacing-sm { gap: var(--spacing-1); }
.r-button-group--spacing-md { gap: var(--spacing-2); }
.r-button-group--spacing-lg { gap: var(--spacing-4); }

/* Connected buttons (when spacing is none) */
.r-button-group--spacing-none > :deep(*:not(:first-child)) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.r-button-group--spacing-none > :deep(*:not(:last-child)) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>