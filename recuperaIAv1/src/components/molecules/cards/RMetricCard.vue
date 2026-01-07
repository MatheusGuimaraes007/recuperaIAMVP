<script setup>
/**
 * RMetricCard - Card de métrica com gráfico
 */
import RCard from './RCard.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RProgress from '@components/atoms/feedback/RProgress.vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  total: { type: [String, Number], default: null },
  percentage: { type: Number, default: null },
  description: { type: String, default: null }
})
</script>

<template>
  <RCard padding="md">
    <RText size="sm" color="secondary" weight="medium">{{ label }}</RText>

    <div class="r-metric-card__value">
      <RHeading level="3">{{ value }}</RHeading>
      <RText v-if="total" size="sm" color="tertiary">
        de {{ total }}
      </RText>
    </div>

    <RProgress
      v-if="percentage !== null"
      :value="percentage"
      size="sm"
      variant="primary"
      class="r-metric-card__progress"
    />

    <RText v-if="description" size="xs" color="secondary" class="r-metric-card__description">
      {{ description }}
    </RText>
  </RCard>
</template>

<style scoped>
.r-metric-card__value {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
  margin: var(--spacing-2) 0;
}

.r-metric-card__progress {
  margin: var(--spacing-3) 0;
}

.r-metric-card__description {
  margin-top: var(--spacing-2);
  display: block;
}
</style>