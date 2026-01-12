<script setup>
/**
 * RFeatureCard - Card de Destaque de Funcionalidade
 *
 * Componente molecule que combina ícone, título, descrição e ação opcional
 * para destacar funcionalidades ou recursos do produto.
 *
 * @example
 * <RFeatureCard
 *   title="Analytics Avançado"
 *   description="Visualize seus dados em tempo real"
 *   icon="chart-bar"
 *   actionLabel="Saiba mais"
 *   @action="handleAction"
 * />
 */

import { computed } from 'vue'
import RCard from '@components/atoms/layout/RCard.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

// Props
const props = defineProps({
  /**
   * Título principal do card
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Descrição da funcionalidade
   */
  description: {
    type: String,
    required: true
  },

  /**
   * Nome do ícone a ser exibido
   */
  icon: {
    type: String,
    default: 'star'
  },

  /**
   * Tamanho do ícone
   * @values 24, 32, 40, 48
   */
  iconSize: {
    type: [String, Number],
    default: 32,
    validator: (value) => [24, 32, 40, 48].includes(Number(value))
  },

  /**
   * Label do botão de ação (se null, não exibe botão)
   */
  actionLabel: {
    type: String,
    default: null
  },

  /**
   * Variante do botão de ação
   * @values primary, secondary, outline, ghost
   */
  actionVariant: {
    type: String,
    default: 'outline',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },

  /**
   * Variante de cor do ícone
   * @values primary, success, warning, error, info
   */
  iconVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Se o card deve ter efeito hover elevado
   */
  hoverable: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['action'])

// Classes computadas para o ícone
const iconWrapperClasses = computed(() => {
  return [
    'r-feature-card__icon-wrapper',
    `r-feature-card__icon-wrapper--${props.iconVariant}`
  ]
})

// Handlers
const handleAction = () => {
  emit('action')
}
</script>

<template>
  <RCard
    class="r-feature-card"
    :hoverable="hoverable"
  >
    <!-- Icon -->
    <div :class="iconWrapperClasses">
      <RIcon :name="icon" :size="iconSize" />
    </div>

    <!-- Title -->
    <RHeading
      level="4"
      class="r-feature-card__title"
    >
      {{ title }}
    </RHeading>

    <!-- Description -->
    <RText
      color="secondary"
      class="r-feature-card__description"
    >
      {{ description }}
    </RText>

    <!-- Action Button (Optional) -->
    <div
      v-if="actionLabel"
      class="r-feature-card__action"
    >
      <RButton
        :variant="actionVariant"
        size="sm"
        full-width
        @click="handleAction"
      >
        {{ actionLabel }}
      </RButton>
    </div>

    <!-- Custom Action Slot -->
    <div
      v-if="$slots.action"
      class="r-feature-card__action"
    >
      <slot name="action" />
    </div>
  </RCard>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: var(--spacing-6);
}

/* ============================================================================
   ICON WRAPPER
   ============================================================================ */

.r-feature-card__icon-wrapper {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-4);

  /* Style */
  border-radius: var(--radius-full);
  background-color: var(--color-bg-secondary);

  /* Transition */
  transition: transform var(--transition-normal) var(--easing-out),
              background-color var(--transition-normal) var(--easing-out);
}

/* Icon Variants */
.r-feature-card__icon-wrapper--primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary);
}

.r-feature-card__icon-wrapper--success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.r-feature-card__icon-wrapper--warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.r-feature-card__icon-wrapper--error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}

.r-feature-card__icon-wrapper--info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

/* Hover Effect */
.r-feature-card:hover .r-feature-card__icon-wrapper {
  transform: scale(1.05);
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-feature-card__title {
  margin-bottom: var(--spacing-2);
}

.r-feature-card__description {
  margin-bottom: var(--spacing-6);
  flex: 1;
}

/* ============================================================================
   ACTION
   ============================================================================ */

.r-feature-card__action {
  width: 100%;
  margin-top: auto;
}
</style>