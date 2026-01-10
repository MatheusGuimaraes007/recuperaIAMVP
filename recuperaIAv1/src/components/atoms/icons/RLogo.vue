<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
  },
  variant: {
    type: String,
    default: 'full',
    validator: (v) => ['full', 'icon', 'text'].includes(v)
  }
})

const sizeMap = {
  sm: { height: 'var(--spacing-6)', width: '100px' },
  md: { height: 'var(--spacing-8)', width: '140px' },
  lg: { height: 'var(--spacing-12)', width: '200px' },
  xl: { height: 'var(--spacing-16)', width: '280px' }
}

const dimensions = computed(() => sizeMap[props.size])
</script>

<template>
  <div class="r-logo" :style="{ height: dimensions.height }">
    <svg
        v-if="variant !== 'text'"
        :width="dimensions.height"
        :height="dimensions.height"
        viewBox="0 0 32 32"
        fill="none"
        class="r-logo__icon"
    >
      <rect width="32" height="32" rx="8" fill="var(--color-primary-600)" />
      <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="white"
          font-size="20"
          font-weight="bold"
          font-family="var(--font-sans)"
      >
        R
      </text>
    </svg>

    <span v-if="variant !== 'icon'" class="r-logo__text">
      Recupera.IA
    </span>
  </div>
</template>

<style scoped>
.r-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-family: var(--font-sans),sans-serif;
}

.r-logo__icon {
  flex-shrink: 0;
}

.r-logo__text {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}
</style>