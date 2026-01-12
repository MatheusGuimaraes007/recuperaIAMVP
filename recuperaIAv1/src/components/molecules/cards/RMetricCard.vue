<script setup>
/**
 * RMetricCard - Card de Métrica
 *
 * Componente molecule para exibir métricas e KPIs com valor principal,
 * progresso opcional e informações complementares.
 *
 * @example
 * <RMetricCard
 *   label="Pacientes Ativos"
 *   value="248"
 *   total="300"
 *   :percentage="82.6"
 *   description="Meta: 300 pacientes"
 * />
 */

import { computed } from 'vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RProgress from '@components/atoms/feedback/RProgress.vue'
import RCard from '@components/atoms/layout/RCard.vue'

// Props
const props = defineProps({
  /**
   * Label/título da métrica
   */
  label: {
    type: String,
    required: true
  },

  /**
   * Valor principal da métrica
   */
  value: {
    type: [String, Number],
    required: true
  },

  /**
   * Valor total (opcional, para contexto)
   */
  total: {
    type: [String, Number],
    default: null
  },

  /**
   * Percentual de progresso (0-100)
   */
  percentage: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 0 && value <= 100)
  },

  /**
   * Descrição adicional ou contexto
   */
  description: {
    type: String,
    default: null
  },

  /**
   * Variante da barra de progresso
   * @values primary, success, warning, error, info
   */
  progressVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'error', 'info'].includes(value)
  },

  /**
   * Tamanho da barra de progresso
   * @values sm, md, lg
   */
  progressSize: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Nível do heading do valor
   * @values 1, 2, 3, 4, 5, 6
   */
  valueLevel: {
    type: [String, Number],
    default: 3,
    validator: (value) => [1, 2, 3, 4, 5, 6].includes(Number(value))
  },

  /**
   * Ícone opcional para o card
   */
  icon: {
    type: String,
    default: null
  },

  /**
   * Formatação do valor (função customizada)
   */
  valueFormatter: {
    type: Function,
    default: null
  }
})

// Computed
const formattedValue = computed(() => {
  if (props.valueFormatter) {
    return props.valueFormatter(props.value)
  }
  return props.value
})

const formattedTotal = computed(() => {
  if (props.total && props.valueFormatter) {
    return props.valueFormatter(props.total)
  }
  return props.total
})

const showProgress = computed(() => {
  return props.percentage !== null && props.percentage >= 0
})
</script>

<template>
  <RCard
    padding="md"
    class="r-metric-card"
  >
    <!-- Header with Label and Optional Icon -->
    <div class="r-metric-card__header">
      <RText
        size="sm"
        color="secondary"
        weight="medium"
        class="r-metric-card__label"
      >
        {{ label }}
      </RText>

      <!-- Custom Header Actions Slot -->
      <slot name="header-actions" />
    </div>

    <!-- Value Section -->
    <div class="r-metric-card__value">
      <RHeading
        :level="valueLevel"
        class="r-metric-card__value-main"
      >
        {{ formattedValue }}
      </RHeading>

      <RText
        v-if="total"
        size="sm"
        color="tertiary"
        class="r-metric-card__value-total"
      >
        de {{ formattedTotal }}
      </RText>
    </div>

    <!-- Progress Bar -->
    <RProgress
      v-if="showProgress"
      :value="percentage"
      :size="progressSize"
      :variant="progressVariant"
      class="r-metric-card__progress"
    />

    <!-- Description -->
    <RText
      v-if="description"
      size="xs"
      color="secondary"
      class="r-metric-card__description"
    >
      {{ description }}
    </RText>

    <!-- Custom Footer Slot -->
    <div
      v-if="$slots.footer"
      class="r-metric-card__footer"
    >
      <slot name="footer" />
    </div>
  </RCard>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-metric-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* ============================================================================
   HEADER
   ============================================================================ */

.r-metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.r-metric-card__label {
  flex: 1;
}

/* ============================================================================
   VALUE SECTION
   ============================================================================ */

.r-metric-card__value {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
  margin: var(--spacing-1) 0 var(--spacing-2) 0;
}

.r-metric-card__value-main {
  line-height: 1.2;
}

.r-metric-card__value-total {
  line-height: 1.2;
}

/* ============================================================================
   PROGRESS BAR
   ============================================================================ */

.r-metric-card__progress {
  margin: var(--spacing-2) 0;
}

/* ============================================================================
   DESCRIPTION
   ============================================================================ */

.r-metric-card__description {
  display: block;
  line-height: 1.4;
  margin-top: var(--spacing-1);
}

/* ============================================================================
   FOOTER
   ============================================================================ */

.r-metric-card__footer {
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-border-light);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-metric-card__value {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
  }
}
</style>