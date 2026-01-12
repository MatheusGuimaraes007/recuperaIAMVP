<script setup>
/**
 * RInfoCard - Card de Informação
 *
 * Componente molecule para exibir informações destacadas com ícone opcional.
 * Ideal para notificações, alertas informativos e destaque de conteúdo.
 *
 * @example
 * <RInfoCard
 *   title="Novidade!"
 *   description="Novo recurso disponível"
 *   icon="info-circle"
 *   variant="primary"
 * />
 */

import { computed } from 'vue'
import RCard from '@components/atoms/layout/RCard.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'

// Props
const props = defineProps({
  /**
   * Título do card de informação
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Descrição ou conteúdo adicional
   */
  description: {
    type: String,
    default: null
  },

  /**
   * Nome do ícone a ser exibido
   */
  icon: {
    type: String,
    default: null
  },

  /**
   * Tamanho do ícone
   * @values 16, 20, 24, 32
   */
  iconSize: {
    type: [String, Number],
    default: 24,
    validator: (value) => [16, 20, 24, 32].includes(Number(value))
  },

  /**
   * Variante visual do card
   * @values default, primary, success, warning, error, info
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Nível do heading do título
   * @values 1, 2, 3, 4, 5, 6
   */
  titleLevel: {
    type: [String, Number],
    default: 5,
    validator: (value) => [1, 2, 3, 4, 5, 6].includes(Number(value))
  },

  /**
   * Se deve ter borda colorida lateral
   */
  borderAccent: {
    type: Boolean,
    default: false
  }
})

// Classes computadas
const cardClasses = computed(() => {
  const classes = ['r-info-card']

  if (props.variant !== 'default') {
    classes.push(`r-info-card--${props.variant}`)
  }

  if (props.borderAccent) {
    classes.push('r-info-card--border-accent')
  }

  return classes
})

const iconWrapperClasses = computed(() => {
  return [
    'r-info-card__icon-wrapper',
    `r-info-card__icon-wrapper--${props.variant}`
  ]
})
</script>

<template>
  <RCard
    :class="cardClasses"
    padding="md"
  >
    <div class="r-info-card__content">
      <!-- Icon -->
      <div
        v-if="icon"
        :class="iconWrapperClasses"
      >
        <RIcon :name="icon" :size="iconSize" />
      </div>

      <!-- Text Content -->
      <div class="r-info-card__text">
        <RHeading
          :level="titleLevel"
          class="r-info-card__title"
        >
          {{ title }}
        </RHeading>

        <RText
          v-if="description"
          size="sm"
          color="secondary"
          class="r-info-card__description"
        >
          {{ description }}
        </RText>

        <!-- Custom Content Slot -->
        <slot />
      </div>
    </div>
  </RCard>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-info-card {
  position: relative;
}

.r-info-card__content {
  display: flex;
  gap: var(--spacing-4);
  align-items: flex-start;
}

/* ============================================================================
   ICON WRAPPER
   ============================================================================ */

.r-info-card__icon-wrapper {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: var(--spacing-2);

  /* Style */
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);

  /* Transition */
  transition: background-color var(--transition-normal) var(--easing-out),
              color var(--transition-normal) var(--easing-out);
}

/* Icon Wrapper Variants */
.r-info-card__icon-wrapper--primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary);
}

.r-info-card__icon-wrapper--success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.r-info-card__icon-wrapper--warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.r-info-card__icon-wrapper--error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}

.r-info-card__icon-wrapper--info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

/* ============================================================================
   TEXT CONTENT
   ============================================================================ */

.r-info-card__text {
  flex: 1;
  min-width: 0; /* Permite text-overflow funcionar */
}

.r-info-card__title {
  margin-bottom: var(--spacing-1);
}

.r-info-card__description {
  display: block;
  line-height: 1.5;
}

/* ============================================================================
   CARD VARIANTS
   ============================================================================ */

/* Primary */
.r-info-card--primary {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-100);
}

/* Success */
.r-info-card--success {
  background-color: var(--color-success-50);
  border-color: var(--color-success-100);
}

/* Warning */
.r-info-card--warning {
  background-color: var(--color-warning-50);
  border-color: var(--color-warning-100);
}

/* Error */
.r-info-card--error {
  background-color: var(--color-error-50);
  border-color: var(--color-error-100);
}

/* Info */
.r-info-card--info {
  background-color: var(--color-info-50);
  border-color: var(--color-info-100);
}

/* ============================================================================
   BORDER ACCENT
   ============================================================================ */

.r-info-card--border-accent {
  border-left-width: 4px;
}

.r-info-card--border-accent.r-info-card--primary {
  border-left-color: var(--color-primary);
}

.r-info-card--border-accent.r-info-card--success {
  border-left-color: var(--color-success);
}

.r-info-card--border-accent.r-info-card--warning {
  border-left-color: var(--color-warning);
}

.r-info-card--border-accent.r-info-card--error {
  border-left-color: var(--color-error);
}

.r-info-card--border-accent.r-info-card--info {
  border-left-color: var(--color-info);
}
</style>