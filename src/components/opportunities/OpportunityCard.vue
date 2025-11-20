<script setup>
import { computed } from 'vue';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS, STATUS_OPTIONS, STATUS_COLORS } from '../../utils/constants';
import Card from "../../shared/Card.vue";

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'update-status']);

const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

const getStatusLabel = (status) => {
  const option = STATUS_OPTIONS.find(s => s.value === status);
  return option?.label || status;
};

const opportunityTypeLabel = computed(() => {
  return OPPORTUNITY_TYPE_LABELS[props.opportunity.opportunity_type] || props.opportunity.opportunity_type;
});

const handleCardClick = () => {
  emit('click', props.opportunity.id);
};
</script>

<template>
  <Card 
    padding="md" 
    class="cursor-pointer hover:border-[#7cba10] transition-all"
    @click="handleCardClick"
  >
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-white mb-1">
            {{ opportunity.contact?.name || 'Sem nome' }}
          </h3>
          <p class="text-sm text-gray-400">
            {{ formatPhone(opportunity.contact?.phone) }}
          </p>
        </div>
        
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap"
          :class="getStatusColor(opportunity.status)"
        >
          {{ getStatusLabel(opportunity.status) }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400 mb-1">Tipo</p>
          <p class="text-sm font-medium text-white">{{ opportunityTypeLabel }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">Valor</p>
          <p class="text-sm font-medium text-white">{{ formatCurrency(opportunity.value) }}</p>
        </div>
      </div>

      <div v-if="opportunity.converted_value && opportunity.status === 'won'" 
           class="pt-3 border-t border-gray-700">
        <p class="text-xs text-gray-400 mb-1">Valor Convertido</p>
        <p class="text-sm font-medium" style="color: var(--color-text1)">
          {{ formatCurrency(opportunity.converted_value) }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-gray-700">
        <div class="flex items-center text-gray-400">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="text-xs">{{ opportunity.message_count || 0 }} mensagens</span>
        </div>
        
        <span class="text-xs text-gray-400">
          {{ formatDate(opportunity.created_at) }}
        </span>
      </div>
    </div>
  </Card>
</template>