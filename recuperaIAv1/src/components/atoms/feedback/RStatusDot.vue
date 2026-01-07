<script setup>
/**
 * RStatusDot - Indicador de status (dot)
 */
const props = defineProps({
  status: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'warning', 'error', 'info'].includes(v)
  },
  pulse: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})
</script>

<template>
  <span
    :class="[
      'r-status-dot',
      `r-status-dot--${status}`,
      `r-status-dot--${size}`,
      { 'r-status-dot--pulse': pulse }
    ]"
  />
</template>

<style scoped>
.r-status-dot {
  display: inline-block;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Sizes */
.r-status-dot--sm { width: 8px; height: 8px; }
.r-status-dot--md { width: 12px; height: 12px; }
.r-status-dot--lg { width: 16px; height: 16px; }

/* Status */
.r-status-dot--default { background-color: var(--color-gray-400); }
.r-status-dot--success { background-color: var(--color-success); }
.r-status-dot--warning { background-color: var(--color-warning); }
.r-status-dot--error { background-color: var(--color-error); }
.r-status-dot--info { background-color: var(--color-info); }

/* Pulse */
.r-status-dot--pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>