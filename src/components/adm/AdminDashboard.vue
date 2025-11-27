<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useAdminDashboard } from '../../composables/useAdminDashboard';
import { onMounted, ref, computed } from 'vue';
import Button from '../../shared/Button.vue';
import Card from '../../shared/Card.vue';
import Navbar from '../../shared/Navbar.vue';
import { LayoutDashboard, TrendingUp, DollarSign, Award, Target } from 'lucide-vue-next';

const router = useRouter();
const { user, isAdmin } = useAuth();
const {
  fetchFilteredStats,
  fetchHistoryStats,
  fetchTimelineData,
  fetchLeadsDistribution,
  montlyRevenue,
  monthlyBillings,
  filteredTotalRevenue,
  historyTotalRevenue,
  averageRecoveryRate,
  revenueGrowth,
  billingGrowth,
  totalGrowth,
  timelineData,
  leadsDistribution
} = useAdminDashboard();

const selectedFilter = ref('7d');
const customStartDate = ref('');
const customEndDate = ref('');
const showCustomInputs = ref(false);

const animatedRevenue = ref(0);
const animatedBillings = ref(0);
const animatedTotal = ref(0);
const animatedHistory = ref(0);

const animatedRings = ref({
  novos: 0,
  engajados: 0,
  qualificados: 0,
  convertidos: 0
});

const filters = [
  { label: 'Últimos 7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
  { label: 'Histórico Total', value: 'all' },
  { label: 'Personalizado', value: 'custom' },
];

const filterLabel = computed(() => {
  const labels = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias',
    'all': 'Todo o período',
    'custom': 'Período selecionado'
  };
  return labels[selectedFilter.value] || 'Neste período';
});

const getGrowthColor = (val) => {
  if (val.includes('+')) return 'text-metric-green';
  if (val.includes('-')) return 'text-status-error';
  return 'text-gray-400';
};

