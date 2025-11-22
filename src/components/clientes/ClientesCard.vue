<script setup>
import { formatDate, formatPhone } from '../../utils/formatters';
import Card from '../../shared/Card.vue';

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const getStatusColor = (status) => {
  const colors = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    engaged: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    qualified: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    converted: 'bg-green-500/10 text-green-400 border-green-500/20',
    lost: 'bg-red-500/10 text-red-400 border-red-500/20',
    blocked: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };
  return colors[status] || colors.new;
};

const getStatusLabel = (status) => {
  const labels = {
    new: 'Novo',
    engaged: 'Engajado',
    qualified: 'Qualificado',
    converted: 'Convertido',
    lost: 'Perdido',
    blocked: 'Bloqueado'
  };
  return labels[status] || status;
};

const getStatusIcon = (status) => {
  const icons = {
    new: '🆕',
    engaged: '💬',
    qualified: '⭐',
    converted: '✅',
    lost: '❌',
    blocked: '🚫'
  };
  return icons[status] || '📋';
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const handleCardClick = () => {
  emit('click', props.contact);
};
</script>

<template>
  <Card 
    padding="md" 
    class="cursor-pointer hover:border-[#7cba10] transition-all group"
    @click="handleCardClick"
  >
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#7cba10] to-[#5a8c0d] flex items-center justify-center text-white text-base font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
            {{ getInitials(contact.name) }}
          </div>
          
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-white mb-1 truncate">
              {{ contact.name || 'Sem nome' }}
            </h3>
            <p class="text-sm text-gray-400 truncate">
              {{ formatPhone(contact.phone) }}
            </p>
          </div>
        </div>
        
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex items-center gap-1.5"
          :class="getStatusColor(contact.status)"
        >
          <span>{{ getStatusIcon(contact.status) }}</span>
          <span>{{ getStatusLabel(contact.status) }}</span>
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">Email</p>
          <p class="text-sm font-medium text-white truncate">
            {{ contact.email || 'Não informado' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">Agente</p>
          <p class="text-sm font-medium text-white truncate">
            {{ contact.agent?.name || '-' }}
          </p>
        </div>
      </div>

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

      <div class="flex items-center justify-between pt-3 border-t border-gray-700">
        <div class="flex items-center text-gray-400">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs">{{ formatDate(contact.created_at) }}</span>
        </div>
        
        <div class="flex items-center text-[#7cba10] opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-xs font-medium">Ver detalhes</span>
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </Card>
</template>