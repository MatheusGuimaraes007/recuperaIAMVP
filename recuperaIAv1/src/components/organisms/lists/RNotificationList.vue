<script setup>
import RIcon from '@/components/atoms/icons/RIcon.vue'
import RText from '@/components/atoms/typography/RText.vue'
import { formatDate } from '@/utils/formatters'

defineProps({
  notifications: { type: Array, default: () => [] },
  compact: Boolean
})

defineEmits(['click-item'])

const getIcon = (type) => {
  const map = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'alert-circle',
    message: 'message-square'
  }
  return map[type] || 'bell'
}

const getColor = (type) => {
  const map = {
    info: 'text-blue-500 bg-blue-50',
    success: 'text-green-500 bg-green-50',
    warning: 'text-orange-500 bg-orange-50',
    error: 'text-red-500 bg-red-50',
    message: 'text-purple-500 bg-purple-50'
  }
  return map[type] || 'text-gray-500 bg-gray-50'
}
</script>

<template>
  <ul class="divide-y divide-border-light">
    <li
        v-for="item in notifications"
        :key="item.id"
        class="hover:bg-bg-tertiary transition-colors cursor-pointer"
        :class="{ 'bg-primary-50/30': !item.read }"
        @click="$emit('click-item', item)"
    >
      <div class="flex gap-3 p-4">
        <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            :class="getColor(item.type)"
        >
          <RIcon :name="getIcon(item.type)" size="16" />
        </div>
        <div class="flex-1 min-w-0">
          <RText size="sm" class="mb-0.5" :class="{ 'font-semibold': !item.read }">
            {{ item.title }}
          </RText>
          <RText size="xs" color="secondary" truncate class="mb-1">
            {{ item.message }}
          </RText>
          <RText size="xs" color="tertiary">
            {{ formatDate(item.date, 'relative') }}
          </RText>
        </div>
        <div v-if="!item.read" class="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
      </div>
    </li>

    <li v-if="notifications.length === 0" class="p-8 text-center">
      <RText color="tertiary" size="sm">Nenhuma notificação</RText>
    </li>
  </ul>
</template>