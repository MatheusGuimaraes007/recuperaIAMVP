<script setup>
/**
 * RChip - Chip Interativo
 *
 * Componente molecule para exibir chips clicáveis, removíveis
 * e selecionáveis, ideal para filtros e tags interativas.
 *
 * @example
 * <RChip
 *   label="JavaScript"
 *   icon="code"
 *   :removable="true"
 *   :selected="false"
 *   @click="handleClick"
 *   @remove="handleRemove"
 * />
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

// Props
const props = defineProps({
  /**
   * Texto do chip
   */
  label: {
    type: String,
    required: true
  },

  /**
   * Se o chip pode ser removido (mostra X)
   */
  removable: {
    type: Boolean,
    default: false
  },

  /**
   * Se o chip está selecionado
   */
  selected: {
    type: Boolean,
    default: false
  },

  /**
   * Ícone opcional à esquerda
   */
  icon: {
    type: String,
    default: null
  },

  /**
   * Tamanho do ícone principal
   */
  iconSize: {
    type: [String, Number],
    default: 14
  },

  /**
   * Variante visual
   * @values default, outline, soft, solid
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'soft', 'solid'].includes(value)
  },

  /**
   * Cor do chip
   * @values neutral, primary, success, warning, error, info
   */
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['neutral', 'primary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Tamanho do chip
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Se está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['click', 'remove'])

// Classes computadas
const chipClasses = computed(() => {
  const classes = [
    'r-chip',
    `r-chip--${props.variant}`,
    `r-chip--${props.color}`,
    `r-chip--${props.size}`
  ]

  if (props.selected) {
    classes.push('r-chip--selected')
  }

  if (props.disabled) {
    classes.push('r-chip--disabled')
  }

  return classes
})

// Handlers
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const handleRemove = (event) => {
  if (!props.disabled) {
    emit('remove', event)
  }
}
</script>

<template>
  <span
    :class="chipClasses"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Icon -->
    <RIcon
      v-if="icon"
      :name="icon"
      :size="iconSize"
      class="r-chip__icon"
    />

    <!-- Label -->
    <span class="r-chip__label">{{ label }}</span>

    <!-- Remove Button -->
    <button
      v-if="removable"
      class="r-chip__remove"
      :disabled="disabled"
      @click.stop="handleRemove"
      aria-label="Remover"
    >
      <RIcon name="x" size="12" />
    </button>
  </span>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-chip {
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);

  /* Style */
  border-radius: var(--radius-full);
  border: 1px solid transparent;

  /* Typography */
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);

  /* Interaction */
  cursor: pointer;
  user-select: none;

  /* Transition */
  transition: background-color var(--transition-fast) var(--easing-out),
              border-color var(--transition-fast) var(--easing-out),
              color var(--transition-fast) var(--easing-out),
              transform var(--transition-fast) var(--easing-out);
}

/* ============================================================================
   SIZES
   ============================================================================ */

.r-chip--sm {
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  min-height: 20px;
}

.r-chip--md {
  padding: 4px 12px;
  font-size: var(--font-size-sm);
  min-height: 24px;
}

.r-chip--lg {
  padding: 6px 16px;
  font-size: var(--font-size-base);
  min-height: 32px;
}

/* ============================================================================
   VARIANTS - DEFAULT
   ============================================================================ */

.r-chip--default {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.r-chip--default:hover:not(.r-chip--disabled) {
  background-color: var(--color-gray-200);
}

/* ============================================================================
   VARIANTS - OUTLINE
   ============================================================================ */

.r-chip--outline {
  background-color: transparent;
  border-color: var(--color-border-medium);
  color: var(--color-text-secondary);
}

.r-chip--outline:hover:not(.r-chip--disabled) {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border-dark);
}

/* ============================================================================
   VARIANTS - SOFT
   ============================================================================ */

.r-chip--soft.r-chip--neutral {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.r-chip--soft.r-chip--primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

.r-chip--soft.r-chip--success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.r-chip--soft.r-chip--warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.r-chip--soft.r-chip--error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}

.r-chip--soft.r-chip--info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

/* Soft Hover */
.r-chip--soft.r-chip--primary:hover:not(.r-chip--disabled) {
  background-color: var(--color-primary-100);
}

.r-chip--soft.r-chip--success:hover:not(.r-chip--disabled) {
  background-color: var(--color-success-100);
}

.r-chip--soft.r-chip--warning:hover:not(.r-chip--disabled) {
  background-color: var(--color-warning-100);
}

.r-chip--soft.r-chip--error:hover:not(.r-chip--disabled) {
  background-color: var(--color-error-100);
}

.r-chip--soft.r-chip--info:hover:not(.r-chip--disabled) {
  background-color: var(--color-info-100);
}

/* ============================================================================
   VARIANTS - SOLID
   ============================================================================ */

.r-chip--solid.r-chip--neutral {
  background-color: var(--color-gray-600);
  color: var(--color-white);
}

.r-chip--solid.r-chip--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-chip--solid.r-chip--success {
  background-color: var(--color-success);
  color: var(--color-white);
}

.r-chip--solid.r-chip--warning {
  background-color: var(--color-warning);
  color: var(--color-white);
}

.r-chip--solid.r-chip--error {
  background-color: var(--color-error);
  color: var(--color-white);
}

.r-chip--solid.r-chip--info {
  background-color: var(--color-info);
  color: var(--color-white);
}

/* Solid Hover */
.r-chip--solid.r-chip--primary:hover:not(.r-chip--disabled) {
  background-color: var(--color-primary-700);
}

.r-chip--solid.r-chip--success:hover:not(.r-chip--disabled) {
  background-color: var(--color-success-700);
}

.r-chip--solid.r-chip--warning:hover:not(.r-chip--disabled) {
  background-color: var(--color-warning-700);
}

.r-chip--solid.r-chip--error:hover:not(.r-chip--disabled) {
  background-color: var(--color-error-700);
}

.r-chip--solid.r-chip--info:hover:not(.r-chip--disabled) {
  background-color: var(--color-info-700);
}

/* ============================================================================
   SELECTED STATE
   ============================================================================ */

.r-chip--selected {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.r-chip--selected:hover:not(.r-chip--disabled) {
  background-color: var(--color-primary-700);
}

/* ============================================================================
   DISABLED STATE
   ============================================================================ */

.r-chip--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ============================================================================
   ELEMENTS
   ============================================================================ */

.r-chip__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.r-chip__label {
  line-height: 1;
  white-space: nowrap;
}

.r-chip__remove {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  margin-left: var(--spacing-1);

  /* Style */
  background: none;
  border: none;
  border-radius: var(--radius-full);
  color: currentColor;

  /* Interaction */
  cursor: pointer;
  opacity: 0.7;

  /* Transition */
  transition: opacity var(--transition-fast) var(--easing-out),
              background-color var(--transition-fast) var(--easing-out);
}

.r-chip__remove:hover:not(:disabled) {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.r-chip--selected .r-chip__remove:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

/* ============================================================================
   HOVER STATE
   ============================================================================ */

.r-chip:hover:not(.r-chip--disabled) {
  transform: translateY(-1px);
}

.r-chip:active:not(.r-chip--disabled) {
  transform: translateY(0);
}

/* ============================================================================
   FOCUS STATE
   ============================================================================ */

.r-chip:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>