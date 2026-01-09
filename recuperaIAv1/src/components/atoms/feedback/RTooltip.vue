<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  content: { type: String, required: true },
  placement: { type: String, default: 'top', validator: (v) => ['top','bottom','left','right'].includes(v) },
  trigger: { type: String, default: 'hover', validator: (v) => ['hover','click','focus'].includes(v) }
})

const isVisible = ref(false)

const show = () => { isVisible.value = true }
const hide = () => { isVisible.value = false }
const toggle = () => { isVisible.value = !isVisible.value }
</script>

<template>
  <div class="r-tooltip" @mouseenter="trigger === 'hover' && show()" @mouseleave="trigger === 'hover' && hide()" @click="trigger === 'click' && toggle()" @focus="trigger === 'focus' && show()" @blur="trigger === 'focus' && hide()">
    <slot />
    <div v-if="isVisible" :class="['r-tooltip__content', `r-tooltip__content--${placement}`]">{{ content }}</div>
  </div>
</template>

<style scoped>
.r-tooltip { position: relative; display: inline-block; }
.r-tooltip__content { position: absolute; z-index: 1000; padding: var(--spacing-2) var(--spacing-3); background-color: var(--color-gray-900); color: var(--color-white); font-size: var(--font-size-sm); border-radius: var(--radius-md); white-space: nowrap; box-shadow: var(--shadow-lg); }
.r-tooltip__content--top { bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: var(--spacing-2); }
.r-tooltip__content--bottom { top: 100%; left: 50%; transform: translateX(-50%); margin-top: var(--spacing-2); }
.r-tooltip__content--left { right: 100%; top: 50%; transform: translateY(-50%); margin-right: var(--spacing-2); }
.r-tooltip__content--right { left: 100%; top: 50%; transform: translateY(-50%); margin-left: var(--spacing-2); }
</style>