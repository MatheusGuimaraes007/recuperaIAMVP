<script setup>
/**
 * REmptyState - Estado vazio
 */
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

const props = defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, required: true },
  description: { type: String, default: null },
  actionLabel: { type: String, default: null }
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="r-empty-state">
    <div class="r-empty-state__icon">{{ icon }}</div>
    <RHeading level="3" align="center">{{ title }}</RHeading>
    <RText v-if="description" color="secondary" align="center" class="r-empty-state__description">
      {{ description }}
    </RText>
    <RButton
      v-if="actionLabel"
      variant="primary"
      @click="emit('action')"
      class="r-empty-state__action"
    >
      {{ actionLabel }}
    </RButton>
  </div>
</template>

<style scoped>
.r-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  text-align: center;
}

.r-empty-state__icon {
  font-size: 64px;
  margin-bottom: var(--spacing-4);
}

.r-empty-state__description {
  margin-top: var(--spacing-2);
  max-width: 400px;
}

.r-empty-state__action {
  margin-top: var(--spacing-6);
}
</style>