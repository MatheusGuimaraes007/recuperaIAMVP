<script setup>
import { ref } from 'vue'

const props = defineProps({
  content: { type: String, required: true },
  placement: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v)
  },
  trigger: {
    type: String,
    default: 'hover',
    validator: (v) => ['hover', 'click', 'focus'].includes(v)
  }
})

const isVisible = ref(false)

const show = () => { isVisible.value = true }
const hide = () => { isVisible.value = false }
const toggle = () => { isVisible.value = !isVisible.value }
</script>

<template>
  <div
      class="r-tooltip"
      @mouseenter="trigger === 'hover' && show()"
      @mouseleave="trigger === 'hover' && hide()"
      @click="trigger === 'click' && toggle()"
      @focus="trigger === 'focus' && show()"
      @blur="trigger === 'focus' && hide()"
  >
    <slot />
    <transition name="fade">
      <div
          v-if="isVisible"
          :class="['r-tooltip__content', `r-tooltip__content--${placement}`]"
          role="tooltip"
      >
        {{ content }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.r-tooltip {
  position: relative;
  display: inline-block;
}

.r-tooltip__content {
  position: absolute;
  z-index: var(--z-tooltip);
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-gray-900);
  color: var(--color-white);
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  pointer-events: none;
}

.r-tooltip__content--top {
  bottom: calc(100% + var(--spacing-2));
  left: 50%;
  transform: translateX(-50%);
}

.r-tooltip__content--bottom {
  top: calc(100% + var(--spacing-2));
  left: 50%;
  transform: translateX(-50%);
}

.r-tooltip__content--left {
  right: calc(100% + var(--spacing-2));
  top: 50%;
  transform: translateY(-50%);
}

.r-tooltip__content--right {
  left: calc(100% + var(--spacing-2));
  top: 50%;
  transform: translateY(-50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast) var(--easing-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>