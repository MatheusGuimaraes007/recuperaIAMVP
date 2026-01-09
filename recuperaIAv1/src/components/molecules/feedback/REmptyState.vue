<script setup>
import RIcon from '@components/atoms/icons/RIcon.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

defineProps({
  icon: { type: String, default: 'inbox' },
  title: { type: String, required: true },
  description: { type: String, default: null },
  actionLabel: { type: String, default: null }
})

defineEmits(['action'])
</script>

<template>
  <div class="r-empty-state">
    <div class="r-empty-state__icon-wrapper">
      <RIcon :name="icon" size="48" class="r-empty-state__icon" />
    </div>

    <RHeading level="4" class="r-empty-state__title">{{ title }}</RHeading>

    <RText v-if="description" color="secondary" align="center" class="r-empty-state__desc">
      {{ description }}
    </RText>

    <div v-if="actionLabel" class="r-empty-state__action">
      <RButton variant="primary" @click="$emit('action')">
        {{ actionLabel }}
      </RButton>
    </div>
  </div>
</template>

<style scoped>
.r-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;
}

.r-empty-state__icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.r-empty-state__icon {
  color: var(--text-tertiary);
}

.r-empty-state__desc {
  max-width: 400px;
  margin-top: var(--spacing-2);
}

.r-empty-state__action {
  margin-top: var(--spacing-6);
}
</style>