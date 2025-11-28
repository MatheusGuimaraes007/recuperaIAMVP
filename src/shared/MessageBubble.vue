<script setup>
import { computed } from 'vue'
import { Check, CheckCheck, XCircle, Clock } from 'lucide-vue-next'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  isOutgoing: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: [String, Date],
    required: true
  },
  status: {
    type: String,
    default: null,
    validator: (value) => !value || ['sent', 'delivered', 'read', 'failed', 'pending'].includes(value)
  },
  metadata: {
    type: Object,
    default: () => ({})
  }
})

const bubbleClasses = computed(() => {
  return props.isOutgoing
      ? 'bg-primary text-background-base rounded-br-none ml-auto'
      : 'bg-background-elevated text-gray-100 rounded-bl-none'
})

const statusIcon = computed(() => {
  if (!props.isOutgoing || !props.status) return null

  const icons = {
    sent: Check,
    delivered: CheckCheck,
    read: CheckCheck,
    failed: XCircle,
    pending: Clock
  }

  return icons[props.status]
})

const statusIconColor = computed(() => {
  const colors = {
    sent: 'text-gray-400',
    delivered: 'text-gray-400',
    read: 'text-status-success',
    failed: 'text-status-error',
    pending: 'text-status-warning'
  }

  return colors[props.status] || 'text-gray-400'
})

const formattedTimestamp = computed(() => {
  const date = new Date(props.timestamp)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (isToday) {
    return time
  } else if (isYesterday) {
    return `Ontem ${time}`
  } else {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}/${month} ${time}`
  }
})

const formattedContent = computed(() => {
  return props.content
      // Quebras de linha
      .replace(/\n/g, '<br>')
      // Links clicáveis
      .replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary-light">$1</a>'
      )
})
</script>

<template>
  <div
      class="flex mb-3 gap-2 animate-fade-in"
      :class="isOutgoing ? 'justify-end' : 'justify-start'"
  >
    <!-- Avatar (incoming apenas) -->
    <UserAvatar
        v-if="!isOutgoing && metadata.senderName"
        :name="metadata.senderName"
        :url="metadata.senderAvatar"
        size="sm"
        class="flex-shrink-0"
    />

    <!-- Bolha -->
    <div
        class="max-w-[70%] rounded-2xl px-4 py-2 shadow-lg transition-all hover:shadow-xl"
        :class="bubbleClasses"
    >
      <!-- Nome do remetente (incoming apenas) -->
      <p
          v-if="!isOutgoing && metadata.senderName"
          class="text-xs font-semibold mb-1 opacity-70"
      >
        {{ metadata.senderName }}
      </p>

      <!-- Conteúdo -->
      <div
          class="text-sm whitespace-pre-wrap break-words leading-relaxed"
          v-html="formattedContent"
      />

      <!-- Footer: Timestamp + Status -->
      <div class="flex items-center justify-end gap-1 mt-1">
        <span
            class="text-xs font-medium"
            :class="isOutgoing ? 'text-background-base/70' : 'text-gray-400'"
        >
          {{ formattedTimestamp }}
        </span>

        <component
            v-if="statusIcon"
            :is="statusIcon"
            :size="14"
            :class="[statusIconColor, { 'animate-spin': status === 'pending' }]"
        />
      </div>
    </div>
  </div>
</template>