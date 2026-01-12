<script setup>
/**
 * RTag - Tag/Etiqueta
 *
 * Componente molecule para exibir tags e categorias com variantes
 * visuais, cores semânticas e tamanhos.
 *
 * @example
 * <RTag
 *   label="Premium"
 *   color="primary"
 *   variant="soft"
 *   size="md"
 * />
 */

import { computed } from 'vue'

// Props
const props = defineProps({
  /**
   * Texto da tag
   */
  label: {
    type: String,
    required: true
  },

  /**
   * Cor semântica da tag
   * @values neutral, primary, success, warning, error, info
   */
  color: {
    type: String,
    default: 'neutral',
    validator: (value) => ['neutral', 'primary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Variante visual
   * @values solid, outline, soft
   */
  variant: {
    type: String,
    default: 'soft',
    validator: (value) => ['solid', 'outline', 'soft'].includes(value)
  },

  /**
   * Tamanho da tag
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Se a tag pode ser clicada
   */
  clickable: {
    type: Boolean,
    default: false
  },

  /**
   * Ícone opcional à esquerda
   */
  iconLeft: {
    type: String,
    default: null
  },

  /**
   * Ícone opcional à direita
   */
  iconRight: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['click'])

// Classes computadas
const tagClasses = computed(() => {
  const classes = [
    'r-tag',
    `r-tag--${props.variant}`,
    `r-tag--${props.size}`,
    `r-tag--${props.color}`
  ]

  if (props.clickable) {
    classes.push('r-tag--clickable')
  }

  return classes
})

// Handlers
const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<template>
  <span
    :class="tagClasses"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Icon Left Slot -->
    <span v-if="iconLeft || $slots.iconLeft" class="r-tag__icon r-tag__icon--left">
      <slot name="iconLeft">
        {{ iconLeft }}
      </slot>
    </span>

    <!-- Label -->
    <span class="r-tag__label">{{ label }}</span>

    <!-- Icon Right Slot -->
    <span v-if="iconRight || $slots.iconRight" class="r-tag__icon r-tag__icon--right">
      <slot name="iconRight">
        {{ iconRight }}
      </slot>
    </span>
  </span>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-tag {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);

  /* Style */
  border-radius: var(--radius-sm);
  border: 1px solid transparent;

  /* Typography */
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
  line-height: 1;

  /* Transition */
  transition: background-color var(--transition-fast) var(--easing-out),
              border-color var(--transition-fast) var(--easing-out),
              transform var(--transition-fast) var(--easing-out);
}

/* ============================================================================
   SIZES
   ============================================================================ */

.r-tag--sm {
  padding: 2px 6px;
  font-size: var(--font-size-xs);
  min-height: 18px;
}

.r-tag--md {
  padding: 4px 8px;
  font-size: var(--font-size-sm);
  min-height: 22px;
}

.r-tag--lg {
  padding: 6px 12px;
  font-size: var(--font-size-base);
  min-height: 28px;
}

/* ============================================================================
   VARIANTS - SOFT
   ============================================================================ */

.r-tag--soft.r-tag--neutral {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.r-tag--soft.r-tag--primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

.r-tag--soft.r-tag--success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.r-tag--soft.r-tag--warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.r-tag--soft.r-tag--error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}

.r-tag--soft.r-tag--info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

/* ============================================================================
   VARIANTS - SOLID
   ============================================================================ */

.r-tag--solid.r-tag--neutral {
  background-color: var(--color-gray-600);
  color: var(--color-white);
}

.r-tag--solid.r-tag--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-tag--solid.r-tag--success {
  background-color: var(--color-success);
  color: var(--color-white);
}

.r-tag--solid.r-tag--warning {
  background-color: var(--color-warning);
  color: var(--color-white);
}

.r-tag--solid.r-tag--error {
  background-color: var(--color-error);
  color: var(--color-white);
}

.r-tag--solid.r-tag--info {
  background-color: var(--color-info);
  color: var(--color-white);
}

/* ============================================================================
   VARIANTS - OUTLINE
   ============================================================================ */

.r-tag--outline {
  background-color: transparent;
  border: 1px solid currentColor;
}

.r-tag--outline.r-tag--neutral {
  color: var(--color-gray-600);
}

.r-tag--outline.r-tag--primary {
  color: var(--color-primary);
}

.r-tag--outline.r-tag--success {
  color: var(--color-success);
}

.r-tag--outline.r-tag--warning {
  color: var(--color-warning);
}

.r-tag--outline.r-tag--error {
  color: var(--color-error);
}

.r-tag--outline.r-tag--info {
  color: var(--color-info);
}

/* ============================================================================
   CLICKABLE STATE
   ============================================================================ */

.r-tag--clickable {
  cursor: pointer;
  user-select: none;
}

.r-tag--clickable:hover {
  transform: translateY(-1px);
}

.r-tag--clickable:active {
  transform: translateY(0);
}

/* Soft Clickable Hover */
.r-tag--clickable.r-tag--soft.r-tag--neutral:hover {
  background-color: var(--color-gray-200);
}

.r-tag--clickable.r-tag--soft.r-tag--primary:hover {
  background-color: var(--color-primary-100);
}

.r-tag--clickable.r-tag--soft.r-tag--success:hover {
  background-color: var(--color-success-100);
}

.r-tag--clickable.r-tag--soft.r-tag--warning:hover {
  background-color: var(--color-warning-100);
}

.r-tag--clickable.r-tag--soft.r-tag--error:hover {
  background-color: var(--color-error-100);
}

.r-tag--clickable.r-tag--soft.r-tag--info:hover {
  background-color: var(--color-info-100);
}

/* Solid Clickable Hover */
.r-tag--clickable.r-tag--solid.r-tag--primary:hover {
  background-color: var(--color-primary-700);
}

.r-tag--clickable.r-tag--solid.r-tag--success:hover {
  background-color: var(--color-success-700);
}

.r-tag--clickable.r-tag--solid.r-tag--warning:hover {
  background-color: var(--color-warning-700);
}

.r-tag--clickable.r-tag--solid.r-tag--error:hover {
  background-color: var(--color-error-700);
}

.r-tag--clickable.r-tag--solid.r-tag--info:hover {
  background-color: var(--color-info-700);
}

/* ============================================================================
   ELEMENTS
   ============================================================================ */

.r-tag__label {
  line-height: 1;
}

.r-tag__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* ============================================================================
   FOCUS STATE
   ============================================================================ */

.r-tag--clickable:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>