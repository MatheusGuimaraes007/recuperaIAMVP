<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOpportunities } from '../../composables/useOpportunities.js';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import { STATUS_OPTIONS, STATUS_COLORS, OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import Button from "../../shared/Button.vue";
import LoadingState from "../../shared/LoadingState.vue";
import MessageThread from './MessageThread.vue';

const route = useRoute();
const router = useRouter();

const {
  currentOpportunity,
  loading,
  error,
  fetchOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  formatOpportunityStatus,
  formatLostReason
} = useOpportunities();

const showStatusModal = ref(false);
const selectedStatus = ref('');
const updating = ref(false);

onMounted(async () => {
  const opportunityId = route.params.id;
  if (opportunityId) {
    await fetchOpportunityById(opportunityId);
    if (currentOpportunity.value) {
      selectedStatus.value = currentOpportunity.value.status;
    }
  }
});

const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

const getStatusLabel = (status) => {
  const option = STATUS_OPTIONS.find(s => s.value === status);
  return option?.label || status;
};

const opportunityTypeLabel = computed(() => {
  if (!currentOpportunity.value) return '';
  return OPPORTUNITY_TYPE_LABELS[currentOpportunity.value.opportunity_type] || currentOpportunity.value.opportunity_type;
});

const handleStatusUpdate = async () => {
  if (!currentOpportunity.value || selectedStatus.value === currentOpportunity.value.status) {
    showStatusModal.value = false;
    return;
  }

  updating.value = true;
  const result = await updateOpportunity(currentOpportunity.value.id, {
    status: selectedStatus.value
  });

  updating.value = false;
  if (result.success) {
    showStatusModal.value = false;
  }
};

const handleDelete = async () => {
  if (!currentOpportunity.value) return;
  
  if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
    const result = await deleteOpportunity(currentOpportunity.value.id);
    if (result.success) {
      router.push('/oportunidades');
    }
  }
};

const handleBack = () => {
  router.push('/oportunidades');
};

const getStatusDescription = (status) => {
  const descriptions = {
    'new': 'Oportunidade recém-criada, aguardando primeiro contato',
    'contacted': 'Contato inicial realizado com sucesso',
    'qualified': 'Lead qualificado e com potencial de conversão',
    'proposal': 'Proposta comercial enviada ao cliente',
    'negotiation': 'Em processo de negociação de termos',
    'won': 'Oportunidade convertida em venda',
    'lost': 'Oportunidade perdida ou descartada'
  };
  return descriptions[status] || '';
};
</script>

