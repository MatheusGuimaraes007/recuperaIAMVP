<script setup>
import { formatDate, formatCurrency, formatPhone } from '../../utils/formatters';
import Button from "../../shared/Button.vue";
import StatusBadge from "../../shared/StatusBadge.vue";
import UserAvatar from "../../shared/UserAvatar.vue";

const props = defineProps({
  clients: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['client-click']);

const handleClientClick = (client) => {
  emit('client-click', client);
};

const getStatusType = (status) => {
  const statusMap = {
    'active': 'success',
    'trial': 'warning',
    'suspended': 'error',
    'canceled': 'neutral'
  };
  return statusMap[status] || 'neutral';
};
</script>

<template>
  <div class="rounded-xl border border-border overflow-hidden bg-background-card">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-800/50 border-b border-gray-700">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Cliente</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Contato</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Status</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Métricas</th>
          <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary">Data Cadastro</th>
          <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-primary">Ação</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="client in clients"
            :key="client.id"
            @click="handleClientClick(client)"
            class="border-b border-gray-700 hover:bg-gray-800/30 transition-colors cursor-pointer group">

          <!-- Cliente -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <UserAvatar
                  :name="client.name || 'Sem nome'"
                  size="sm"
              />
              <div>
                <div class="text-sm font-medium text-white group-hover:text-primary transition-colors">
                  {{ client.name || 'Sem nome' }}
                </div>
                <div class="text-xs text-gray-500">
                  ID: {{ client.id.toString().slice(0, 8) }}
                </div>
              </div>
            </div>
          </td>

          <!-- Contato -->
          <td class="px-6 py-4">
            <div class="text-xs text-gray-400">
              <div class="mb-1 text-white/90">{{ client.email || '-' }}</div>
              <div v-if="client.phone" class="flex items-center gap-1">
                {{ formatPhone(client.phone) }}
              </div>
            </div>
          </td>

          <!-- Status -->
          <td class="px-6 py-4">
            <StatusBadge
                :status="getStatusType(client.status)"
                :label="client.status === 'active' ? 'Ativo' :
                        client.status === 'trial' ? 'Trial' :
                        client.status === 'suspended' ? 'Suspenso' : 'Cancelado'"
                size="sm"
            />
          </td>

          <!-- Métricas -->
          <td class="px-6 py-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-xs">
                <span class="text-gray-400">Oportunidades:</span>
                <span class="font-semibold text-white">{{ client.metrics?.totalOpportunities || 0 }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-gray-400">Recuperado:</span>
                <span class="font-semibold text-metric-green">{{ formatCurrency(client.metrics?.totalRecovered || 0) }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-gray-400">Conversão:</span>
                <span class="font-semibold text-metric-purple">{{ client.metrics?.conversionRate || 0 }}%</span>
              </div>
            </div>
          </td>

          <!-- Data Cadastro -->
          <td class="px-6 py-4 text-sm text-gray-400">
            {{ formatDate(client.created_at) }}
          </td>

          <!-- Ação -->
          <td class="px-6 py-4 text-center">
            <Button
                variant="ghost"
                size="sm"
                @click.stop="handleClientClick(client)"
                class="text-xs text-primary border-primary hover:bg-primary/10"
            >
              Ver detalhes
            </Button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="$slots.pagination" class="border-t border-gray-700 bg-gray-800/20 p-4">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>