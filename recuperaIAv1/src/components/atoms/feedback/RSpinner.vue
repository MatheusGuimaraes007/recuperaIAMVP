<script setup>
/**
 * RSpinner - Componente de Loading
 */

import { computed } from 'vue'

const props = defineProps({
  /**
   * Tamanho do spinner
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },

  /**
   * Cor do spinner
   */
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
    />
    <path 
      class="r-spinner__path" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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

/* Sizes */
.r-spinner--xs { width: 12px; height: 12px; }
.r-spinner--sm { width: 16px; height: 16px; }
.r-spinner--md { width: 24px; height: 24px; }
.r-spinner--lg { width: 32px; height: 32px; }
.r-spinner--xl { width: 48px; height: 48px; }

/* Colors */
.r-spinner--primary { color: var(--color-primary); }
.r-spinner--secondary { color: var(--text-secondary); }
.r-spinner--white { color: var(--color-white); }
.r-spinner--success { color: var(--color-success); }
.r-spinner--warning { color: var(--color-warning); }
.r-spinner--error { color: var(--color-error); }

.r-spinner__track {
  opacity: 0.25;
}

.r-spinner__path {
  opacity: 0.75;
}
</style>
