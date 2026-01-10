<script setup>
import { computed } from 'vue'
import RSpinner from '../feedback/RSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'ghost',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(v) // CORRIGIDO: +outline
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
    <RSpinner v-if="loading" :size="size" />
    <slot v-else />
  </button>
</template>

<style scoped>
.r-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-normal) var(--easing-out),
              box-shadow var(--duration-normal) var(--easing-out);
  flex-shrink: 0;
}

.r-icon-button:focus-visible {
  box-shadow: var(--shadow-focus);
}

/* Sizes - CORRIGIDO: usar CSS variables */
.r-icon-button--sm {
  width: var(--spacing-8);   /* 32px */
  height: var(--spacing-8);
  font-size: var(--font-size-base);
}

.r-icon-button--md {
  width: var(--spacing-10);  /* 40px */
  height: var(--spacing-10);
  font-size: var(--font-size-xl);
}

.r-icon-button--lg {
  width: var(--spacing-12);  /* 48px */
  height: var(--spacing-12);
  font-size: var(--font-size-2xl);
}

/* Variants */
.r-icon-button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-icon-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-700); /* CORRIGIDO */
}

.r-icon-button--secondary {
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-tertiary */
  color: var(--text-primary);
}

.r-icon-button--secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
}

/* NOVO: Variante outline */
.r-icon-button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: var(--border-width-default) solid var(--color-primary);
}

.r-icon-button--outline:hover:not(:disabled) {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-700);
}

.r-icon-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.r-icon-button--ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100); /* CORRIGIDO */
}

.r-icon-button--danger {
  background-color: var(--color-error);
  color: var(--color-white);
}

.r-icon-button--danger:hover:not(:disabled) {
  background-color: var(--color-error-600);
}

.r-icon-button--disabled,
.r-icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>