<script setup>
/**
 * RContainer - Container responsivo
 */
import { computed } from 'vue'

const props = defineProps({
  maxWidth: {
    type: String,
    default: 'lg',
    validator: (v) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(v)
  },
  padding: { type: Boolean, default: true }
})

// CORRIGIDO: Usar breakpoints do design system em vez de hardcoded
const maxWidthMap = {
  sm: 'var(--breakpoint-sm)',    // 640px
  md: 'var(--breakpoint-md)',    // 768px
  lg: 'var(--breakpoint-lg)',    // 1024px
  xl: 'var(--breakpoint-xl)',    // 1280px
  '2xl': 'var(--breakpoint-2xl)', // 1536px
  full: '100%'
}

const style = computed(() => ({
  maxWidth: maxWidthMap[props.maxWidth]
}))
</script>

<template>
  <div
    :class="[
      'r-container',
      { 'r-container--padding': padding }
    ]"
    :style="style"
  >
    <slot />
  </div>
</template>

<style scoped>
.r-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.r-container--padding {
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@media (min-width: 768px) {
  .r-container--padding {
    padding-left: var(--spacing-6);
    padding-right: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .r-container--padding {
    padding-left: var(--spacing-8);
    padding-right: var(--spacing-8);
  }
}
</style>