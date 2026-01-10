<script setup>
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

.r-status-dot--sm {
  width: var(--spacing-2);
  height: var(--spacing-2);
}
.r-status-dot--md {
  width: var(--spacing-3);
  height: var(--spacing-3);
}
.r-status-dot--lg {
  width: var(--spacing-4);
  height: var(--spacing-4);
}

.r-status-dot--default {
  background-color: var(--color-gray-400);
}
.r-status-dot--success {
  background-color: var(--color-success-500);
}
.r-status-dot--warning {
  background-color: var(--color-warning-500);
}
.r-status-dot--error {
  background-color: var(--color-error-500);
}
.r-status-dot--info {
  background-color: var(--color-info-500);
}

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

.r-status-dot--pulse::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background-color: inherit;
  opacity: 0.75;
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.75;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>