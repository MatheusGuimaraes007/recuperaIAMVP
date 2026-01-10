<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'circular', 'rectangular'].includes(v)
  },
  width: { type: [String, Number], default: null },
  height: { type: [String, Number], default: null },
  rounded: { type: Boolean, default: false }
})

const styles = computed(() => {
  const style = {}
  if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return style
})
</script>

<template>
  <div
      :class="[
      'r-skeleton',
      `r-skeleton--${variant}`,
      { 'r-skeleton--rounded': rounded }
    ]"
      :style="styles"
  />
</template>

<style scoped>
.r-skeleton {
  background: linear-gradient(
      90deg,
      var(--color-gray-200) 25%,
      var(--color-gray-100) 50%,
      var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.r-skeleton--text {
  height: 1em;
  border-radius: var(--radius-sm);
}

.r-skeleton--circular {
  border-radius: var(--radius-full);
}

.r-skeleton--rectangular {
  border-radius: var(--radius-md);
}

.r-skeleton--rounded {
  border-radius: var(--radius-lg);
}
</style>