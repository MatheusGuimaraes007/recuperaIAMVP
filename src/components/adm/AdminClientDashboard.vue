<script setup>
import {  computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOpportunities } from '../../composables/useOpportunities';
import { useAdminClients } from "../../composables/useAdminClients.js";
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import MetricCard from '../../shared/MetricCard.vue';
import Navbar from "../../shared/Navbar.vue";
import UserAvatar from "../../shared/UserAvatar.vue";
import StatusBadge from "../../shared/StatusBadge.vue";
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowLeft, Mail, Calendar, Clock, Briefcase,  ChevronRight } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { fetchClientById, currentClient, loading: clientLoading } = useAdminClients();
const { fetchOpportunities, loading: oppsLoading } = useOpportunities();

const clientId = computed(() => route.params.clientId);
const loading = computed(() => clientLoading.value || oppsLoading.value);

onMounted(async () => {
  await loadClientData();
});

const loadClientData = async () => {
  await fetchClientById(clientId.value);
  await fetchOpportunities({
    user_id: clientId.value,
    limit: 1000
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
    active: { type: 'success', label: 'Ativo' },
    trial: { type: 'warning', label: 'Trial' },
    suspended: { type: 'error', label: 'Suspenso' },
    canceled: { type: 'neutral', label: 'Cancelado' }
  };
  return configs[status] || configs.trial;
};

const statusConfig = computed(() => {
  if (!currentClient.value) return null;
  return getStatusConfig(currentClient.value.status);
});
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar :client-name="currentClient?.name" />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Back Button -->
        <div class="mb-6">
          <button
              @click="goBack"
              class="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft :size="20" class="transition-transform group-hover:-translate-x-1" />
            <span class="font-medium">Voltar para Gestão de Clientes</span>
          </button>
        </div>

        <LoadingState v-if="loading && !currentClient" message="Carregando dados do cliente..." />

        <template v-else-if="currentClient">

          <!-- Client Header Card -->
          <Card padding="lg" class="mb-6 relative overflow-hidden">
            <div class="absolute inset-0 opacity-5">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
            </div>

            <div class="relative">
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div class="flex items-center gap-4">
                  <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-dark rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                    <UserAvatar
                        :name="currentClient.name || 'Sem nome'"
                        size="xl"
                        class="relative ring-4 ring-background-card"
                    />
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h1 class="text-2xl md:text-3xl font-bold text-white">{{ currentClient.name || 'Sem nome' }}</h1>
                      <span class="px-2 py-1 rounded-lg text-xs font-bold bg-primary-100 text-primary border border-primary-300">
                        CLIENTE
                      </span>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-400">
                      <a :href="`mailto:${currentClient.email}`" class="flex items-center gap-1.5 hover:text-white transition-colors group">
                        <Mail :size="16" class="group-hover:scale-110 transition-transform" />
                        <span>{{ currentClient.email }}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <StatusBadge
                    v-if="statusConfig"
                    :status="statusConfig.type"
                    :label="statusConfig.label"
                    size="lg"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center flex-shrink-0">
                    <Calendar :size="20" class="text-metric-blue" />
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Data de Cadastro</p>
                    <p class="text-white font-semibold">{{ formatDate(currentClient.created_at) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-metric-green-light flex items-center justify-center flex-shrink-0">
                    <Clock :size="20" class="text-metric-green" />
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Última Atualização</p>
                    <p class="text-white font-semibold">{{ formatDate(currentClient.updated_at) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-metric-purple-light flex items-center justify-center flex-shrink-0">
                    <Briefcase :size="20" class="text-metric-purple" />
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Plano</p>
                    <p class="text-white font-semibold">{{ metrics.planName || 'Não definido' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
                label="Total de Oportunidades"
                :value="metrics.totalOpportunities"
                icon="briefcase"
                variant="blue"
            />

            <MetricCard
                label="Oportunidades Ganhas"
                :value="metrics.wonOpportunities"
                icon="check-circle"
                variant="green"
            />

            <MetricCard
                label="Taxa de Conversão"
                :value="`${metrics.conversionRate}%`"
                icon="trending-up"
                variant="purple"
            />

            <MetricCard
                label="Valor Recuperado"
                :value="formatCurrency(metrics.totalRecovered)"
                icon="dollar-sign"
                variant="orange"
            />
          </div>

          <!-- Quick Actions -->
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
                  class="group p-6 rounded-xl border-2 border-border-card hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 bg-background-card"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase :size="24" class="text-primary" />
                  </div>
                  <div class="flex-1 text-left">
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">Ver Oportunidades</h3>
                    <p class="text-sm text-gray-400">Acesse todas as oportunidades detalhadas</p>
                  </div>
                  <ChevronRight :size="20" class="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              <div class="group p-6 rounded-xl border-2 border-border-card opacity-50 cursor-not-allowed bg-background-card">
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

              <div class="group p-6 rounded-xl border-2 border-border-card opacity-50 cursor-not-allowed bg-background-card">
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