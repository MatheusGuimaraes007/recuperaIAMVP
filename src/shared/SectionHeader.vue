<script setup>
import { computed } from 'vue'
import {
  Clock,
  TrendingUp,
  Briefcase,
  FileText,
  Shield,
  Info,
  Calendar,
  DollarSign,
  Target,
  Award,
  BarChart3
} from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'accent'].includes(value)
  }
})

// Mapeamento de ícones
const ICON_MAP = {
  clock: Clock,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  'file-text': FileText,
  shield: Shield,
  info: Info,
  calendar: Calendar,
  'dollar-sign': DollarSign,
  target: Target,
  award: Award,
  'bar-chart': BarChart3
}

const iconComponent = computed(() => {
  return ICON_MAP[props.icon] || Info
})

const variantClasses = computed(() => {
  const variants = {
    default: {
      iconBg: 'bg-gray-700/50',
      iconColor: 'text-gray-400',
      titleColor: 'text-white',
      border: 'border-gray-700/50'
    },
    primary: {
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary',
      titleColor: 'text-primary',
      border: 'border-primary-300'
    },
    accent: {
      iconBg: 'bg-metric-blue-light',
      iconColor: 'text-metric-blue',
      titleColor: 'text-metric-blue',
      border: 'border-metric-blue-border'
    }
  }
  return variants[props.variant]
})
</script>

<template>
  <div class="mb-6 pb-4 border-b" :class="variantClasses.border">
    <div class="flex items-center gap-4">
      <!-- Ícone -->
      <div
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-6 hover:scale-110 group"
          :class="variantClasses.iconBg"
      >
        <component
            :is="iconComponent"
            :size="24"
            :class="variantClasses.iconColor"
            class="transition-transform"
        />
      </div>

      <!-- Texto -->
      <div class="flex-1">
        <h4
            class="text-xl font-bold"
            :class="variantClasses.titleColor"
        >
          {{ title }}
        </h4>
        <p v-if="subtitle" class="text-sm text-gray-400 mt-0.5">
          {{ subtitle }}
        </p>
      </div>

      <!-- Ação (slot) -->
      <div v-if="$slots.action" class="flex-shrink-0">
        <slot name="action" />
      </div>
    </div>

    <!-- Description (slot) -->
    <div v-if="$slots.description" class="mt-3 text-sm text-gray-400 ml-16">
      <slot name="description" />
    </div>
  </div>
</template>