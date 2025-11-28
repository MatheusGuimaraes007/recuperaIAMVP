<script setup>
import { useRouter } from 'vue-router';
import { formatDate, formatPhone } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';
import Button from "../../shared/Button.vue";
import StatusBadge from "../../shared/StatusBadge.vue"; // ✅ Novo Import

const props = defineProps({
  opportunities: {
    type: Array,
    required: true
  }
});

const router = useRouter();
</script>

<template>
  <div class="rounded-xl border border-border overflow-hidden bg-background-card">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-800/50 border-b border-gray-700">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Nome do Lead</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Contato</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Produto</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Método</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Status</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Msgs</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Data</th>
          <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-primary">Ação</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="opportunity in opportunities"
            :key="opportunity.id"
            class="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">

          <td class="px-6 py-4 text-sm font-medium text-white">
            {{ opportunity.contact?.name || 'Sem nome' }}
          </td>

          <td class="px-6 py-4">
            <div class="text-xs text-gray-400">
              <div class="mb-1">{{ opportunity.contact?.email || 'Sem email' }}</div>
              <div class="flex items-center gap-1">
                {{ formatPhone(opportunity.contact?.phone) }}
              </div>
            </div>
          </td>

          <td class="px-6 py-4 text-sm text-white">
            {{ opportunity.product?.name || 'Sem produto' }}
          </td>

          <td class="px-6 py-4 text-sm text-white">
            {{ OPPORTUNITY_TYPE_LABELS[opportunity.opportunity_type] || opportunity.opportunity_type }}
          </td>

          <td class="px-6 py-4">
            <StatusBadge :status="opportunity.status" type="opportunity" size="sm" />
          </td>

          <td class="px-6 py-4 text-sm text-white font-medium">
            {{ opportunity.message_count || 0 }}
          </td>

          <td class="px-6 py-4 text-sm text-gray-400">
            {{ formatDate(opportunity.created_at) }}
          </td>

          <td class="px-6 py-4 text-center">
            <Button
                variant="ghost"
                size="sm"
                @click="router.push(`/oportunidades/${opportunity.id}`)"
                class="text-xs text-primary border-primary hover:bg-primary/10"
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