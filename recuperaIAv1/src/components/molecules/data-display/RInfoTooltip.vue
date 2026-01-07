<script setup>
/**
 * RInfoTooltip - Tooltip de informação
 */
import { ref } from 'vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  content: { type: String, required: true },
  position: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v)
  }
})

const showTooltip = ref(false)
</script>

<template>
  <div class="r-info-tooltip">
    <RIconButton
      variant="ghost"
      size="sm"
      aria-label="Mais informações"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      ℹ️
    </RIconButton>

    <div
      v-if="showTooltip"
      :class="['r-info-tooltip__content', `r-info-tooltip__content--${position}`]"
      role="tooltip"
    >
      {{ content }}
    </div>
  </div>
</template>

<style scoped>
.r-info-tooltip {
  position: relative;
  display: inline-block;
}

.r-info-tooltip__content {
  position: absolute;
  z-index: var(--z-index-tooltip);
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-gray-900);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  pointer-events: none;
}

.r-info-tooltip__content--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
}

.r-info-tooltip__content--bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
}

.r-info-tooltip__content--left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
}

.r-info-tooltip__content--right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(4px);
}
</style>