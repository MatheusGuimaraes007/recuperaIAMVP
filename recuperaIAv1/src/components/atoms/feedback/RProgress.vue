<script setup>
/**
 * RProgress - Barra de progresso
 */
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (v) => v >= 0 && v <= 100
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'warning', 'error'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  showLabel: { type: Boolean, default: false }
})
</script>

<template>
  <div class="r-progress">
    <div
      :class="[
        'r-progress__track',
        `r-progress__track--${size}`
      ]"
    >
      <div
        :class="[
          'r-progress__bar',
          `r-progress__bar--${variant}`
        ]"
        :style="{ width: `${value}%` }"
        role="progressbar"
        :aria-valuenow="value"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
    <span v-if="showLabel" class="r-progress__label">
      {{ value }}%
    </span>
  </div>
</template>

<style scoped>
.r-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
}

.r-progress__track {
  flex: 1;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.r-progress__track--sm { height: 4px; }
.r-progress__track--md { height: 8px; }
.r-progress__track--lg { height: 12px; }

.r-progress__bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) ease-out;
}

.r-progress__bar--primary { background-color: var(--color-primary); }
.r-progress__bar--success { background-color: var(--color-success); }
.r-progress__bar--warning { background-color: var(--color-warning); }
.r-progress__bar--error { background-color: var(--color-error); }

.r-progress__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}
</style>