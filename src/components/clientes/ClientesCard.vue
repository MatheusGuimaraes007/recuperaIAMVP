<script setup>
import { Clock, ChevronRight } from 'lucide-vue-next'
import Card from '../../shared/Card.vue'
import StatusBadge from '../../shared/StatusBadge.vue'
import UserAvatar from '../../shared/UserAvatar.vue'
import { formatDate, formatPhone } from '../../utils/formatters'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleCardClick = () => {
  emit('click', props.contact)
}
</script>

<template>
  <Card
      padding="md"
      class="cursor-pointer hover:border-primary transition-all group"
      @click="handleCardClick"
  >
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <UserAvatar
              :name="contact.name || 'Sem nome'"
              :url="contact.avatar"
              size="lg"
              class="group-hover:scale-110 transition-transform"
          />

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-white mb-1 truncate">
              {{ contact.name || 'Sem nome' }}
            </h3>
            <p class="text-sm text-gray-400 truncate">
              {{ formatPhone(contact.phone) }}
            </p>
          </div>
        </div>

        <StatusBadge
            :status="contact.status"
            type="client"
            size="md"
        />
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">Email</p>
          <p class="text-sm font-medium text-white truncate">
            {{ contact.email || 'Não informado' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">Agente</p>
          <div v-if="contact.agent?.name" class="flex items-center gap-2">
            <UserAvatar
                :name="contact.agent.name"
                size="sm"
            />
            <span class="text-sm font-medium text-white truncate">
              {{ contact.agent.name }}
            </span>
          </div>
          <span v-else class="text-sm font-medium text-white">-</span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="contact.tags && contact.tags.length" class="flex flex-wrap gap-2">
        <span
            v-for="tag in contact.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 text-xs rounded-md bg-gray-800/50 border border-gray-700 text-gray-300"
        >
          {{ tag }}
        </span>
        <span v-if="contact.tags.length > 3" class="px-2 py-1 text-xs text-gray-400">
          +{{ contact.tags.length - 3 }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-700">
        <div class="flex items-center text-gray-400">
          <Clock :size="16" class="mr-1" />
          <span class="text-xs">{{ formatDate(contact.created_at) }}</span>
        </div>

        <div class="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-xs font-medium">Ver detalhes</span>
          <ChevronRight :size="16" class="ml-1" />
        </div>
      </div>
    </div>
  </Card>
</template>