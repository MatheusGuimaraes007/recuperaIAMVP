<script setup>
/**
 * RButton - Componente de Botão
 * 
 * Botão primário do design system com variantes, tamanhos e estados.
 * 
 * @example
 * <RButton variant="primary" size="md" @click="handleClick">
 *   Click Me
 * </RButton>
 */

import { computed } from 'vue'

// Props
const props = defineProps({
  /**
   * Variante visual do botão
   * @values primary, secondary, outline, ghost, danger
   */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },

  /**
   * Tamanho do botão
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Se o botão está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Se o botão está em estado de loading
   */
  loading: {
    type: Boolean,
    default: false
  },

  /**
   * Se o botão ocupa largura total
   */
  fullWidth: {
    type: Boolean,
    default: false
  },

  /**
   * Ícone à esquerda
   */
  iconLeft: {
    type: String,
    default: null
  },

  /**
   * Ícone à direita
   */
  iconRight: {
    type: String,
    default: null
  },

  /**
   * Tipo HTML do botão
   * @values button, submit, reset
   */
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },

  /**
   * ARIA label para acessibilidade
   */
  ariaLabel: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['click', 'focus', 'blur'])

// Classes computadas
const buttonClasses = computed(() => {
  const classes = ['r-button']
  
  // Variante
  classes.push(`r-button--${props.variant}`)
  
  // Tamanho
  classes.push(`r-button--${props.size}`)
  
  // Estados
  if (props.disabled) classes.push('r-button--disabled')
  if (props.loading) classes.push('r-button--loading')
  if (props.fullWidth) classes.push('r-button--full-width')
  
  return classes
})

// Handlers
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
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
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Loading Spinner -->
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

    <!-- Icon Left -->
    <span v-if="iconLeft && !loading" class="r-button__icon r-button__icon--left">
      <slot name="icon-left">
        {{ iconLeft }}
      </slot>
    </span>

    <!-- Content -->
    <span class="r-button__content">
      <slot />
    </span>

    <!-- Icon Right -->
    <span v-if="iconRight && !loading" class="r-button__icon r-button__icon--right">
      <slot name="icon-right">
        {{ iconRight }}
      </slot>
    </span>
  </button>
</template>

<style scoped>
/* Base Styles */
.r-button {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  
  /* Typography */
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  white-space: nowrap;
  
  /* Border */
  border: var(--border-width-default) solid transparent;
  border-radius: var(--radius-md);
  
  /* Transition - CORRIGIDO: especificar propriedades */
  transition: background-color var(--duration-normal) var(--easing-out),
              box-shadow var(--duration-normal) var(--easing-out),
              border-color var(--duration-normal) var(--easing-out);
  
  /* Cursor */
  cursor: pointer;
  user-select: none;
  
  /* Reset */
  outline: none;
  text-decoration: none;
}

/* Focus State */
.r-button:focus-visible {
  box-shadow: var(--shadow-focus);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* ============================================================================
   VARIANTS
   ============================================================================ */

/* Primary */
.r-button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.r-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-700); /* CORRIGIDO: era primary-dark */
  box-shadow: var(--shadow-md);
}

.r-button--primary:active:not(:disabled) {
  background-color: var(--color-primary-700); /* CORRIGIDO: era 800 */
  box-shadow: none; /* CORRIGIDO: adicionar */
}

/* Secondary */
.r-button--secondary {
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-tertiary */
  color: var(--text-primary);
  border-color: var(--border-medium);
}

.r-button--secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
  border-color: var(--border-dark);
}

.r-button--secondary:active:not(:disabled) {
  background-color: var(--color-gray-300);
}

/* Outline */
.r-button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.r-button--outline:hover:not(:disabled) {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-700); /* CORRIGIDO */
  color: var(--color-primary-700);
}

.r-button--outline:active:not(:disabled) {
  background-color: var(--color-primary-100);
}

/* Ghost */
.r-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.r-button--ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-tertiary */
}

.r-button--ghost:active:not(:disabled) {
  background-color: var(--color-gray-200);
}

/* Danger */
.r-button--danger {
  background-color: var(--color-error);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.r-button--danger:hover:not(:disabled) {
  background-color: var(--color-error-600);
  box-shadow: var(--shadow-md);
}

.r-button--danger:active:not(:disabled) {
  background-color: var(--color-error-700);
  box-shadow: none; /* CORRIGIDO: adicionar */
}

/* ============================================================================
   SIZES
   ============================================================================ */

.r-button--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  line-height: 1.25;
}

.r-button--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  line-height: 1.5;
}

.r-button--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  line-height: 1.5;
}

/* ============================================================================
   STATES
   ============================================================================ */

/* Disabled */
.r-button--disabled,
.r-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading */
.r-button--loading {
  position: relative;
  cursor: wait;
}

/* Full Width */
.r-button--full-width {
  width: 100%;
}

/* ============================================================================
   ELEMENTS
   ============================================================================ */

/* Spinner */
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

/* Icons */
.r-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Content */
.r-button__content {
  display: inline-flex;
  align-items: center;
}
</style>