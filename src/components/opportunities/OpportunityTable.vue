<script setup>
import { useRouter } from 'vue-router';
import { formatDate, formatPhone } from '../../utils/formatters';
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
        <thead style="background-color: rgba(0, 0, 0, 0.3);">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Nome do Lead
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Contato
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Produto
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Método
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Status
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Msgs
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Tempo
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Resumo da Conversa
          </th>
          <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider" 
              style="color: var(--color-text1)">
            Ação
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="opportunity in opportunities"
            :key="opportunity.id"
            class="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">

          <!-- Nome do Lead -->
          <td class="px-6 py-4">
            <div class="text-sm font-medium text-white">
              {{ opportunity.contact?.name || 'Sem nome' }}
            </div>
          </td>

          <!-- Contato -->
          <td class="px-6 py-4">
            <div>
              <div class="text-xs text-gray-400">
                {{ opportunity.contact?.email || 'Sem email' }}
              </div>
              <div class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                {{ formatPhone(opportunity.contact?.phone) }}
              </div>
            </div>
          </td>

          <!-- Produto -->
          <td class="px-6 py-4">
            <span class="text-sm text-white">
              {{ opportunity.product?.name || 'Sem produto' }}
            </span>
          </td>

          <!-- Método -->
          <td class="px-6 py-4">
            <span class="text-sm text-white">
              {{ OPPORTUNITY_TYPE_LABELS[opportunity.opportunity_type] || opportunity.opportunity_type }}
            </span>
          </td>

          <!-- Status -->
          <td class="px-6 py-4">
            <span class="px-3 py-1 rounded text-xs font-medium"
                  :class="getStatusColor(opportunity.status)">
              {{ getStatusLabel(opportunity.status) }}
            </span>
          </td>

          <!-- Msgs -->
          <td class="px-6 py-4">
            <span class="text-sm text-white font-medium">
              {{ opportunity.message_count || 0 }}
            </span>
          </td>

          <!-- Tempo -->
          <td class="px-6 py-4">
            <div class="text-sm text-gray-400">
              {{ formatDate(opportunity.created_at) }}
            </div>
          </td>

          <!-- Resumo da Conversa -->
          <td class="px-6 py-4 max-w-md">
            <p class="text-xs text-gray-300 line-clamp-2">
              {{ opportunity.conversation_summary || 'Aguardando resumo da conversa...' }}
            </p>
          </td>

          <!-- Ação -->
          <td class="px-6 py-4 text-center">
            <Button
                variant="ghost"
                size="sm"
                @click="router.push(`/oportunidades/${opportunity.id}`)"
                class="text-xs"
                style="color: var(--color-text1); border-color: var(--color-text1)"
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>