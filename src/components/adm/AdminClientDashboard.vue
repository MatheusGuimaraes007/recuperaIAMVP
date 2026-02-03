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
      conversionRate: 0,
      totalCommission: 0,
      commissionByProduct: []
    };
  }
  return currentClient.value.metrics;
});

const contractedPlanName = computed(() => {
  const planDetails = currentClient.value?.planDetails;
  if (planDetails) {
    return planDetails.name || planDetails.title || planDetails.description || 'Plano personalizado';
  }
  if (metrics.value.planName) return metrics.value.planName;
  if (currentClient.value?.plan) return String(currentClient.value.plan);
  return 'Não definido';
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

const commissionByProduct = computed(() => metrics.value.commissionByProduct || []);
const totalCommission = computed(() => metrics.value.totalCommission || 0);
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
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-size-[40px_40px]"></div>
            </div>

            <div class="relative">
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div class="flex items-center gap-4">
                  <div class="relative group">
                    <div class="absolute -inset-0.5 bg-linear-to-r from-primary to-primary-dark rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
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
                  <div class="w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center shrink-0">
                    <Calendar :size="20" class="text-metric-blue" />
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Data de Cadastro</p>
                    <p class="text-white font-semibold">{{ formatDate(currentClient.created_at) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-metric-green-light flex items-center justify-center shrink-0">
                    <Clock :size="20" class="text-metric-green" />
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Última Atualização</p>
                    <p class="text-white font-semibold">{{ formatDate(currentClient.updated_at) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-metric-purple-light flex items-center justify-center shrink-0">
                    <Briefcase :size="20" class="text-metric-purple" />
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm mb-1">Plano</p>
                    <p class="text-white font-semibold">{{ contractedPlanName }}</p>
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
              label="Oportunidades Recuperadas"
              :value="metrics.recoveredOpportunities || metrics.recovered_opportunities || 0"
              icon="refresh-cw"
              variant="teal"
            />
            <MetricCard
              label="Total de Comissão"
              :value="formatCurrency(totalCommission)"
              icon="dollar-sign"
              variant="yellow"
            />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
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

          <Card padding="lg" class="mb-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-white mb-1">Comissão por Produto</h2>
                <p class="text-gray-400 text-sm">Comparativo do que foi recuperado versus o percentual contratado.</p>
              </div>
            </div>

            <div v-if="commissionByProduct.length" class="space-y-3">
              <div
                v-for="product in commissionByProduct"
                :key="product.productId"
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5/5"
              >
                <div>
                  <p class="text-sm text-gray-400">Produto</p>
                  <p class="text-white font-semibold">{{ product.productName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Taxa de Comissão</p>
                  <p class="text-white font-semibold">{{ (product.commissionRate * 100).toFixed(2) }}%</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Valor Recuperado</p>
                  <p class="text-white font-semibold">{{ formatCurrency(product.recoveredValue) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-400">Comissão Retida</p>
                  <p class="text-primary font-bold">{{ formatCurrency(product.commissionAmount) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-400 text-sm">Nenhuma comissão registrada ainda.</div>
          </Card>

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
                  <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase :size="24" class="text-primary" />
                  </div>
                  <div class="flex-1 text-left">
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">Ver Oportunidades</h3>
                    <p class="text-sm text-gray-400">Acesse todas as oportunidades detalhadas</p>
                  </div>
                  <ChevronRight :size="20" class="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              <button
                  @click="() => router.push(`/admin/contatos/${clientId}`)"
                  class="group p-6 rounded-xl border-2 border-border-card hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 bg-background-card"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 20h5v-2a4 4 0 00-4-4h-1" />
                      <path d="M9 20H4v-2a4 4 0 014-4h1" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div class="flex-1 text-left">
                    <h3 class="text-lg font-bold text-white mb-1">Ver Contatos</h3>
                    <p class="text-sm text-gray-400">Visualize os contatos deste cliente e quantas oportunidades cada um possui</p>
                  </div>
                  <ChevronRight :size="20" class="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            </div>
          </Card>

        </template>
      </div>
    </div>
  </div>
</template>