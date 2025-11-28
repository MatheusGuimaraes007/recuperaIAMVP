<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    // Aceita qualquer string para evitar avisos no console, tratamos no computed
    validator: (value) => true
  },
  showTooltip: {
    type: Boolean,
    default: true
  }
})

const imageError = ref(false)
const imageUrl = computed(() => props.url && !imageError.value ? props.url : null)

const initials = computed(() => {
  if (!props.name) return '??'
  return props.name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
})

const AVATAR_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-red-500 to-red-600',
  'from-teal-500 to-teal-600',
  'from-yellow-500 to-yellow-600',
  'from-cyan-500 to-cyan-600'
]

const gradientClasses = computed(() => {
  if (!props.name) return AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]' },
    sm: { container: 'w-8 h-8', text: 'text-xs' },
    md: { container: 'w-10 h-10', text: 'text-sm' },
    lg: { container: 'w-12 h-12', text: 'text-base' },
    xl: { container: 'w-16 h-16', text: 'text-lg' },
    '2xl': { container: 'w-20 h-20', text: 'text-xl' },
    '3xl': { container: 'w-24 h-24', text: 'text-2xl' }
  }

  // ✅ FALLBACK DE SEGURANÇA: Se o tamanho não existir, usa 'md'
  return sizes[props.size] || sizes.md
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div
      class="relative inline-flex items-center justify-center rounded-full overflow-hidden group flex-shrink-0 ring-2 ring-gray-700/50 hover:ring-primary-300 transition-all duration-200"
      :class="sizeClasses.container"
  >
    <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="name"
        @error="handleImageError"
        class="w-full h-full object-cover"
    />

    <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br text-white font-semibold select-none"
        :class="[gradientClasses, sizeClasses.text]"
    >
      {{ initials }}
    </div>

    <div
        v-if="showTooltip"
        class="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg"
    >
      {{ name }}
      <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
        <div class="border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  </div>
</template>