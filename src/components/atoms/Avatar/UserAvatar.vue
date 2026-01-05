<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(v)
  }
})


const sizeClasses = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-base' },
  xl: { container: 'w-16 h-16', text: 'text-xl' },
  '2xl': { container: 'w-20 h-20', text: 'text-2xl' },
  '3xl': { container: 'w-24 h-24', text: 'text-3xl' }
}

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
})

const backgroundColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500'
]

const backgroundColor = computed(() => {
  if (!props.name) return backgroundColors[0]
  const index = props.name.length % backgroundColors.length
  return backgroundColors[index]
})
</script>

<template>
  <div
      :class="[
      'rounded-full flex items-center justify-center font-semibold text-white overflow-hidden flex-shrink-0',
      sizeClasses[size].container,
      url ? '' : backgroundColor
    ]"
  >
    <img
        v-if="url"
        :src="url"
        :alt="name"
        class="w-full h-full object-cover"
    />
    <span v-else :class="sizeClasses[size].text">
      {{ initials }}
    </span>
  </div>
</template>


