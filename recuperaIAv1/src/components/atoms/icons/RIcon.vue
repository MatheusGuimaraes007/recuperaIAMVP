<script setup>
/**
 * RIcon - Wrapper para ícones Lucide
 * Requer: lucide-vue-next
 */
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: {
    type: [String, Number],
    default: 24
  },
  color: { type: String, default: 'currentColor' },
  strokeWidth: { type: [String, Number], default: 2 }
})

const component = computed(() => {
  const iconName = props.name.charAt(0).toUpperCase() + props.name.slice(1)
  return icons[iconName] || icons.HelpCircle
})
</script>

<template>
  <component
    :is="component"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    class="r-icon"
  />
</template>

<style scoped>
.r-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>