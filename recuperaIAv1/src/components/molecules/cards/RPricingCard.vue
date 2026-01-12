<script setup>
/**
 * RPricingCard - Card de Plano de Preços
 *
 * Componente molecule para exibir planos de preços com recursos,
 * destaque de plano popular e ação de seleção.
 *
 * @example
 * <RPricingCard
 *   planName="Premium"
 *   price="R$ 97"
 *   period="/mês"
 *   :features="['Recurso 1', 'Recurso 2']"
 *   :isPopular="true"
 *   buttonLabel="Assinar Agora"
 *   @select="handleSelect"
 * />
 */

import { computed } from 'vue'
import RCard from '@components/atoms/layout/RCard.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

// Props
const props = defineProps({
  /**
   * Nome do plano
   */
  planName: {
    type: String,
    required: true
  },

  /**
   * Preço principal (ex: "R$ 97")
   */
  price: {
    type: String,
    required: true
  },

  /**
   * Período de cobrança
   */
  period: {
    type: String,
    default: '/mês'
  },

  /**
   * Lista de recursos/funcionalidades incluídas
   */
  features: {
    type: Array,
    default: () => []
  },

  /**
   * Se este é o plano mais popular (destaque)
   */
  isPopular: {
    type: Boolean,
    default: false
  },

  /**
   * Texto do badge de destaque
   */
  popularBadgeText: {
    type: String,
    default: 'Mais Popular'
  },

  /**
   * Label do botão de ação
   */
  buttonLabel: {
    type: String,
    default: 'Assinar Agora'
  },

  /**
   * Se este é o plano atual do usuário
   */
  current: {
    type: Boolean,
    default: false
  },

  /**
   * Label quando é plano atual
   */
  currentLabel: {
    type: String,
    default: 'Plano Atual'
  },

  /**
   * Ícone usado para marcar features
   */
  checkIcon: {
    type: String,
    default: 'check'
  },

  /**
   * Tamanho do ícone de check
   */
  checkIconSize: {
    type: [String, Number],
    default: 16
  }
})

// Emits
const emit = defineEmits(['select'])

// Classes computadas
const cardClasses = computed(() => {
  const classes = ['r-pricing-card']

  if (props.isPopular) {
    classes.push('r-pricing-card--popular')
  }

  if (props.current) {
    classes.push('r-pricing-card--current')
  }

  return classes
})

const buttonVariant = computed(() => {
  if (props.current) return 'secondary'
  return props.isPopular ? 'primary' : 'outline'
})

const buttonLabel = computed(() => {
  return props.current ? props.currentLabel : props.buttonLabel
})

// Handlers
const handleSelect = () => {
  if (!props.current) {
    emit('select')
  }
}
</script>

<template>
  <RCard
    :class="cardClasses"
    :bordered="!isPopular"
  >
    <!-- Popular Badge -->
    <div
      v-if="isPopular"
      class="r-pricing-card__badge"
    >
      {{ popularBadgeText }}
    </div>

    <!-- Header -->
    <div class="r-pricing-card__header">
      <RText
        weight="semibold"
        color="secondary"
        class="r-pricing-card__plan-name"
      >
        {{ planName }}
      </RText>

      <div class="r-pricing-card__price-wrapper">
        <span class="r-pricing-card__price">{{ price }}</span>
        <span class="r-pricing-card__period">{{ period }}</span>
      </div>

      <!-- Custom Header Slot -->
      <slot name="header" />
    </div>

    <!-- Features List -->
    <ul
      v-if="features.length"
      class="r-pricing-card__features"
    >
      <li
        v-for="(feature, index) in features"
        :key="index"
        class="r-pricing-card__feature-item"
      >
        <RIcon
          :name="checkIcon"
          :size="checkIconSize"
          class="r-pricing-card__feature-icon"
        />
        <RText size="sm">{{ feature }}</RText>
      </li>
    </ul>

    <!-- Custom Features Slot -->
    <div
      v-if="$slots.features"
      class="r-pricing-card__features-custom"
    >
      <slot name="features" />
    </div>

    <!-- Footer / Action Button -->
    <div class="r-pricing-card__footer">
      <RButton
        :variant="buttonVariant"
        full-width
        :disabled="current"
        @click="handleSelect"
      >
        {{ buttonLabel }}
      </RButton>

      <!-- Custom Footer Slot -->
      <slot name="footer" />
    </div>
  </RCard>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-8) var(--spacing-6);

  /* Transition */
  transition: transform var(--transition-normal) var(--easing-out),
              box-shadow var(--transition-normal) var(--easing-out),
              border-color var(--transition-normal) var(--easing-out);
}

/* ============================================================================
   POPULAR VARIANT
   ============================================================================ */

.r-pricing-card--popular {
  border: 2px solid var(--color-primary);
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
  z-index: 1;
}

.r-pricing-card--popular:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-xl);
}

/* ============================================================================
   CURRENT VARIANT
   ============================================================================ */

.r-pricing-card--current {
  background-color: var(--color-gray-50);
  border-color: var(--color-border-medium);
}

/* ============================================================================
   BADGE
   ============================================================================ */

.r-pricing-card__badge {
  /* Position */
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);

  /* Style */
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 4px 12px;
  border-radius: var(--radius-full);

  /* Typography */
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  /* Shadow */
  box-shadow: var(--shadow-sm);
}

/* ============================================================================
   HEADER
   ============================================================================ */

.r-pricing-card__header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.r-pricing-card__plan-name {
  display: block;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-3);
}

.r-pricing-card__price-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--spacing-1);
}

.r-pricing-card__price {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  line-height: 1;
}

.r-pricing-card__period {
  font-size: var(--font-size-base);
  color: var(--color-text-tertiary);
}

/* ============================================================================
   FEATURES
   ============================================================================ */

.r-pricing-card__features {
  /* Reset */
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-8) 0;

  /* Layout */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.r-pricing-card__feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
}

.r-pricing-card__feature-icon {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px; /* Alinhamento óptico com texto */
}

.r-pricing-card__features-custom {
  margin-bottom: var(--spacing-8);
  flex: 1;
}

/* ============================================================================
   FOOTER
   ============================================================================ */

.r-pricing-card__footer {
  margin-top: auto;
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 768px) {
  .r-pricing-card {
    padding: var(--spacing-6) var(--spacing-4);
  }

  .r-pricing-card__price {
    font-size: 2rem;
  }

  .r-pricing-card--popular {
    transform: scale(1);
  }

  .r-pricing-card--popular:hover {
    transform: scale(1);
  }
}
</style>