<script setup>
import { useRouter } from 'vue-router';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS, STATUS_OPTIONS, STATUS_COLORS } from '../../utils/constants';
import Button from "../../shared/Button.vue";

const props = defineProps({
  opportunities: {
    type: Array,
    required: true
  }
});

const router = useRouter();

const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

const getStatusLabel = (status) => {
  const option = STATUS_OPTIONS.find(s => s.value === status);
  return option?.label || status;
};
</script>

<template>
  <div class="rounded-xl border overflow-hidden"
       style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="border-b border-gray-700">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Contato
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tipo
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Valor
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Status
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Mensagens
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Data
          </th>
          <th class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Ações
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
        <tr v-for="opportunity in opportunities"
            :key="opportunity.id"
            class="hover:bg-gray-800/30 transition-colors">

          <td class="px-6 py-4">
            <div>
              <div class="text-sm font-medium text-white">
                {{ opportunity.contact?.name || 'Sem nome' }}
              </div>
              <div class="text-xs text-gray-400">
                {{ formatPhone(opportunity.contact?.phone) }}
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
              <span class="text-sm text-gray-300">
                {{ OPPORTUNITY_TYPE_LABELS[opportunity.opportunity_type] || opportunity.opportunity_type }}
              </span>
          </td>

          <td class="px-6 py-4">
            <div>
              <div class="text-sm font-medium text-white">
                {{ formatCurrency(opportunity.value) }}
              </div>
              <div v-if="opportunity.converted_value" class="text-xs" style="color: var(--color-text1)">
                Convertido: {{ formatCurrency(opportunity.converted_value) }}
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-xs font-medium border"
                    :class="getStatusColor(opportunity.status)">
                {{ getStatusLabel(opportunity.status) }}
              </span>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-center text-gray-400">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-sm">{{ opportunity.message_count || 0 }}</span>
            </div>
          </td>

          <td class="px-6 py-4">
            <div class="text-sm text-gray-400">
              {{ formatDate(opportunity.created_at) }}
            </div>
          </td>

          <td class="px-6 py-4 text-right">
            <Button
                variant="ghost"
                size="sm"
                @click="router.push(`/oportunidades/${opportunity.id}`)"
            >
              Ver detalhes
            </Button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <slot name="pagination"></slot>
  </div>
</template>