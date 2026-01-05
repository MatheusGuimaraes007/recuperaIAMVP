<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v)
  },
  delay: {
    type: Number,
    default: 200
  },
  maxWidth: {
    type: String,
    default: '200px'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const isVisible = ref(false)
let timeoutId = null

const showTooltip = () => {
  if (props.disabled) return

  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hideTooltip = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  isVisible.value = false
}

const positionClasses = computed(() => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }
  return positions[props.position]
})

const arrowClasses = computed(() => {
  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  }
  return arrows[props.position]
})
</script>

<template>
  <div
      class="relative inline-flex"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
  >

    <slot />


    <Transition
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isVisible && content"
          :class="[
          'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg',
          'whitespace-nowrap pointer-events-none',
          positionClasses
        ]"
          :style="{ maxWidth }"
          role="tooltip"
      >
        {{ content }}


        <div
            :class="[
            'absolute w-0 h-0 border-4 border-gray-900',
            arrowClasses
          ]"
        />
      </div>
    </Transition>
  </div>
</template>
