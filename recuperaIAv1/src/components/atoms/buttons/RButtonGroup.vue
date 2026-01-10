<script setup>
const props = defineProps({
  spacing: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  },

  vertical: {
    type: Boolean,
    default: false
  }
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

.r-button-group--spacing-none {
  gap: 0;
}

.r-button-group--spacing-sm {
  gap: var(--spacing-1); /* 4px */
}

.r-button-group--spacing-md {
  gap: var(--spacing-2); /* 8px */
}

.r-button-group--spacing-lg {
  gap: var(--spacing-4); /* 16px */
}

.r-button-group--spacing-none > :deep(*:not(:first-child)) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;
}

.r-button-group--spacing-none > :deep(*:not(:last-child)) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.r-button-group--vertical.r-button-group--spacing-none > :deep(*:not(:first-child)) {
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  margin-left: 0;
  margin-top: -1px;
}

.r-button-group--vertical.r-button-group--spacing-none > :deep(*:not(:last-child)) {
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.r-button-group--spacing-none > :deep(*:first-child) {
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

.r-button-group--spacing-none > :deep(*:last-child) {
  border-top-right-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}
</style>