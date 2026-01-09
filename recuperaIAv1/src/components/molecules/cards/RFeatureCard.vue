<script setup>
import RCard from '@components/atoms/layout/RCard.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'star' },
  actionLabel: { type: String, default: null }
})

defineEmits(['action'])
</script>

<template>
  <RCard class="r-feature-card" hoverable>
    <div class="r-feature-card__icon">
      <RIcon :name="icon" size="32" />
    </div>

    <RHeading level="4" class="r-feature-card__title">{{ title }}</RHeading>

    <RText color="secondary" class="r-feature-card__desc">
      {{ description }}
    </RText>

    <div v-if="actionLabel" class="r-feature-card__action">
      <RButton variant="outline" size="sm" @click="$emit('action')">
        {{ actionLabel }}
      </RButton>
    </div>
  </RCard>
</template>

<style scoped>
.r-feature-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.r-feature-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);
  color: var(--color-primary);
}

.r-feature-card__title { margin-bottom: var(--spacing-2); }
.r-feature-card__desc { margin-bottom: var(--spacing-6); flex: 1; }
.r-feature-card__action { width: 100%; }
</style>