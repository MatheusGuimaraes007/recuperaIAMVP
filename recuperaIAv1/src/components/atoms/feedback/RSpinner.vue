<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'success', 'warning', 'error'].includes(value)
  }
})

const spinnerClasses = computed(() => {
  const classes = ['r-spinner']
  classes.push(`r-spinner--${props.size}`)
  classes.push(`r-spinner--${props.color}`)
  return classes
})
</script>

<template>
  <svg
      :class="spinnerClasses"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
  >
    <circle
        class="r-spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        opacity="0.25"
    />
    <path
        class="r-spinner__fill"
        fill="currentColor"
        d="M12 2a10 10 0 0110 10h-3a7 7 0 00-7-7V2z"
    />
  </svg>
</template>

<style scoped>
.r-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Tamanhos */
.r-spinner--xs { width: 12px; height: 12px; }
.r-spinner--sm { width: 16px; height: 16px; }
.r-spinner--md { width: 24px; height: 24px; }
.r-spinner--lg { width: 32px; height: 32px; }
.r-spinner--xl { width: 48px; height: 48px; }

/* Cores */
.r-spinner--primary { color: var(--color-primary-600); }
.r-spinner--secondary { color: var(--text-secondary); }
.r-spinner--white { color: var(--color-white); }
.r-spinner--success { color: var(--color-success-500); }
.r-spinner--warning { color: var(--color-warning-500); }
.r-spinner--error { color: var(--color-error-500); }
</style>