<script setup>
/**
 * RFloatingActionButton - FAB (Material Design style)
 */
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  extended: { type: Boolean, default: false },
  ariaLabel: { type: String, required: true }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'r-fab',
      `r-fab--${size}`,
      { 'r-fab--extended': extended }
    ]"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="r-fab__icon">
      <slot name="icon" />
    </span>
    <span v-if="extended" class="r-fab__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.r-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-normal);
}

.r-fab:hover {
  box-shadow: var(--shadow-xl);
  background-color: var(--color-primary-dark);
}

.r-fab:focus-visible {
  box-shadow: var(--shadow-focus), var(--shadow-xl);
}

/* Sizes */
.r-fab--sm { width: 40px; height: 40px; font-size: 18px; }
.r-fab--md { width: 56px; height: 56px; font-size: 24px; }
.r-fab--lg { width: 72px; height: 72px; font-size: 32px; }

/* Extended */
.r-fab--extended {
  width: auto;
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-full);
}
</style>