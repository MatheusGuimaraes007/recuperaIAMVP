<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOpportunities } from '../../composables/useOpportunities.js';
import { formatCurrency,  formatPhone } from '../../utils/formatters';
import { OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import Button from "../../shared/Button.vue";
import LoadingState from "../../shared/LoadingState.vue";
import StatusBadge from "../../shared/StatusBadge.vue";
import MessageThread from './MessageThread.vue';
import Navbar from '../../shared/Navbar.vue';
import OpportunityStatusModal from "./OpportunityStatusModal.vue";


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

const showStatusModal = ref(false);
const updating = ref(false);

onMounted(async () => {
  if (route.params.id) await fetchOpportunityById(route.params.id);
});

const handleStatusUpdate = async (newStatus) => {
  if (!currentOpportunity.value) return;
  updating.value = true;
  const result = await updateOpportunity(currentOpportunity.value.id, { status: newStatus });
  updating.value = false;
  if (result.success) showStatusModal.value = false;
};

const handleDelete = async () => {
  if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
    const result = await deleteOpportunity(currentOpportunity.value.id);
    if (result.success) router.push('/oportunidades');
  }
};
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" @click="router.push('/oportunidades')">
            ← Voltar para Oportunidades
          </Button>
          <Button variant="ghost" size="sm" @click="showStatusModal = true">
            Alterar Status
          </Button>
        </div>

        <LoadingState v-if="loading && !currentOpportunity" message="Carregando..." />

        <div v-else-if="currentOpportunity" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div class="lg:col-span-2 space-y-6">
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
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold">
                  {{ (currentOpportunity.contact?.name || 'S')[0] }}
                </div>
                <div>
                  <h4 class="text-xl font-bold text-white">{{ currentOpportunity.contact?.name }}</h4>
                  <p class="text-gray-400">{{ formatPhone(currentOpportunity.contact?.phone) }}</p>
                  <p class="text-gray-400 text-sm">{{ currentOpportunity.contact?.email }}</p>
                </div>
              </div>
            </Card>

            <MessageThread :opportunity-id="currentOpportunity.id" />
          </div>

          <div class="space-y-6">
            <Card padding="md">
              <h3 class="font-bold text-white mb-4">Ações Rápidas</h3>
              <div class="space-y-2">
                <Button variant="primary" class="w-full justify-start" @click="showStatusModal = true">
                  Alterar Status
                </Button>
                <Button variant="ghost" class="w-full justify-start text-status-error hover:bg-status-error/10" @click="handleDelete">
                  Excluir Oportunidade
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <OpportunityStatusModal
        :is-open="showStatusModal"
        :current-status="currentOpportunity?.status"
        :loading="updating"
        @close="showStatusModal = false"
        @update="handleStatusUpdate"
    />
  </div>
</template>