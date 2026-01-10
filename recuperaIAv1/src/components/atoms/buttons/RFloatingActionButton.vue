<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },

  extended: {
    type: Boolean,
    default: false
  },

  ariaLabel: {
    type: String,
    required: true
  },

  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
      :class="[
      'r-fab',
      `r-fab--${size}`,
      { 'r-fab--extended': extended },
      { 'r-fab--disabled': disabled }
    ]"
      :aria-label="ariaLabel"
      :disabled="disabled"
      @click="!disabled && emit('click', $event)"
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

  background-color: var(--color-primary-600);
  color: var(--color-white);

  border: none;
  border-radius: var(--radius-full);

  box-shadow: var(--shadow-lg);

  font-family: var(--font-sans),sans-serif;
  font-weight: var(--font-weight-semibold);

  cursor: pointer;
  user-select: none;

  transition: background-color var(--duration-normal) var(--easing-out),
  box-shadow var(--duration-normal) var(--easing-out),
  transform var(--duration-fast) var(--easing-out);
}

.r-fab:hover:not(:disabled) {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px) scale(1.05);
}

.r-fab:active:not(:disabled) {
  background-color: var(--color-primary-800);
  box-shadow: var(--shadow-lg);
  transform: translateY(0) scale(1);
}

.r-fab:focus-visible {
  box-shadow: var(--shadow-focus), var(--shadow-lg);
  outline: none;
}

.r-fab--sm {
  width: 40px;
  height: 40px;
  font-size: var(--font-size-sm);
}

.r-fab--md {
  width: 56px;
  height: 56px;
  font-size: var(--font-size-lg);
}

.r-fab--lg {
  width: 72px;
  height: 72px;
  font-size: var(--font-size-xl);
}

.r-fab--extended {
  width: auto;
  padding: 0 var(--spacing-6);
  border-radius: var(--radius-full);
}

.r-fab--extended.r-fab--sm {
  height: 40px;
  padding: 0 var(--spacing-4);
}

.r-fab--extended.r-fab--md {
  height: 56px;
  padding: 0 var(--spacing-6);
}

.r-fab--extended.r-fab--lg {
  height: 72px;
  padding: 0 var(--spacing-8);
}

.r-fab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.r-fab__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.r-fab__label {
  font-size: var(--font-size-base);
  white-space: nowrap;
}
</style>