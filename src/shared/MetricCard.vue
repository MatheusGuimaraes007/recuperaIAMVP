<script setup>
import { computed } from 'vue'
import {
  Users,
  MessageCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  Activity,
  Zap,
  Award,
  BarChart3,
  Percent,
  Briefcase
} from 'lucide-vue-next'
import Card from './Card.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'purple', 'green', 'orange', 'primary'].includes(value)
  },
  trend: {
    type: Object,
    default: null,
    validator: (value) => {
      if (!value) return true
      return value.value !== undefined && ['up', 'down'].includes(value.direction)
    }
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const ICON_MAP = {
  users: Users,
  'message-circle': MessageCircle,
  'check-circle': CheckCircle,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'dollar-sign': DollarSign,
  target: Target,
  clock: Clock,
  activity: Activity,
  zap: Zap,
  award: Award,
  'bar-chart': BarChart3,
  percent: Percent,
  briefcase: Briefcase
}

const iconComponent = computed(() => {
  return ICON_MAP[props.icon] || Activity
})

const variantClasses = computed(() => {
  const variants = {
    blue: {
      gradient: 'from-metric-blue/5 to-transparent',
      iconBg: 'bg-metric-blue-light',
      iconColor: 'text-metric-blue',
      border: 'border-metric-blue-border'
    },
    purple: {
      gradient: 'from-metric-purple/5 to-transparent',
      iconBg: 'bg-metric-purple-light',
      iconColor: 'text-metric-purple',
      border: 'border-metric-purple-border'
    },
    green: {
      gradient: 'from-metric-green/5 to-transparent',
      iconBg: 'bg-metric-green-light',
      iconColor: 'text-metric-green',
      border: 'border-metric-green-border'
    },
    orange: {
      gradient: 'from-metric-orange/5 to-transparent',
      iconBg: 'bg-metric-orange-light',
      iconColor: 'text-metric-orange',
      border: 'border-metric-orange-border'
    },
    primary: {
      gradient: 'from-primary-100 to-transparent',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary',
      border: 'border-primary-300'
    }
  }
  return variants[props.variant]
})

const formattedValue = computed(() => {
  if (props.loading) return '...'

  const val = props.value
  if (typeof val === 'number') {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`
    }
    return val.toString()
  }
  return val
})
</script>

<template>
  <Card
      padding="md"
      class="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
      :class="variantClasses.border"
  >
    <div
        class="absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100"
        :class="variantClasses.gradient"
    ></div>

    <div class="relative flex items-center gap-4">
      <div
          class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6"
          :class="[variantClasses.iconBg]"
      >
        <component
            :is="iconComponent"
            :size="24"
            :class="variantClasses.iconColor"
        />
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-400 mb-1">{{ label }}</p>

        <div v-if="loading" class="space-y-2">
          <div class="h-8 bg-gray-700 rounded animate-pulse w-20"></div>
        </div>

        <p v-else class="text-3xl font-bold text-white">
          {{ formattedValue }}
        </p>
      </div>

      <div
          v-if="trend && !loading"
          class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
          :class="trend.direction === 'up'
          ? 'bg-status-success-light text-status-success'
          : 'bg-status-error-light text-status-error'"
      >
        <TrendingUp v-if="trend.direction === 'up'" :size="14" />
        <TrendingDown v-else :size="14" />
        <span>{{ trend.value }}%</span>
      </div>
    </div>
  </Card>
</template>