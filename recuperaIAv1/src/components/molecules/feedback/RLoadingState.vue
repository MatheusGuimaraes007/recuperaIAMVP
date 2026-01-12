<script setup>
/**
 * RLoadingState - Estado de Carregamento
 *
 * Componente molecule para exibir estados de carregamento
 * com spinner e mensagem customizável.
 *
 * @example
 * <RLoadingState
 *   message="Processando dados..."
 *   size="lg"
 * />
 */

import { computed } from 'vue'
import RSpinner from '@components/atoms/feedback/RSpinner.vue'
import RText from '@components/atoms/typography/RText.vue'

// Props
const props = defineProps({
  /**
   * Mensagem de carregamento
   */
  message: {
    type: String,
    default: 'Carregando...'
  },

  /**
   * Tamanho do spinner
   * @values sm, md, lg, xl
   */
  size: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },

  /**
   * Cor do spinner
   * @values primary, secondary, success, warning, error, info
   */
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Tamanho do texto da mensagem
   * @values xs, sm, base, lg
   */
  textSize: {
    type: String,
    default: 'base',
    validator: (value) => ['xs', 'sm', 'base', 'lg'].includes(value)
  },

  /**
   * Se deve ter espaçamento vertical maior
   */
  spacious: {
    type: Boolean,
    default: false
  },

  /**
   * Altura mínima do container
   */
  minHeight: {
    type: String,
    default: null
  }
})

// Computed
const containerClasses = computed(() => {
  const classes = ['r-loading-state']

  if (props.spacious) {
    classes.push('r-loading-state--spacious')
  }

  return classes
})

const containerStyle = computed(() => {
  if (props.minHeight) {
    return { minHeight: props.minHeight }
  }
  return {}
})
</script>

<template>
  <div :class="containerClasses" :style="containerStyle" role="status" aria-live="polite">
    <!-- Spinner -->
    <RSpinner :size="size" :color="color" />

    <!-- Message -->
    <RText
      :size="textSize"
      color="secondary"
      align="center"
      class="r-loading-state__message"
    >
      {{ message }}
    </RText>

    <!-- Screen reader text -->
    <span class="sr-only">{{ message }}</span>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-loading-state {
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  padding: var(--spacing-8);
  min-height: 200px;
}

.r-loading-state--spacious {
  padding: var(--spacing-12);
  min-height: 300px;
}

/* ============================================================================
   MESSAGE
   ============================================================================ */

.r-loading-state__message {
  max-width: 300px;
  line-height: 1.5;
}

/* ============================================================================
   ACCESSIBILITY
   ============================================================================ */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-loading-state {
    padding: var(--spacing-6);
    min-height: 150px;
  }

  .r-loading-state--spacious {
    padding: var(--spacing-8);
    min-height: 200px;
  }
}
</style>