<template>
  <div class="min-h-screen p-4 md:p-6" style="background-color: var(--color-background3)">
    <div class="max-w-7xl mx-auto">

      <!-- Header com breadcrumb e botão voltar -->
      <div class="mb-6">
        <Button variant="ghost" size="sm" @click="handleBack" class="mb-4 group">
          <svg class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Oportunidades
        </Button>
        
        <div class="flex items-center justify-between flex-wrap gap-4">
          <h1 class="text-2xl md:text-3xl font-bold text-white">Detalhes da Oportunidade</h1>
          
          <!-- Quick Actions - Desktop -->
          <div class="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" @click="showStatusModal = true" class="group">
              <svg class="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Alterar Status
            </Button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <Card v-if="error" padding="md" class="mb-6">
        <div class="flex items-start gap-3 p-4 rounded-lg border"
             style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" style="color: var(--color-text2)" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-medium" style="color: var(--color-text2)">Erro ao carregar</p>
            <p class="text-sm mt-1" style="color: var(--color-text2); opacity: 0.8">{{ error }}</p>
          </div>
        </div>
      </Card>

      <!-- Loading State -->
      <LoadingState v-if="loading && !currentOpportunity" message="Carregando detalhes..." />

      <!-- Main Content -->
      <div v-else-if="currentOpportunity" class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">

          <!-- Card de Valor e Status (Destaque) -->
          <Card padding="lg" class="relative overflow-hidden">
            <!-- Decorative gradient -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-[#7cba10]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div class="relative">
              <div class="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-[#7cba10] animate-pulse"></div>
                    <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">Oportunidade Ativa</span>
                  </div>
                  <h2 class="text-3xl md:text-4xl font-bold text-white mb-1">
                    {{ formatCurrency(currentOpportunity.value) }}
                  </h2>
                  <p v-if="currentOpportunity.converted_value" class="text-base text-[#7cba10] font-medium">
                    Convertido: {{ formatCurrency(currentOpportunity.converted_value) }}
                  </p>
                </div>
                
                <div class="text-right">
                  <span 
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105"
                    :class="getStatusColor(currentOpportunity.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ getStatusLabel(currentOpportunity.status) }}
                  </span>
                </div>
              </div>

              <!-- Tipo de Oportunidade -->
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="text-sm text-gray-300">{{ opportunityTypeLabel }}</span>
              </div>
            </div>
          </Card>

          <!-- Card de Informações do Contato -->
          <Card padding="lg">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 class="text-lg font-semibold text-white">Informações do Contato</h3>
            </div>

            <div class="flex items-start gap-4 mb-6">
              <!-- Avatar -->
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#7cba10] to-[#5a8c0d] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {{ (currentOpportunity.contact?.name || 'S')[0].toUpperCase() }}
              </div>
              
              <div class="flex-1 min-w-0">
                <h2 class="text-xl font-bold text-white mb-1 truncate">
                  {{ currentOpportunity.contact?.name || 'Sem nome' }}
                </h2>
                
                <!-- Contact Info -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-gray-400">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="text-sm">{{ formatPhone(currentOpportunity.contact?.phone) }}</span>
                  </div>
                  
                  <div v-if="currentOpportunity.contact?.email" class="flex items-center gap-2 text-gray-400">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm truncate">{{ currentOpportunity.contact?.email }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalhes em Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div class="space-y-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Data de Criação</p>
                <p class="text-base text-white font-medium">{{ formatDate(currentOpportunity.created_at) }}</p>
              </div>

              <div v-if="currentOpportunity.agent" class="space-y-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Agente Responsável</p>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-[#7cba10]/20 flex items-center justify-center text-[#7cba10] text-xs font-bold">
                    {{ currentOpportunity.agent.name[0].toUpperCase() }}
                  </div>
                  <p class="text-base text-white font-medium">{{ currentOpportunity.agent.name }}</p>
                </div>
              </div>

              <div v-if="currentOpportunity.product" class="space-y-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Produto</p>
                <p class="text-base text-white font-medium">{{ currentOpportunity.product.name }}</p>
              </div>

              <div v-if="currentOpportunity.contact" class="space-y-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Status do Contato</p>
                <p class="text-base text-white font-medium capitalize">{{ currentOpportunity.contact.status }}</p>
              </div>

              <div v-if="currentOpportunity.lost_reason" class="col-span-1 sm:col-span-2 space-y-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Motivo da Perda</p>
                <div class="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-base text-red-300">{{ formatLostReason(currentOpportunity.lost_reason) }}</p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Message Thread -->
          <MessageThread :opportunity-id="currentOpportunity.id" />
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-4 md:space-y-6">

          <!-- Card de Ações -->
          <Card padding="md" class="sticky top-6">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 class="text-lg font-semibold text-white">Ações Rápidas</h3>
            </div>
            
            <div class="space-y-2">
              <Button variant="primary" class="w-full justify-start group" @click="showStatusModal = true">
                <svg class="w-5 h-5 mr-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Alterar Status
              </Button>
              
              <Button variant="secondary" class="w-full justify-start group" disabled>
                <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div class="flex-1 text-left">
                  <div>Enviar Mensagem</div>
                  <div class="text-xs opacity-60">Em breve</div>
                </div>
              </Button>
              
              <div class="pt-2 border-t border-gray-700">
                <Button variant="ghost" class="w-full justify-start text-red-400 hover:bg-red-500/10 group" @click="handleDelete">
                  <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir Oportunidade
                </Button>
              </div>
            </div>
          </Card>

          <!-- Card de Integração -->
          <Card v-if="currentOpportunity.integration" padding="md">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 class="text-lg font-semibold text-white">Integração</h3>
            </div>
            
            <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div class="w-10 h-10 rounded-lg bg-[#7cba10]/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-[#7cba10]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-400 mb-0.5">Plataforma</p>
                <p class="text-base text-white font-medium truncate">{{ currentOpportunity.integration.name }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Modal de Status Melhorado -->
      <Transition name="modal">
        <div v-if="showStatusModal" 
             class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             @click.self="showStatusModal = false">
          <Card padding="lg" class="w-full max-w-md transform transition-all">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#7cba10]/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Alterar Status</h3>
              </div>
              <button 
                @click="showStatusModal = false"
                class="w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-2 mb-6 max-h-96 overflow-y-auto">
              <button
                v-for="status in STATUS_OPTIONS"
                :key="status.value"
                @click="selectedStatus = status.value"
                class="w-full px-4 py-4 rounded-lg border transition-all text-left group hover:scale-[1.02]"
                :class="selectedStatus === status.value
                  ? 'border-[#7cba10] bg-[#7cba10]/10 shadow-lg shadow-[#7cba10]/20'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-2 h-2 rounded-full mt-2 transition-all"
                    :class="selectedStatus === status.value ? 'bg-[#7cba10] scale-125' : 'bg-gray-600'"
                  ></div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-semibold text-white">{{ status.label }}</span>
                      <svg 
                        v-if="selectedStatus === status.value"
                        class="w-5 h-5 text-[#7cba10]" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-400">{{ getStatusDescription(status.value) }}</p>
                  </div>
                </div>
              </button>
            </div>

            <div class="flex gap-3">
              <Button variant="secondary" class="flex-1" @click="showStatusModal = false">
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                class="flex-1" 
                :loading="updating"
                :disabled="selectedStatus === currentOpportunity.status"
                @click="handleStatusUpdate"
              >
                {{ updating ? 'Atualizando...' : 'Confirmar' }}
              </Button>
            </div>
          </Card>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .card,
.modal-leave-active .card {
  transition: transform 0.3s ease;
}

.modal-enter-from .card,
.modal-leave-to .card {
  transform: scale(0.95);
}
</style>
