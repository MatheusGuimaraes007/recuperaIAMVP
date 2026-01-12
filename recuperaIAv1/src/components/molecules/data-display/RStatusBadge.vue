<script setup>
/**
 * RStatusBadge - Badge de Status com Indicador
 *
 * Componente molecule que combina um dot de status com texto,
 * ideal para exibir estados e situações.
 *
 * @example
 * <RStatusBadge
 *   label="Ativo"
 *   status="success"
 *   :pulse="true"
 * />
 */

import { computed } from 'vue'
import RStatusDot from '@components/atoms/feedback/RStatusDot.vue'
import RText from '@components/atoms/typography/RText.vue'

// Props
const props = defineProps({
  /**
   * Texto do badge
   */
  label: {
    type: String,
    required: true
  },

  /**
   * Status/variante visual
   * @values default, primary, success, warning, error, info
   */
  status: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Se o dot deve pulsar (animação)
   */
  pulse: {
    type: Boolean,
    default: false
  },

  /**
   * Tamanho do dot
   * @values sm, md, lg
   */
  dotSize: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Tamanho do texto
   * @values xs, sm, base, lg
   */
  textSize: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'base', 'lg'].includes(value)
  },

  /**
   * Peso da fonte
   * @values normal, medium, semibold, bold
   */
  textWeight: {
    type: String,
    default: 'medium',
    validator: (value) => ['normal', 'medium', 'semibold', 'bold'].includes(value)
  },

  /**
   * Se deve ter fundo colorido
   */
  filled: {
    type: Boolean,
    default: false
  },

  /**
   * Se é clicável
   */
  clickable: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['click'])

// Classes computadas
const badgeClasses = computed(() => {
  const classes = ['r-status-badge']

  if (props.filled) {
    classes.push('r-status-badge--filled')
    classes.push(`r-status-badge--filled-${props.status}`)
  }

  if (props.clickable) {
    classes.push('r-status-badge--clickable')
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
  <div
    :class="badgeClasses"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Status Dot -->
    <RStatusDot
      :status="status"
      :pulse="pulse"
      :size="dotSize"
    />

    <!-- Label Text -->
    <RText
      :size="textSize"
      :weight="textWeight"
      class="r-status-badge__label"
    >
      {{ label }}
    </RText>

    <!-- Custom Content Slot -->
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-status-badge {
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);

  /* Style */
  border-radius: var(--radius-full);
  background-color: var(--color-bg-tertiary);

  /* Transition */
  transition: background-color var(--transition-fast) var(--easing-out),
              transform var(--transition-fast) var(--easing-out);
}

/* ============================================================================
   FILLED VARIANTS
   ============================================================================ */

.r-status-badge--filled {
  padding: var(--spacing-2) var(--spacing-4);
}

.r-status-badge--filled-default {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.r-status-badge--filled-primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

.r-status-badge--filled-success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.r-status-badge--filled-warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.r-status-badge--filled-error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}

.r-status-badge--filled-info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

/* ============================================================================
   CLICKABLE STATE
   ============================================================================ */

.r-status-badge--clickable {
  cursor: pointer;
  user-select: none;
}

.r-status-badge--clickable:hover {
  background-color: var(--color-gray-200);
  transform: translateY(-1px);
}

.r-status-badge--clickable:active {
  transform: translateY(0);
}

/* Filled Clickable Hover */
.r-status-badge--clickable.r-status-badge--filled-primary:hover {
  background-color: var(--color-primary-100);
}

.r-status-badge--clickable.r-status-badge--filled-success:hover {
  background-color: var(--color-success-100);
}

.r-status-badge--clickable.r-status-badge--filled-warning:hover {
  background-color: var(--color-warning-100);
}

.r-status-badge--clickable.r-status-badge--filled-error:hover {
  background-color: var(--color-error-100);
}

.r-status-badge--clickable.r-status-badge--filled-info:hover {
  background-color: var(--color-info-100);
}

/* ============================================================================
   FOCUS STATE
   ============================================================================ */

.r-status-badge--clickable:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ============================================================================
   LABEL
   ============================================================================ */

.r-status-badge__label {
  line-height: 1;
  white-space: nowrap;
}
</style>