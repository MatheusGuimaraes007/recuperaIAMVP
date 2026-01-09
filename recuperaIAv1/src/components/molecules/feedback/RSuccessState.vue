<script setup>
import RIcon from '@components/atoms/icons/RIcon.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: null },
  actionLabel: { type: String, default: 'Continuar' }
})

defineEmits(['action'])
</script>

<template>
  <div class="r-success-state">
    <div class="r-success-state__icon-wrapper">
      <RIcon name="check" size="40" class="r-success-state__icon" />
    </div>

    <RHeading level="3" class="r-success-state__title">{{ title }}</RHeading>

    <RText v-if="description" color="secondary" class="r-success-state__desc">
      {{ description }}
    </RText>

    <RButton
      variant="primary"
      size="lg"
      class="r-success-state__action"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </RButton>
  </div>
</template>

<style scoped>
.r-success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-8);
  max-width: 480px;
  margin: 0 auto;
}

.r-success-state__icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-success-50);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-6);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.r-success-state__icon {
  color: var(--color-success);
}

.r-success-state__title { margin-bottom: var(--spacing-2); }
.r-success-state__desc { margin-bottom: var(--spacing-8); }

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>