const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  const range = end - start;

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (range * easeOutQuart);

    callback(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const extractValue = (currencyStr) => {
  return parseFloat(currencyStr.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

const getCirclePath = (percentage) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return { circumference, offset };
};

const animateRings = () => {
  if (!leadsDistribution.value) return;

  animateValue(0, leadsDistribution.value.novos, 1000, (val) => {
    animatedRings.value.novos = val;
  });
  animateValue(0, leadsDistribution.value.engajados, 1200, (val) => {
    animatedRings.value.engajados = val;
  });
  animateValue(0, leadsDistribution.value.qualificados, 1400, (val) => {
    animatedRings.value.qualificados = val;
  });
  animateValue(0, leadsDistribution.value.convertidos, 1600, (val) => {
    animatedRings.value.convertidos = val;
  });
};

const applyFilter = async (filterType) => {
  selectedFilter.value = filterType;
  let start = null;
  let end = new Date().toISOString();
  const now = new Date();
  let isAllTime = false;

  if (filterType === '7d') {
    const date = new Date();
    date.setDate(now.getDate() - 7);
    start = date.toISOString();
    showCustomInputs.value = false;
  } else if (filterType === '30d') {
    const date = new Date();
    date.setDate(now.getDate() - 30);
    start = date.toISOString();
    showCustomInputs.value = false;
  } else if (filterType === '90d') {
    const date = new Date();
    date.setDate(now.getDate() - 90);
    start = date.toISOString();
    showCustomInputs.value = false;
  } else if (filterType === 'all') {
    start = null;
    isAllTime = true;
    showCustomInputs.value = false;
  } else if (filterType === 'custom') {
    showCustomInputs.value = true;
    return;
  }

  await fetchFilteredStats(start, end, isAllTime);
  await fetchTimelineData(start, end);
  await fetchLeadsDistribution();
  animateCards();
  animateRings();
};

const applyCustomFilter = async () => {
  if (customStartDate.value && customEndDate.value) {
    let end = new Date(customEndDate.value);
    end.setHours(23, 59, 59, 999);
    const start = new Date(customStartDate.value).toISOString();
    const endISO = end.toISOString();
    await fetchFilteredStats(start, endISO, false);
    await fetchTimelineData(start, endISO);
    await fetchLeadsDistribution();
    animateCards();
    animateRings();
  }
};

const animateCards = () => {
  animateValue(0, extractValue(montlyRevenue.value), 1000, (val) => {
    animatedRevenue.value = val;
  });

  animateValue(0, extractValue(monthlyBillings.value), 1000, (val) => {
    animatedBillings.value = val;
  });

  animateValue(0, extractValue(filteredTotalRevenue.value), 1000, (val) => {
    animatedTotal.value = val;
  });

  animateValue(0, extractValue(historyTotalRevenue.value), 1200, (val) => {
    animatedHistory.value = val;
  });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatShortCurrency = (value) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

onMounted(async () => {
  await applyFilter('7d');
  await fetchHistoryStats();
  animateCards();
  animateRings();
});
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Header -->
        <Card padding="lg" class="mb-8 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
          </div>

          <div class="relative">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                <LayoutDashboard :size="24" class="text-white" />
              </div>
              <h1 class="text-3xl font-bold text-white">Bem-vindo, {{ user?.name }}!</h1>
            </div>
            <p class="text-gray-400 text-sm ml-15">Este é seu dashboard. Aqui você terá acesso a todas as funcionalidades do sistema.</p>
          </div>
        </Card>

        <!-- Filtros de Período -->
        <Card padding="lg" class="mb-6">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-white mb-1">Filtros de Período</h3>
            <p class="text-sm text-gray-400">Selecione um período para visualizar as métricas</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <Button
                v-for="filter in filters"
                :key="filter.value"
                :variant="selectedFilter === filter.value ? 'primary' : 'secondary'"
                size="sm"
                @click="applyFilter(filter.value)"
            >
              {{ filter.label }}
            </Button>
          </div>

          <div v-if="showCustomInputs" class="flex items-center gap-2 mt-4 p-4 rounded-lg border border-border bg-background-card">
            <input
                type="date"
                v-model="customStartDate"
                class="bg-background-base text-white text-sm border border-border rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            <span class="text-gray-400">até</span>
            <input
                type="date"
                v-model="customEndDate"
                class="bg-background-base text-white text-sm border border-border rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            <Button variant="primary" size="sm" @click="applyCustomFilter">Filtrar</Button>
          </div>
        </Card>

        <!-- Métricas Principais -->
        <div v-if="isAdmin">
          <Card padding="lg" class="mb-6">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-white mb-1">Visão Geral da Receita Recupera.ia</h2>
              <p class="text-sm text-gray-400">Principais indicadores de desempenho da plataforma</p>
            </div>

            <!-- Grid de Métricas -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <!-- Faturamento Mensalidade -->
              <div class="group relative rounded-xl p-6 border border-border-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-metric-blue-light to-transparent">
                <div class="absolute top-4 right-4 w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center">
                  <DollarSign :size="20" class="text-metric-blue" />
                </div>
                <div class="mb-2">
                  <span class="text-gray-400 text-sm font-medium">Faturamento Mensalidade</span>
                </div>
                <div class="mb-3">
                  <span class="text-3xl font-bold text-metric-blue tracking-tight">
                    {{ formatCurrency(animatedRevenue) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 text-xs">{{ filterLabel }}</span>
                  <span class="text-sm font-bold px-2 py-1 rounded-lg bg-background-card" :class="getGrowthColor(revenueGrowth)">
                    {{ revenueGrowth }}
                  </span>
                </div>
              </div>

              <!-- Faturamento Comissões -->
              <div class="group relative rounded-xl p-6 border border-border-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-metric-green-light to-transparent">
                <div class="absolute top-4 right-4 w-10 h-10 rounded-lg bg-metric-green-light flex items-center justify-center">
                  <TrendingUp :size="20" class="text-metric-green" />
                </div>
                <div class="mb-2">
                  <span class="text-gray-400 text-sm font-medium">Faturamento Comissões</span>
                </div>
                <div class="mb-3">
                  <span class="text-3xl font-bold text-metric-green tracking-tight">
                    {{ formatCurrency(animatedBillings) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 text-xs">{{ filterLabel }}</span>
                  <span class="text-sm font-bold px-2 py-1 rounded-lg bg-background-card" :class="getGrowthColor(billingGrowth)">
                    {{ billingGrowth }}
                  </span>
                </div>
              </div>

              <!-- Faturamento Total -->
              <div class="group relative rounded-xl p-6 border border-border-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-metric-purple-light to-transparent">
                <div class="absolute top-4 right-4 w-10 h-10 rounded-lg bg-metric-purple-light flex items-center justify-center">
                  <Target :size="20" class="text-metric-purple" />
                </div>
                <div class="mb-2">
                  <span class="text-gray-400 text-sm font-medium">Faturamento Total</span>
                </div>
                <div class="mb-3">
                  <span class="text-3xl font-bold text-metric-purple tracking-tight">
                    {{ formatCurrency(animatedTotal) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 text-xs">{{ filterLabel }}</span>
                  <span class="text-sm font-bold px-2 py-1 rounded-lg bg-background-card" :class="getGrowthColor(totalGrowth)">
                    {{ totalGrowth }}
                  </span>
                </div>
              </div>

              <!-- Receita Total da História -->
              <div class="group relative rounded-xl p-6 border border-border-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-metric-orange-light to-transparent">
                <div class="absolute top-4 right-4 w-10 h-10 rounded-lg bg-metric-orange-light flex items-center justify-center">
                  <Award :size="20" class="text-metric-orange" />
                </div>
                <div class="mb-2">
                  <span class="text-gray-400 text-sm font-medium">Receita Total da História</span>
                </div>
                <div class="mb-3">
                  <span class="text-3xl font-bold text-metric-orange tracking-tight">
                    {{ formatCurrency(animatedHistory) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 text-xs">Todo o período</span>
                  <span class="text-sm font-bold px-2 py-1 rounded-lg bg-metric-orange-light text-metric-orange">
                    🏆
                  </span>
                </div>
              </div>

              <!-- Taxa de Recuperação Média -->
              <div class="group relative rounded-xl p-6 border border-border-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-blue-500/10 to-transparent">
                <div class="absolute top-4 right-4 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp :size="20" class="text-blue-400" />
                </div>
                <div class="mb-2">
                  <span class="text-gray-400 text-sm font-medium">Taxa de Recuperação Média</span>
                </div>
                <div class="mb-3">
                  <span class="text-3xl font-bold text-blue-400 tracking-tight">
                    {{ averageRecoveryRate }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 text-xs">Todo o período</span>
                  <span class="text-sm font-bold px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">
                    📈
                  </span>
                </div>
              </div>
            </div>

            <!-- Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <!-- Gráfico de Evolução Temporal -->
              <Card padding="lg">
                <div class="mb-6">
                  <h4 class="text-xl font-bold text-white mb-2">Evolução de Receita</h4>
                  <p class="text-gray-400 text-sm">Receita total ao longo do período</p>
                </div>

                <div class="relative h-64">
                  <svg class="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="none">
                    <!-- Grid lines -->
                    <line v-for="i in 5" :key="'grid-' + i" :x1="0" :y1="i * 50" :x2="600" :y2="i * 50"
                          stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>

                    <!-- Gradient definition -->
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color: rgb(124, 186, 16); stop-opacity: 0.4" />
                        <stop offset="100%" style="stop-color: rgb(124, 186, 16); stop-opacity: 0" />
                      </linearGradient>
                    </defs>

                    <!-- Area Chart -->
                    <template v-if="timelineData && timelineData.length > 0">
                      <path
                          :d="timelineData.map((d, i) => {
                          const x = (i / (timelineData.length - 1)) * 600;
                          const maxValue = Math.max(...timelineData.map(d => d.value));
                          const y = 250 - ((d.value / maxValue) * 200);
                          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                        }).join(' ') + ` L 600 250 L 0 250 Z`"
                          fill="url(#areaGradient)"
                      />

                      <!-- Line -->
                      <path
                          :d="timelineData.map((d, i) => {
                          const x = (i / (timelineData.length - 1)) * 600;
                          const maxValue = Math.max(...timelineData.map(d => d.value));
                          const y = 250 - ((d.value / maxValue) * 200);
                          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                        }).join(' ')"
                          fill="none"
                          stroke="rgb(124, 186, 16)"
                          stroke-width="3"
                      />

                      <!-- Points -->
                      <circle
                          v-for="(d, i) in timelineData"
                          :key="'point-' + i"
                          :cx="(i / (timelineData.length - 1)) * 600"
                          :cy="250 - ((d.value / Math.max(...timelineData.map(d => d.value))) * 200)"
                          r="5"
                          fill="rgb(124, 186, 16)"
                          class="hover:r-8 transition-all cursor-pointer"
                      >
                        <title>{{ d.date }}: {{ formatShortCurrency(d.value) }}</title>
                      </circle>
                    </template>

                    <text v-else x="300" y="125" text-anchor="middle" fill="rgba(255, 255, 255, 0.3)" font-size="14">
                      Nenhum dado disponível
                    </text>
                  </svg>
                </div>

                <div class="mt-4 flex items-center justify-center gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-primary"></div>
                    <span class="text-gray-400">Receita Total</span>
                  </div>
                </div>
              </Card>

              <!-- Progress Rings - Status dos Leads -->
              <Card padding="lg">
                <div class="mb-6">
                  <h4 class="text-xl font-bold text-white mb-2">Distribuição de Leads</h4>
                  <p class="text-gray-400 text-sm">Status atual das oportunidades</p>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div class="flex flex-col items-center">
                    <svg class="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="8"/>
                      <circle
                          cx="64" cy="64" r="45"
                          fill="none"
                          stroke="rgb(59, 130, 246)"
                          stroke-width="8"
                          :stroke-dasharray="getCirclePath(100).circumference"
                          :stroke-dashoffset="getCirclePath(animatedRings.novos).offset"
                          stroke-linecap="round"
                          class="transition-all duration-1000"
                      />
                      <text x="64" y="64" text-anchor="middle" dy="0.3em" fill="white" font-size="20" font-weight="bold" transform="rotate(90 64 64)">
                        {{ Math.round(animatedRings.novos) }}%
                      </text>
                    </svg>
                    <div class="mt-3 text-center">
                      <p class="text-blue-400 font-semibold">Novos</p>
                      <p class="text-gray-500 text-xs">Leads recentes</p>
                    </div>
                  </div>

                  <div class="flex flex-col items-center">
                    <svg class="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="8"/>
                      <circle
                          cx="64" cy="64" r="45"
                          fill="none"
                          stroke="rgb(251, 191, 36)"
                          stroke-width="8"
                          :stroke-dasharray="getCirclePath(100).circumference"
                          :stroke-dashoffset="getCirclePath(animatedRings.engajados).offset"
                          stroke-linecap="round"
                          class="transition-all duration-1000"
                      />
                      <text x="64" y="64" text-anchor="middle" dy="0.3em" fill="white" font-size="20" font-weight="bold" transform="rotate(90 64 64)">
                        {{ Math.round(animatedRings.engajados) }}%
                      </text>
                    </svg>
                    <div class="mt-3 text-center">
                      <p class="text-yellow-400 font-semibold">Engajados</p>
                      <p class="text-gray-500 text-xs">Em contato</p>
                    </div>
                  </div>

                  <div class="flex flex-col items-center">
                    <svg class="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="8"/>
                      <circle
                          cx="64" cy="64" r="45"
                          fill="none"
                          stroke="rgb(168, 85, 247)"
                          stroke-width="8"
                          :stroke-dasharray="getCirclePath(100).circumference"
                          :stroke-dashoffset="getCirclePath(animatedRings.qualificados).offset"
                          stroke-linecap="round"
                          class="transition-all duration-1000"
                      />
                      <text x="64" y="64" text-anchor="middle" dy="0.3em" fill="white" font-size="20" font-weight="bold" transform="rotate(90 64 64)">
                        {{ Math.round(animatedRings.qualificados) }}%
                      </text>
                    </svg>
                    <div class="mt-3 text-center">
                      <p class="text-purple-400 font-semibold">Qualificados</p>
                      <p class="text-gray-500 text-xs">Pronto p/ venda</p>
                    </div>
                  </div>

                  <div class="flex flex-col items-center">
                    <svg class="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="8"/>
                      <circle
                          cx="64" cy="64" r="45"
                          fill="none"
                          stroke="rgb(124, 186, 16)"
                          stroke-width="8"
                          :stroke-dasharray="getCirclePath(100).circumference"
                          :stroke-dashoffset="getCirclePath(animatedRings.convertidos).offset"
                          stroke-linecap="round"
                          class="transition-all duration-1000"
                      />
                      <text x="64" y="64" text-anchor="middle" dy="0.3em" fill="white" font-size="20" font-weight="bold" transform="rotate(90 64 64)">
                        {{ Math.round(animatedRings.convertidos) }}%
                      </text>
                    </svg>
                    <div class="mt-3 text-center">
                      <p class="text-primary font-semibold">Convertidos</p>
                      <p class="text-gray-500 text-xs">Vendas fechadas</p>
                    </div>
                  </div>
                </div>
              </Card>

            </div>

          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
circle:hover {
  r: 8;
  transition: r 0.2s ease;
}
</style>