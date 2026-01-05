<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary text-background-base hover:bg-primary-hover active:scale-95 font-semibold shadow-lg shadow-primary/20',
    secondary: 'border border-border-card text-gray-300 hover:border-gray-600 hover:bg-gray-800/50 active:scale-95',
    danger: 'bg-status-error-light text-status-error border border-status-error-border hover:bg-status-error/20 active:scale-95',
    ghost: 'text-primary border border-primary-300 hover:bg-primary-100 hover:border-primary active:scale-95'
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  if (props.icon) {
    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3'
    }
    return sizes[props.size]
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  return sizes[props.size]
})

const widthClass = computed(() => props.fullWidth ? 'w-full' : '')

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
      :class="[
      'btn-base',
      variantClasses,
      sizeClasses,
      widthClass,
      { 'opacity-50 cursor-not-allowed': disabled || loading }
    ]"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <svg
        v-if="loading"
        class="animate-spin h-4 w-4 mr-2"
        viewBox="0 0 24 24"
    >
      <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
      />
      <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <slot></slot>
  </button>
</template>