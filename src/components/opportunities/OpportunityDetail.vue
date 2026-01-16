<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOpportunities } from '../../composables/useOpportunities.js';
import { formatCurrency,  formatPhone, formatDate } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import Button from "../../shared/Button.vue";
import LoadingState from "../../shared/LoadingState.vue";
import StatusBadge from "../../shared/StatusBadge.vue";
import MessageThread from './MessageThread.vue';
import Navbar from '../../shared/Navbar.vue';
import { useOpportunitiesHistory } from '../../composables/useOpportunitiesHistory.js';


const route = useRoute();
const router = useRouter();

const {
  currentOpportunity,
  loading,
  error,
  fetchOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  formatLostReason
} = useOpportunities();

const {
  historyRecords,
  loading: loadingHistory,
  error: historyError,
  fetchOpportunitiesHistory
} = useOpportunitiesHistory();

// quick actions and status modal removed per request

onMounted(async () => {
  if (route.params.id) {
    await fetchOpportunityById(route.params.id);
    await fetchOpportunitiesHistory(route.params.id);
  }
});

const goBack = () => {
  // Prefer explicit client opportunities route when clientId is available
  const clientId = currentOpportunity?.client_id || currentOpportunity?.client?.id || null;
  if (clientId) {
    router.push(`/admin/oportunidades/${clientId}`);
    return;
  }

  // Fallback to browser back, then general opportunities
  const initialPath = route.fullPath;
  if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
    router.back();
    setTimeout(() => {
      if (route.fullPath === initialPath) {
        router.push('/oportunidades');
      }
    }, 250);
    return;
  }

  router.push('/oportunidades');
};

const groupedHistory = computed(() => {
  // manter apenas os campos relevantes e agrupar por data (apenas data no cabeçalho)
  const allowed = ['payment_method', 'opportunity_type', 'status'];
  const records = (historyRecords.value || [])
    .filter(r => allowed.includes(r.changed_field))
    .map(r => ({ ...r }))
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));

  const map = {};
  records.forEach((r) => {
    const dateKey = formatDate(r.changed_at); // DD/MM/YYYY
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(r);
  });
  return Object.keys(map).map((date) => ({ date, entries: map[date] }));
});

const fieldLabel = (field) => {
  const map = {
    payment_method: 'Método de pagamento',
    opportunity_type: 'Tipo de Oportunidade',
    status: 'Status'
  };
  return map[field] || field;
};

const translateStatusValue = (val) => {
  const map = {
    active: 'Ativo',
    won: 'Ganho',
    recovered: 'Recuperado',
    lost: 'Perdido'
  };
  return map[val] || val;
};

const formatTimeOnly = (date) => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return date;
  }
};

// delete and status update actions removed
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" @click="goBack">
            ← Voltar para Oportunidades
          </Button>
        </div>

        <LoadingState v-if="loading && !currentOpportunity" message="Carregando..." />

        <div v-else-if="currentOpportunity" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          <div class="space-y-6">
            <Card padding="lg" class="relative overflow-hidden">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2 class="text-4xl font-bold text-white mb-2">
                    {{ formatCurrency(currentOpportunity.value) }}
                  </h2>
                  <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">
                      {{ OPPORTUNITY_TYPE_LABELS[currentOpportunity.opportunity_type] }}
                    </span>
                  </div>
                </div>
                <StatusBadge :status="currentOpportunity.status" type="opportunity" size="lg" />
              </div>
            </Card>

            <Card padding="lg">
              <h3 class="text-lg font-bold text-white mb-4">Informações do Lead</h3>
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold">
                  {{ (currentOpportunity.contact?.name || 'S')[0] }}
                </div>
                <div>
                  <h4 class="text-xl font-bold text-white">{{ currentOpportunity.contact?.name }}</h4>
                  <p class="text-gray-400">{{ formatPhone(currentOpportunity.contact?.phone) }}</p>
                  <p class="text-gray-400 text-sm">{{ currentOpportunity.contact?.email }}</p>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 class="text-lg font-bold text-white mb-4">Histórico de Alterações</h3>
              <div v-if="loadingHistory" class="text-gray-400">Carregando histórico...</div>
              <div v-else-if="historyError" class="text-status-error">{{ historyError }}</div>
              <div v-else-if="!historyRecords.length" class="text-gray-400">Nenhuma alteração encontrada.</div>
              <div v-else class="space-y-4">
                <div v-for="group in groupedHistory" :key="group.date">
                  <h4 class="text-sm font-semibold text-gray-300 mb-2">{{ group.date }}</h4>
                  <ul class="space-y-2">
                    <li v-for="entry in group.entries" :key="entry.id" class="p-3 bg-gray-900/30 rounded flex items-center justify-between">
                      <div class="text-xs text-gray-400 w-20">{{ formatTimeOnly(entry.changed_at) }}</div>
                      <div class="ml-4 w-full">
                        <div class="text-sm text-gray-200 font-medium">{{ fieldLabel(entry.changed_field) }}: <span class="text-gray-400">
                          <template v-if="entry.changed_field === 'status'">
                            {{ translateStatusValue(entry.old_value) || '-' }} → {{ translateStatusValue(entry.new_value) || '-' }}
                          </template>
                          <template v-else-if="entry.changed_field === 'opportunity_type'">
                            {{ OPPORTUNITY_TYPE_LABELS[entry.old_value] || entry.old_value || '-' }} → {{ OPPORTUNITY_TYPE_LABELS[entry.new_value] || entry.new_value || '-' }}
                          </template>
                          <template v-else>
                            {{ entry.old_value || '-' }} → {{ entry.new_value || '-' }}
                          </template>
                        </span></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <!-- Chat sidebar (50% width) -->
          <div class="space-y-6">
            <Card padding="lg" class="sticky top-24 lg:h-[70vh]">
              <h3 class="text-lg font-bold text-white mb-4">Chat</h3>
              <div class="h-[60vh] overflow-auto">
                <MessageThread :opportunity-id="currentOpportunity.id" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- OpportunityStatusModal removed -->
  </div>
</template>