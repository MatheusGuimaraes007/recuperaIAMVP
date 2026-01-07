<script setup>
/**
 * RIconButton - Botão apenas com ícone
 */
import { computed } from 'vue'
// Importação adicionada para corrigir o erro "Failed to resolve component: RSpinner"
import RSpinner from '../feedback/RSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'ghost',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v)
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
  transition: var(--transition-normal);
  flex-shrink: 0;
}

.r-icon-button:focus-visible {
  box-shadow: var(--shadow-focus);
}

/* Sizes */
.r-icon-button--sm {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.r-icon-button--md {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.r-icon-button--lg {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

/* Variants */
.r-icon-button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-icon-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.r-icon-button--secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.r-icon-button--secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
}

.r-icon-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.r-icon-button--ghost:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
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