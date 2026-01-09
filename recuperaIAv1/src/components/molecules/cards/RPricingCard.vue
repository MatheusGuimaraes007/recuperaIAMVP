<script setup>
import RCard from '@components/atoms/layout/RCard.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  planName: { type: String, required: true },
  price: { type: String, required: true }, // ex: "R$ 97"
  period: { type: String, default: '/mês' },
  features: { type: Array, default: () => [] }, // Strings
  isPopular: { type: Boolean, default: false },
  buttonLabel: { type: String, default: 'Assinar Agora' },
  current: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>

<template>
  <RCard
    class="r-pricing-card"
    :class="{ 'r-pricing-card--popular': isPopular }"
    :bordered="!isPopular"
  >
    <div v-if="isPopular" class="r-pricing-card__badge">Mais Popular</div>

    <div class="r-pricing-card__header">
      <RText weight="semibold" color="secondary" class="r-pricing-card__name">
        {{ planName }}
      </RText>
      <div class="r-pricing-card__price-wrapper">
        <span class="r-pricing-card__price">{{ price }}</span>
        <span class="r-pricing-card__period">{{ period }}</span>
      </div>
    </div>

    <ul class="r-pricing-card__features">
      <li v-for="(feature, index) in features" :key="index">
        <RIcon name="check" size="16" class="r-pricing-card__check" />
        <RText size="sm">{{ feature }}</RText>
      </li>
    </ul>

    <div class="r-pricing-card__footer">
      <RButton
        :variant="isPopular ? 'primary' : 'outline'"
        full-width
        :disabled="current"
        @click="$emit('select')"
      >
        {{ current ? 'Plano Atual' : buttonLabel }}
      </RButton>
    </div>
  </RCard>
</template>

<style scoped>
.r-pricing-card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.r-pricing-card--popular {
  border: 2px solid var(--color-primary);
  transform: scale(1.02); /* Slight lift */
  z-index: 1;
}

.r-pricing-card__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: bold;
}

.r-pricing-card__header { text-align: center; margin-bottom: var(--spacing-6); }
.r-pricing-card__name { text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-2); }
.r-pricing-card__price { font-size: 2.5rem; font-weight: bold; color: var(--text-primary); }
.r-pricing-card__period { color: var(--text-tertiary); }

.r-pricing-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-8) 0;
  flex: 1;
}

.r-pricing-card__features li {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.r-pricing-card__check { color: var(--color-primary); flex-shrink: 0; }
.r-pricing-card__footer { margin-top: auto; }
</style>