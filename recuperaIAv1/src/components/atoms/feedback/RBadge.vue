<script setup>
/**
 * RBadge - Badge de status/contagem
 */
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
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  white-space: nowrap;
}

/* Sizes */
.r-badge--sm {
  padding: 2px 6px;
  font-size: var(--font-size-xs);
  min-height: 18px;
}

.r-badge--md {
  padding: 4px 8px;
  font-size: var(--font-size-sm);
  min-height: 22px;
}

.r-badge--lg {
  padding: 6px 12px;
  font-size: var(--font-size-base);
  min-height: 28px;
}

/* Variants */
.r-badge--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-badge--secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.r-badge--success {
  background-color: var(--color-success-bg);
  color: var(--color-success-700);
}

.r-badge--warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-700);
}

.r-badge--error {
  background-color: var(--color-error-bg);
  color: var(--color-error-700);
}

.r-badge--info {
  background-color: var(--color-info-bg);
  color: var(--color-info-700);
}

/* Dot */
.r-badge--dot {
  padding: 0;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  min-height: unset;
}

/* Pill */
.r-badge--pill {
  border-radius: var(--radius-full);
}
</style>