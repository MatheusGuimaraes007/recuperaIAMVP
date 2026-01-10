<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

const sizeMap = {
  xs: 'var(--spacing-3)',
  sm: 'var(--spacing-4)',
  md: 'var(--spacing-5)',
  lg: 'var(--spacing-6)',
  xl: 'var(--spacing-8)'
}

const dimensions = computed(() => sizeMap[props.size])
</script>

<template>
  <span
      class="r-icon"
      :style="{
      width: dimensions,
      height: dimensions,
      color: color
    }"
  >
    <slot />
  </span>
</template>

<style scoped>
.r-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.r-icon > :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>