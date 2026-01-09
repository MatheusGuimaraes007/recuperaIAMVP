<script setup>
/**
 * RStatCard - Card de estatística
 */
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RBadge from '@components/atoms/feedback/RBadge.vue'
import {computed} from "vue";
import RCard from "@components/atoms/layout/RCard.vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: null },
  trend: { type: Number, default: null }, // +5, -3, etc
  trendLabel: { type: String, default: null },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'success', 'warning', 'error'].includes(v)
  }
})

const trendVariant = computed(() => {
  if (props.trend > 0) return 'success'
  if (props.trend < 0) return 'error'
  return 'secondary'
})

const trendIcon = computed(() => {
  if (props.trend > 0) return '↑'
  if (props.trend < 0) return '↓'
  return '→'
})
</script>

<template>
  <RCard padding="md" :hoverable="true" class="r-stat-card">
    <div class="r-stat-card__header">
      <div class="r-stat-card__icon" v-if="icon">
        {{ icon }}
      </div>
      <div class="r-stat-card__content">
        <RText size="sm" color="secondary" class="r-stat-card__title">
          {{ title }}
        </RText>
        <RHeading level="2" :color="variant">
          {{ value }}
        </RHeading>
      </div>
    </div>

    <div v-if="trend !== null" class="r-stat-card__footer">
      <RBadge :variant="trendVariant" size="sm">
        {{ trendIcon }} {{ Math.abs(trend) }}%
      </RBadge>
      <RText v-if="trendLabel" size="xs" color="tertiary">
        {{ trendLabel }}
      </RText>
    </div>
  </RCard>
</template>

<style scoped>
.r-stat-card__header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.r-stat-card__icon {
  font-size: 32px;
  flex-shrink: 0;
}

.r-stat-card__content {
  flex: 1;
}

.r-stat-card__title {
  margin-bottom: var(--spacing-1);
  display: block;
}

.r-stat-card__footer {
  margin-top: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}
</style>