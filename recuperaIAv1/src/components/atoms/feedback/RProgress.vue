<script setup>
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
  position: relative;
  flex: 1;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.r-progress__track--sm {
  height: var(--spacing-1);
}
.r-progress__track--md {
  height: var(--spacing-2);
}
.r-progress__track--lg {
  height: var(--spacing-3);
}

.r-progress__bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--easing-out);
}

.r-progress__bar--primary {
  background-color: var(--color-primary-600);
}
.r-progress__bar--success {
  background-color: var(--color-success-500);
}
.r-progress__bar--warning {
  background-color: var(--color-warning-500);
}
.r-progress__bar--error {
  background-color: var(--color-error-500);
}

.r-progress__label {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>