<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },

  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  disabled: {
    type: Boolean,
    default: false
  },

  loading: {
    type: Boolean,
    default: false
  },

  fullWidth: {
    type: Boolean,
    default: false
  },

  iconLeft: {
    type: String,
    default: null
  },

  iconRight: {
    type: String,
    default: null
  },

  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },

  ariaLabel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click', 'focus', 'blur'])

const buttonClasses = computed(() => {
  const classes = ['r-button']

  classes.push(`r-button--${props.variant}`)
  classes.push(`r-button--${props.size}`)

  if (props.disabled) classes.push('r-button--disabled')
  if (props.loading) classes.push('r-button--loading')
  if (props.fullWidth) classes.push('r-button--full-width')

  return classes
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
      :type="type"
      :class="buttonClasses"
      :disabled="disabled || loading"
      :aria-label="ariaLabel"
      :aria-disabled="disabled || loading"
      :aria-busy="loading"
      @click="handleClick"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
  >
    <span v-if="loading" class="r-button__spinner">
      <svg class="r-button__spinner-icon" viewBox="0 0 24 24">
        <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
        />
        <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>

    <span v-if="iconLeft && !loading" class="r-button__icon r-button__icon--left">
      <slot name="icon-left">{{ iconLeft }}</slot>
    </span>

    <span class="r-button__content">
      <slot />
    </span>

    <span v-if="iconRight && !loading" class="r-button__icon r-button__icon--right">
      <slot name="icon-right">{{ iconRight }}</slot>
    </span>
  </button>
</template>

<style scoped>
.r-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-sans),sans-serif;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  white-space: nowrap;

  border: var(--border-width-default) solid transparent;
  border-radius: var(--radius-md);

  transition: background-color var(--duration-normal) var(--easing-out),
  color var(--duration-normal) var(--easing-out),
  box-shadow var(--duration-normal) var(--easing-out),
  border-color var(--duration-normal) var(--easing-out),
  transform var(--duration-fast) var(--easing-out);
  cursor: pointer;
  user-select: none;

  outline: none;
  text-decoration: none;
}

.r-button:focus-visible {
  box-shadow: var(--shadow-focus);
  outline: 2px solid transparent;
  outline-offset: 2px;
}


.r-button--primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.r-button--primary:hover:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.r-button--primary:active:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-primary-800);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

.r-button--secondary {
  background-color: var(--color-gray-100);
  color: var(--text-primary);
  border-color: var(--border-medium);
}

.r-button--secondary:hover:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-gray-200);
  border-color: var(--border-dark);
}

.r-button--secondary:active:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-gray-300);
}

.r-button--outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.r-button--outline:hover:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-700);
  color: var(--color-primary-700);
}

.r-button--outline:active:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-primary-100);
}

.r-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.r-button--ghost:hover:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-gray-100);
}

.r-button--ghost:active:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-gray-200);
}

.r-button--danger {
  background-color: var(--color-error-500);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.r-button--danger:hover:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-error-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.r-button--danger:active:not(:disabled):not(.r-button--loading) {
  background-color: var(--color-error-700);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

.r-button--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-tight);
  min-height: 32px;
}

.r-button--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  min-height: 40px;
}

.r-button--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  min-height: 48px;
}

.r-button--disabled,
.r-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.r-button--loading {
  position: relative;
  cursor: wait;
}

.r-button--full-width {
  width: 100%;
}


.r-button__spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.r-button__spinner-icon {
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.r-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.r-button__content {
  display: inline-flex;
  align-items: center;
}
</style>