<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClients } from '../../composables/useClients';
import Navbar from '../../shared/Navbar.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

const route = useRoute();
const router = useRouter();
const { contactStatusConfig, fetchContactById } = useClients();

const contact = ref(null);
const loading = ref(true);
const error = ref(null);

const contactId = computed(() => route.params.id);

onMounted(async () => {
  await loadContactDetails();
});

const loadContactDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await fetchContactById(contactId.value);
    
    if (result.success) {
      contact.value = result.data;
    } else {
      error.value = 'Erro ao carregar detalhes do contato';
    }
  } catch (err) {
    console.error('Erro:', err);
    error.value = 'Erro ao carregar detalhes do contato';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/clientes');
};

const statusConfig = computed(() => {
  if (!contact.value) return null;
  return contactStatusConfig(contact.value.status);
});

const opportunityMetrics = computed(() => {
  if (!contact.value?.opportunities) {
    return {
      total: 0,
      won: 0,
      lost: 0,
      active: 0,
      totalValue: 0,
      totalConverted: 0,
      conversionRate: 0
    };
  }

  const opps = contact.value.opportunities;
  const metrics = {
    total: opps.length,
    won: opps.filter(o => o.status === 'won').length,
    lost: opps.filter(o => o.status === 'lost').length,
    active: opps.filter(o => o.status === 'active').length,
    totalValue: opps.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0),
    totalConverted: opps.reduce((sum, o) => sum + (parseFloat(o.converted_value) || 0), 0)
  };

  metrics.conversionRate = metrics.total > 0
    ? ((metrics.won / metrics.total) * 100).toFixed(1)
    : 0;

  return metrics;
});

