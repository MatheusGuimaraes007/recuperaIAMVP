<script setup>
import RCard from '@components/atoms/layout/RCard.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: null },
  icon: { type: String, default: null },
  variant: { type: String, default: 'default' } // default, primary, warning
})
</script>

<template>
  <RCard class="r-info-card" :class="`r-info-card--${variant}`">
    <div class="r-info-card__content">
      <div v-if="icon" class="r-info-card__icon-wrapper">
        <RIcon :name="icon" size="24" />
      </div>
      <div>
        <RHeading level="5" class="r-info-card__title">{{ title }}</RHeading>
        <RText size="sm" color="secondary">{{ description }}</RText>
      </div>
    </div>
  </RCard>
</template>

<style scoped>
.r-info-card__content {
  display: flex;
  gap: var(--spacing-4);
  align-items: flex-start;
}

.r-info-card__icon-wrapper {
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

/* Variant Styling Example */
.r-info-card--primary .r-info-card__icon-wrapper {
  background-color: var(--color-primary-50);
  color: var(--color-primary);
}
</style>