<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOpportunities } from '../../composables/useOpportunities';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {useAdminClients} from "../../composables/useAdminClients.js.js";
import Navbar from "../../shared/Navbar.vue";
const route = useRoute();
const router = useRouter();
const { fetchClientById, currentClient, loading: clientLoading } = useAdminClients();
const { fetchOpportunities, getOpportunityMetrics, opportunities, loading: oppsLoading } = useOpportunities();

const clientId = computed(() => route.params.clientId);
const loading = computed(() => clientLoading.value || oppsLoading.value);
const activeTab = ref('dashboard');

onMounted(async () => {
  await loadClientData();
});

const loadClientData = async () => {
  await fetchClientById(clientId.value);
  // Buscar oportunidades do cliente
  await fetchOpportunities({ 
    user_id: clientId.value,
    limit: 1000 // Carregar todas para métricas
  });
};

const goBack = () => {
  router.push('/admin/clientes');
};

const goToOpportunities = () => {
  router.push(`/admin/oportunidades/${clientId.value}`);
};

const metrics = computed(() => {
  if (!currentClient.value?.metrics) {
    return {
      totalOpportunities: 0,
      wonOpportunities: 0,
      lostOpportunities: 0,
      activeOpportunities: 0,
      totalRecovered: 0,
      conversionRate: 0
    };
  }
  return currentClient.value.metrics;
});

const getStatusConfig = (status) => {
  const configs = {
    active: {
      label: "Ativo",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: "✅",
    },
    trial: {
      label: "Trial",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      icon: "🔄",
    },
    suspended: {
      label: "Suspenso",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      icon: "⏸️",
    },
    canceled: {
      label: "Cancelado",
      color: "#6b7280",
      bgColor: "rgba(107, 114, 128, 0.1)",
      icon: "❌",
    },
  };
  return configs[status] || configs.trial;
};

const statusConfig = computed(() => {
  if (!currentClient.value) return null;
  return getStatusConfig(currentClient.value.status);
});
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar :client-name="currentClient?.name" />
    
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
            <span class="font-medium">Voltar para Gestão de Clientes</span>
          </button>
        </div>

        <LoadingState v-if="loading && !currentClient" message="Carregando dados do cliente..." />

        <template v-else-if="currentClient">
          
          <Card padding="lg" class="mb-6 overflow-hidden relative">
            <div class="absolute inset-0 opacity-5">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
            </div>
            
            <div class="relative">
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div class="flex items-center gap-4">
                  <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-[#7cba10] to-[#5a8c0d] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                    <div class="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white"
                         style="background: linear-gradient(135deg, #7cba10 0%, #5a8c0d 100%)">
                      {{ currentClient.name?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h1 class="text-2xl md:text-3xl font-bold text-white">{{ currentClient.name || 'Sem nome' }}</h1>
                      <span class="px-2 py-1 rounded-lg text-xs font-bold bg-[#7cba10]/20 text-[#7cba10] border border-[#7cba10]/30">
                        CLIENTE
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-400">
                      <a :href="`mailto:${currentClient.email}`" class="flex items-center gap-1.5 hover:text-white transition-colors group">
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{{ currentClient.email }}</span>
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
                  <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Data de Cadastro</p>
                    <p class="text-white font-semibold">{{ formatDate(currentClient.created_at) }}</p>
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
                    <p class="text-white font-semibold">{{ formatDate(currentClient.updated_at) }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Plano</p>
                    <p class="text-white font-semibold">{{ metrics.planName || 'Não definido' }}</p>
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
                  <p class="text-3xl font-bold text-white">{{ metrics.totalOpportunities }}</p>
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
                  <p class="text-3xl font-bold text-green-500">{{ metrics.wonOpportunities }}</p>
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
                  <p class="text-3xl font-bold text-purple-500">{{ metrics.conversionRate }}%</p>
                </div>
                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12" style="background-color: rgba(168, 85, 247, 0.1)">
                  <svg class="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm mb-2">Valor Recuperado</p>
                  <p class="text-2xl md:text-3xl font-bold text-white">{{ formatCurrency(metrics.totalRecovered) }}</p>
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
                <h2 class="text-2xl font-bold text-white mb-1">Ações Rápidas</h2>
                <p class="text-gray-400 text-sm">Acesse diferentes seções do cliente</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                @click="goToOpportunities"
                class="group p-6 rounded-xl border-2 border-gray-700 hover:border-[#7cba10] transition-all hover:shadow-lg hover:-translate-y-1"
                style="background-color: var(--color-background4)"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-[#7cba10]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-[#7cba10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div class="flex-1 text-left">
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[#7cba10] transition-colors">Ver Oportunidades</h3>
                    <p class="text-sm text-gray-400">Acesse todas as oportunidades detalhadas</p>
                  </div>
                  <svg class="w-5 h-5 text-gray-600 group-hover:text-[#7cba10] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <div class="group p-6 rounded-xl border-2 border-gray-700 opacity-50 cursor-not-allowed" style="background-color: var(--color-background4)">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gray-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="flex-1 text-left">
                    <h3 class="text-lg font-bold text-white mb-1">Ver Contatos</h3>
                    <p class="text-sm text-gray-400">Em breve</p>
                  </div>
                </div>
              </div>

              <div class="group p-6 rounded-xl border-2 border-gray-700 opacity-50 cursor-not-allowed" style="background-color: var(--color-background4)">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gray-500/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="flex-1 text-left">
                    <h3 class="text-lg font-bold text-white mb-1">Configurações</h3>
                    <p class="text-sm text-gray-400">Em breve</p>
                  </div>
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