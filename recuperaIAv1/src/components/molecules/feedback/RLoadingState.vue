<script setup>
/**
 * RLoadingState - Estado de loading
 */
import RSpinner from '@components/atoms/feedback/RSpinner.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  message: { type: String, default: 'Carregando...' },
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
  }
})
</script>

<template>
  <div class="r-loading-state">
    <RSpinner :size="size" color="primary" />
    <RText color="secondary" align="center" class="r-loading-state__message">
      {{ message }}
    </RText>
  </div>
</template>

<style scoped>
.r-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  gap: var(--spacing-4);
}
</style>