const getOpportunityStatusConfig = (status) => {
  const configs = {
    active: { label: 'Ativo', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    won: { label: 'Ganho', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    lost: { label: 'Perdido', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    paused: { label: 'Pausado', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' }
  };
  return configs[status] || configs.active;
};

const getOpportunityTypeLabel = (type) => {
  const types = {
    'pix': 'PIX',
    'pix_gerado': 'PIX Gerado',
    'boleto': 'Boleto',
    'boleto_emitido': 'Boleto Emitido',
    'cartao': 'Cartão',
    'cartao_recusado': 'Cartão Recusado',
    'carrinho': 'Carrinho',
    'carrinho_abandonado': 'Carrinho Abandonado'
  };
  return types[type] || type;
};
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />
    
    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">
        
        <div class="mb-6">
          <button
            @click="goBack"
            class="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-medium">Voltar para Clientes</span>
          </button>
        </div>

        <LoadingState v-if="loading" message="Carregando detalhes do contato..." />

        <Card v-else-if="error" padding="lg">
          <div class="text-center py-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
              <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h3>
            <p class="text-gray-400 mb-6">{{ error }}</p>
            <button
              @click="loadContactDetails"
              class="px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105"
              style="background-color: var(--color-text1)"
            >
              Tentar Novamente
            </button>
          </div>
        </Card>

        <template v-else-if="contact">
          
          <Card padding="lg" class="mb-6 overflow-hidden relative">
            <div class="absolute inset-0 opacity-5">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
            </div>
            
            <div class="relative">
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div class="flex items-center gap-4">
                  <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-[#7cba10] to-[#667eea] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                    <div class="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white"
                         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                      {{ contact.name?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ contact.name || 'Sem nome' }}</h1>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-400">
                      <a :href="`tel:${contact.phone}`" class="flex items-center gap-1.5 hover:text-white transition-colors group">
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span class="font-medium">{{ formatPhone(contact.phone) }}</span>
                      </a>
                      <a v-if="contact.email" :href="`mailto:${contact.email}`" class="flex items-center gap-1.5 hover:text-white transition-colors group">
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{{ contact.email }}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  class="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                  :style="{
                    color: statusConfig?.color,
                    backgroundColor: statusConfig?.bgColor,
                    border: `2px solid ${statusConfig?.color}33`,
                    boxShadow: `0 4px 20px ${statusConfig?.color}20`
                  }"
                >
                  <span class="text-lg">{{ statusConfig?.icon }}</span>
                  <span>{{ statusConfig?.label }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t" style="border-color: var(--color-border1)">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Agente Responsável</p>
                    <p class="text-white font-semibold">{{ contact.agent?.name || 'Não atribuído' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Data de Cadastro</p>
                    <p class="text-white font-semibold">{{ formatDate(contact.created_at) }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Última Atualização</p>
                    <p class="text-white font-semibold">{{ formatDate(contact.updated_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm mb-2">Total de Oportunidades</p>
                  <p class="text-3xl font-bold text-white">{{ opportunityMetrics.total }}</p>
                </div>
                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12" style="background-color: rgba(59, 130, 246, 0.1)">
                  <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm mb-2">Oportunidades Ganhas</p>
                  <p class="text-3xl font-bold text-green-500">{{ opportunityMetrics.won }}</p>
                </div>
                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12" style="background-color: rgba(16, 185, 129, 0.1)">
                  <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm mb-2">Taxa de Conversão</p>
                  <p class="text-3xl font-bold" style="color: var(--color-text1)">{{ opportunityMetrics.conversionRate }}%</p>
                </div>
                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12" style="background-color: rgba(124, 186, 16, 0.1)">
                  <svg class="w-7 h-7" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm mb-2">Valor Convertido</p>
                  <p class="text-2xl md:text-3xl font-bold text-white">{{ formatCurrency(opportunityMetrics.totalConverted) }}</p>
                </div>
                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12" style="background-color: rgba(245, 158, 11, 0.1)">
                  <svg class="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          <Card padding="lg">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-white mb-1">Histórico de Oportunidades</h2>
                <p class="text-gray-400 text-sm">Acompanhe todas as interações e conversões</p>
              </div>
              <div class="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
                <span class="text-gray-400 text-sm font-medium">{{ opportunityMetrics.total }} {{ opportunityMetrics.total === 1 ? 'oportunidade' : 'oportunidades' }}</span>
              </div>
            </div>

            <div v-if="!contact.opportunities || contact.opportunities.length === 0" class="text-center py-16">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/50 mb-4">
                <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p class="text-lg font-medium text-gray-400">Nenhuma oportunidade registrada</p>
              <p class="text-sm text-gray-500 mt-2">As oportunidades aparecerão aqui quando forem criadas</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="opp in contact.opportunities"
                :key="opp.id"
                class="group p-5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:border-opacity-80 hover:-translate-y-0.5"
                style="background-color: var(--color-background4); border-color: var(--color-border1)"
              >
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        class="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                        :style="{
                          color: getOpportunityStatusConfig(opp.status).color,
                          backgroundColor: getOpportunityStatusConfig(opp.status).bgColor,
                          border: `1px solid ${getOpportunityStatusConfig(opp.status).color}33`
                        }"
                      >
                        {{ getOpportunityStatusConfig(opp.status).label }}
                      </span>
                      <span class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700">
                        {{ getOpportunityTypeLabel(opp.opportunity_type) }}
                      </span>
                    </div>
                    <p class="text-white font-semibold text-lg mb-1">Oportunidade #{{ opp.id }}</p>
                    <p class="text-sm text-gray-400 flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Criada em {{ formatDate(opp.created_at) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-white mb-1">{{ formatCurrency(opp.value) }}</p>
                    <p v-if="opp.status === 'won' && opp.converted_value" class="text-sm font-semibold text-green-400 flex items-center justify-end gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ formatCurrency(opp.converted_value) }}
                    </p>
                  </div>
                </div>

                <div v-if="opp.conversation_summary" class="pt-4 border-t" style="border-color: var(--color-border1)">
                  <div class="flex items-start gap-2 mb-2">
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-400 mb-1">Resumo da conversa</p>
                      <p class="text-sm text-gray-300 leading-relaxed">{{ opp.conversation_summary }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
                  <span v-if="opp.message_count" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span class="font-medium">{{ opp.message_count }} mensagens</span>
                  </span>
                  <span v-if="opp.conversion_time_minutes" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{{ opp.conversion_time_minutes }} min</span>
                  </span>
                  <span v-if="opp.closed_at" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">Fechada em {{ formatDate(opp.closed_at) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>

        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4 > div {
  animation: fadeIn 0.3s ease-out;
}
</style>