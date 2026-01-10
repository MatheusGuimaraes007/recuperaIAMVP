<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'ghost',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  ariaLabel: { type: String, required: true }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const classes = ['r-icon-button']
  classes.push(`r-icon-button--${props.variant}`)
  classes.push(`r-icon-button--${props.size}`)
  if (props.disabled) classes.push('r-icon-button--disabled')
  if (props.loading) classes.push('r-icon-button--loading')
  return classes
})
</script>

<template>
  <button
      :class="buttonClasses"
      :disabled="disabled || loading"
      :aria-label="ariaLabel"
      @click="!disabled && !loading && emit('click', $event)"
  >
    <span v-if="loading" class="r-icon-button__spinner">
      <svg viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </span>
    <slot v-else />
  </button>
</template>

<style scoped>
.r-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: var(--border-width-default) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-sans),sans-serif;
  transition: all var(--duration-normal) var(--easing-out);
  flex-shrink: 0;
}

.r-icon-button:focus-visible {
  box-shadow: var(--shadow-focus);
  outline: none;
}

.r-icon-button--primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
}
.r-icon-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-700);
}

.r-icon-button--secondary {
  background-color: var(--color-gray-100);
  color: var(--text-primary);
}
.r-icon-button--secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
}

.r-icon-button--outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}
.r-icon-button--outline:hover:not(:disabled) {
  background-color: var(--color-primary-50);
}

.r-icon-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}
.r-icon-button--ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.r-icon-button--danger {
  background-color: var(--color-error-500);
  color: var(--color-white);
}
.r-icon-button--danger:hover:not(:disabled) {
  background-color: var(--color-error-600);
}

/* Tamanhos */
.r-icon-button--sm {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-sm);
}
.r-icon-button--md {
  width: 40px;
  height: 40px;
  font-size: var(--font-size-base);
}
.r-icon-button--lg {
  width: 48px;
  height: 48px;
  font-size: var(--font-size-lg);
}

.r-icon-button--disabled,
.r-icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.r-icon-button__spinner {
  display: inline-flex;
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>