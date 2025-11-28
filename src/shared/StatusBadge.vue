<script setup>
import { computed } from 'vue'
import {
  CheckCircle,
  XCircle,
  PauseCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Loader,
  Clock,
  TrendingUp,
  Target,
  DollarSign,
  MessageCircle // ✅ Novo Import
} from 'lucide-vue-next'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['client', 'opportunity', 'whatsapp', 'agent', 'default'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const STATUS_CONFIGS = {
  client: {
    active: {
      label: 'Ativo',
      icon: CheckCircle,
      textClass: 'text-status-success',
      bgClass: 'bg-status-success-light',
      borderClass: 'border-status-success-border'
    },
    suspended: {
      label: 'Suspenso',
      icon: PauseCircle,
      textClass: 'text-status-warning',
      bgClass: 'bg-status-warning-light',
      borderClass: 'border-status-warning-border'
    },
    inactive: {
      label: 'Inativo',
      icon: XCircle,
      textClass: 'text-gray-400',
      bgClass: 'bg-gray-500/10',
      borderClass: 'border-gray-500/30'
    },
    blocked: {
      label: 'Bloqueado',
      icon: AlertCircle,
      textClass: 'text-status-error',
      bgClass: 'bg-status-error-light',
      borderClass: 'border-status-error-border'
    },
    // ✅ CORREÇÃO: Adicionado status 'engaged'
    engaged: {
      label: 'Engajado',
      icon: MessageCircle,
      textClass: 'text-metric-purple',
      bgClass: 'bg-metric-purple-light',
      borderClass: 'border-metric-purple-border'
    }
  },

  opportunity: {
    new: {
      label: 'Nova',
      icon: AlertCircle,
      textClass: 'text-metric-blue',
      bgClass: 'bg-metric-blue-light',
      borderClass: 'border-metric-blue-border'
    },
    in_progress: {
      label: 'Em Andamento',
      icon: Clock,
      textClass: 'text-metric-orange',
      bgClass: 'bg-metric-orange-light',
      borderClass: 'border-metric-orange-border'
    },
    won: {
      label: 'Ganha',
      icon: TrendingUp,
      textClass: 'text-status-success',
      bgClass: 'bg-status-success-light',
      borderClass: 'border-status-success-border'
    },
    lost: {
      label: 'Perdida',
      icon: XCircle,
      textClass: 'text-status-error',
      bgClass: 'bg-status-error-light',
      borderClass: 'border-status-error-border'
    },
    qualified: {
      label: 'Qualificada',
      icon: Target,
      textClass: 'text-metric-purple',
      bgClass: 'bg-metric-purple-light',
      borderClass: 'border-metric-purple-border'
    },
    converted: {
      label: 'Convertida',
      icon: DollarSign,
      textClass: 'text-status-success',
      bgClass: 'bg-status-success-light',
      borderClass: 'border-status-success-border'
    }
  },

  whatsapp: {
    connected: {
      label: 'Conectado',
      icon: Wifi,
      textClass: 'text-status-success',
      bgClass: 'bg-status-success-light',
      borderClass: 'border-status-success-border'
    },
    disconnected: {
      label: 'Desconectado',
      icon: WifiOff,
      textClass: 'text-status-error',
      bgClass: 'bg-status-error-light',
      borderClass: 'border-status-error-border'
    },
    connecting: {
      label: 'Conectando...',
      icon: Loader,
      textClass: 'text-status-warning',
      bgClass: 'bg-status-warning-light',
      borderClass: 'border-status-warning-border'
    }
  },

  agent: {
    active: {
      label: 'Ativo',
      icon: CheckCircle,
      textClass: 'text-status-success',
      bgClass: 'bg-status-success-light',
      borderClass: 'border-status-success-border'
    },
    inactive: {
      label: 'Inativo',
      icon: PauseCircle,
      textClass: 'text-gray-400',
      bgClass: 'bg-gray-500/10',
      borderClass: 'border-gray-500/30'
    },
    training: {
      label: 'Em Treinamento',
      icon: Loader,
      textClass: 'text-metric-blue',
      bgClass: 'bg-metric-blue-light',
      borderClass: 'border-metric-blue-border'
    }
  },

  default: {
    success: {
      label: 'Sucesso',
      icon: CheckCircle,
      textClass: 'text-status-success',
      bgClass: 'bg-status-success-light',
      borderClass: 'border-status-success-border'
    },
    error: {
      label: 'Erro',
      icon: XCircle,
      textClass: 'text-status-error',
      bgClass: 'bg-status-error-light',
      borderClass: 'border-status-error-border'
    },
    warning: {
      label: 'Aviso',
      icon: AlertCircle,
      textClass: 'text-status-warning',
      bgClass: 'bg-status-warning-light',
      borderClass: 'border-status-warning-border'
    },
    info: {
      label: 'Informação',
      icon: AlertCircle,
      textClass: 'text-status-info',
      bgClass: 'bg-status-info-light',
      borderClass: 'border-status-info-border'
    }
  }
}

const config = computed(() => {
  const typeConfig = STATUS_CONFIGS[props.type]
  if (!typeConfig) return STATUS_CONFIGS.default.info

  const statusConfig = typeConfig[props.status]
  return statusConfig || STATUS_CONFIGS.default.info
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: { container: 'px-2 py-0.5 text-xs gap-1', icon: 12 },
    md: { container: 'px-3 py-1 text-sm gap-1.5', icon: 14 },
    lg: { container: 'px-4 py-1.5 text-base gap-2', icon: 16 }
  }
  return sizes[props.size] || sizes.md
})

const isAnimated = computed(() => {
  return props.status === 'connecting' || props.status === 'training'
})
</script>

<template>
  <span
      class="badge-base inline-flex items-center font-medium transition-all duration-200"
      :class="[
      config.textClass,
      config.bgClass,
      config.borderClass,
      sizeClasses.container
    ]"
  >
    <component
        :is="config.icon"
        :size="sizeClasses.icon"
        :class="{ 'animate-spin': isAnimated }"
    />
    <span>{{ config.label }}</span>
  </span>
</template>