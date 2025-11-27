<script setup>
import { computed } from 'vue';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import StatusBadge from "../../shared/StatusBadge.vue"; // ✅ Novo Import

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const opportunityTypeLabel = computed(() => {
  return OPPORTUNITY_TYPE_LABELS[props.opportunity.opportunity_type] || props.opportunity.opportunity_type;
});
</script>

<template>
  <Card
      padding="md"
      class="cursor-pointer hover:border-primary transition-all group"
      @click="emit('click', opportunity.id)"
  >
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
            {{ opportunity.contact?.name || 'Sem nome' }}
          </h3>
          <p class="text-sm text-gray-400">
            {{ formatPhone(opportunity.contact?.phone) }}
          </p>
        </div>

        <StatusBadge :status="opportunity.status" type="opportunity" size="sm" />
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
        <p class="text-sm font-medium text-primary">
          {{ formatCurrency(opportunity.converted_value) }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-gray-700">
        <div class="flex items-center text-gray-400">
          <span class="text-xs">{{ opportunity.message_count || 0 }} mensagens</span>
        </div>

        <span class="text-xs text-gray-400">
          {{ formatDate(opportunity.created_at) }}
        </span>
      </div>
    </div>
  </Card>
</template>