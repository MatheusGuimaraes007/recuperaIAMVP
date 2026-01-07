<script setup>
/**
 * RStatusBadge - Badge com dot de status
 */
import RStatusDot from '@components/atoms/feedback/RStatusDot.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  label: { type: String, required: true },
  status: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'warning', 'error', 'info'].includes(v)
  },
  pulse: { type: Boolean, default: false }
})
</script>

<template>
  <div class="r-status-badge">
    <RStatusDot :status="status" :pulse="pulse" size="md" />
    <RText size="sm" weight="medium">{{ label }}</RText>
  </div>
</template>

<style scoped>
.r-status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
  background-color: var(--bg-tertiary);
}
</style>