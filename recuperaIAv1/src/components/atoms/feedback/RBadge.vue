<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  dot: { type: Boolean, default: false },
  pill: { type: Boolean, default: false }
})
</script>

<template>
  <span
      :class="[
      'r-badge',
      `r-badge--${variant}`,
      `r-badge--${size}`,
      { 'r-badge--dot': dot },
      { 'r-badge--pill': pill }
    ]"
  >
    <slot />
  </span>
</template>

<style scoped>
.r-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans),sans-serif;
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  white-space: nowrap;
  line-height: var(--line-height-tight);
}

.r-badge--sm {
  padding: var(--spacing-0-5) var(--spacing-1-5);
  font-size: var(--font-size-xs);
  min-height: 18px;
}
.r-badge--md {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-sm);
  min-height: 22px;
}
.r-badge--lg {
  padding: var(--spacing-1-5) var(--spacing-3);
  font-size: var(--font-size-base);
  min-height: 28px;
}

.r-badge--primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
}
.r-badge--secondary {
  background-color: var(--color-gray-200);
  color: var(--text-primary);
}
.r-badge--success {
  background-color: var(--color-success-500);
  color: var(--color-white);
}
.r-badge--warning {
  background-color: var(--color-warning-500);
  color: var(--color-white);
}
.r-badge--error {
  background-color: var(--color-error-500);
  color: var(--color-white);
}
.r-badge--info {
  background-color: var(--color-info-500);
  color: var(--color-white);
}

.r-badge--dot {
  padding: 0;
  width: 8px;
  height: 8px;
  min-height: 8px;
  border-radius: var(--radius-full);
}
.r-badge--pill {
  border-radius: var(--radius-full);
}
</style>