<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useAdminDashboard } from '../../composables/useAdminDashboard';
import { onMounted, ref, computed } from 'vue';
import Button from '../../shared/Button.vue';
import Card from '../../shared/Card.vue';
import Navbar from '../../shared/Navbar.vue';

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
  if (val.includes('+')) return 'text-green-400';
  if (val.includes('-')) return 'text-red-400';
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

onMounted(async () => {
  await applyFilter('7d');
  await fetchHistoryStats();
  animateCards();
  animateRings();
});

</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <Card padding="lg" class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Bem-vindo, {{ user?.name }}!</h2>
        <p class="text-gray-400">Este é seu dashboard. Aqui você terá acesso a todas as funcionalidades do sistema.</p>
      </Card>

      <div class="mb-8">
        <h3 class="text-xl font-bold text-white mb-4">Filtros de Período</h3>
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
          <div v-if="showCustomInputs" class="flex items-center gap-2 ml-2 p-2 rounded border border-gray-700 bg-black/20">
            <input type="date" v-model="customStartDate" class="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1 focus:border-[#7cba10] outline-none" />
            <span class="text-gray-400">até</span>
            <input type="date" v-model="customEndDate" class="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1 focus:border-[#7cba10] outline-none" />
            <Button variant="primary" size="sm" @click="applyCustomFilter">Filtrar</Button>
          </div>
        </div>
      </div>

      <div v-if="isAdmin">
        <Card padding="lg" class="mb-8">
          <h3 class="text-3xl font-bold text-white mb-6">Visão Geral da Receita Recupera.ia</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 border-b-2 border-t-2 mb-8" style="border-color: var(--color-border1)">

            <!-- Card 1: Faturamento Mensalidade -->
            <div class="group relative rounded-2xl p-6 border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
                 style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%); border-color: rgba(59, 130, 246, 0.3);">
              <div class="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse" 
                   style="background: rgba(59, 130, 246, 0.2);">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9" />
                </svg>
              </div>
              <div class="mb-4">
                <span class="text-white text-sm font-medium opacity-80">Faturamento Mensalidade</span>
              </div>
              <div class="mb-3">
                <span class="text-3xl font-bold text-blue-400 tracking-tight">
                  {{ formatCurrency(animatedRevenue) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-xs">{{ filterLabel }}</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full" :class="getGrowthColor(revenueGrowth)"
                      style="background: rgba(255, 255, 255, 0.05);">
                  {{ revenueGrowth }}
                </span>
              </div>
              <div class="mt-4 h-8 flex items-end gap-1 opacity-50">
                <div class="w-1 bg-blue-400 rounded-t" style="height: 40%"></div>
                <div class="w-1 bg-blue-400 rounded-t" style="height: 65%"></div>
                <div class="w-1 bg-blue-400 rounded-t" style="height: 45%"></div>
                <div class="w-1 bg-blue-400 rounded-t" style="height: 80%"></div>
                <div class="w-1 bg-blue-400 rounded-t" style="height: 55%"></div>
                <div class="w-1 bg-blue-400 rounded-t" style="height: 90%"></div>
                <div class="w-1 bg-blue-400 rounded-t" style="height: 100%"></div>
              </div>
            </div>

            <!-- Card 2: Faturamento Comissões -->
            <div class="group relative rounded-2xl p-6 border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
                 style="background: linear-gradient(135deg, rgba(124, 186, 16, 0.15) 0%, rgba(101, 163, 13, 0.05) 100%); border-color: rgba(124, 186, 16, 0.3);">
              <div class="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse" 
                   style="background: rgba(124, 186, 16, 0.2);">
                <svg class="w-6 h-6" style="color: var(--color-text1)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2L14 8L20 8M9 9l6 6M12 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M15 15a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              </div>
              <div class="mb-4">
                <span class="text-white text-sm font-medium opacity-80">Faturamento Comissões</span>
              </div>
              <div class="mb-3">
                <span class="text-3xl font-bold tracking-tight" style="color: var(--color-text1)">
                  {{ formatCurrency(animatedBillings) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-xs">{{ filterLabel }}</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full" :class="getGrowthColor(billingGrowth)"
                      style="background: rgba(255, 255, 255, 0.05);">
                  {{ billingGrowth }}
                </span>
              </div>
              <div class="mt-4 h-8 flex items-end gap-1 opacity-50">
                <div class="w-1 rounded-t" style="height: 50%; background: var(--color-text1)"></div>
                <div class="w-1 rounded-t" style="height: 70%; background: var(--color-text1)"></div>
                <div class="w-1 rounded-t" style="height: 60%; background: var(--color-text1)"></div>
                <div class="w-1 rounded-t" style="height: 85%; background: var(--color-text1)"></div>
                <div class="w-1 rounded-t" style="height: 65%; background: var(--color-text1)"></div>
                <div class="w-1 rounded-t" style="height: 95%; background: var(--color-text1)"></div>
                <div class="w-1 rounded-t" style="height: 100%; background: var(--color-text1)"></div>
              </div>
            </div>

            <!-- Card 3: Faturamento Total -->
            <div class="group relative rounded-2xl p-6 border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
                 style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%); border-color: rgba(168, 85, 247, 0.3);">
              <div class="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse" 
                   style="background: rgba(168, 85, 247, 0.2);">
                <svg class="w-6 h-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 3H18L22 9L12 21L2 9L6 3Z M2 9H22 M6 3L12 9L18 3 M12 9L12 21"/>
                </svg>
              </div>
              <div class="mb-4">
                <span class="text-white text-sm font-medium opacity-80">Faturamento Total</span>
              </div>
              <div class="mb-3">
                <span class="text-3xl font-bold text-purple-400 tracking-tight">
                  {{ formatCurrency(animatedTotal) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-xs">{{ filterLabel }}</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full" :class="getGrowthColor(totalGrowth)"
                      style="background: rgba(255, 255, 255, 0.05);">
                  {{ totalGrowth }}
                </span>
              </div>
              <div class="mt-4 h-8 flex items-end gap-1 opacity-50">
                <div class="w-1 bg-purple-400 rounded-t" style="height: 55%"></div>
                <div class="w-1 bg-purple-400 rounded-t" style="height: 75%"></div>
                <div class="w-1 bg-purple-400 rounded-t" style="height: 68%"></div>
                <div class="w-1 bg-purple-400 rounded-t" style="height: 88%"></div>
                <div class="w-1 bg-purple-400 rounded-t" style="height: 72%"></div>
                <div class="w-1 bg-purple-400 rounded-t" style="height: 92%"></div>
                <div class="w-1 bg-purple-400 rounded-t" style="height: 100%"></div>
              </div>
            </div>

            <!-- Card 4: Receita Total da História -->
            <div class="group relative rounded-2xl p-6 border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
                 style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%); border-color: rgba(251, 191, 36, 0.3);">
              <div class="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse" 
                   style="background: rgba(251, 191, 36, 0.2);">
                <svg class="w-6 h-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 21h8 M12 17v4 M7 4h10 M17 4v6a5 5 0 1 1-10 0V4 M6 9h-2a2 2 0 0 1 0-4h2 M18 9h2a2 2 0 0 0 0-4h-2"/>
                </svg>
              </div>
              <div class="mb-4">
                <span class="text-white text-sm font-medium opacity-80">Receita Total da História</span>
              </div>
              <div class="mb-3">
                <span class="text-3xl font-bold text-yellow-400 tracking-tight">
                  {{ formatCurrency(animatedHistory) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-xs">Todo o período</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full text-yellow-400"
                      style="background: rgba(251, 191, 36, 0.15);">
                  🏆
                </span>
              </div>
              <div class="mt-4 h-8 flex items-end gap-1 opacity-50">
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 30%"></div>
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 45%"></div>
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 60%"></div>
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 75%"></div>
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 85%"></div>
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 95%"></div>
                <div class="w-1 bg-yellow-400 rounded-t" style="height: 100%"></div>
              </div>
            </div>

            <!-- Card 5: Taxa de Recuperação Média -->
            <div class="group relative rounded-2xl p-6 border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
                 style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%); border-color: rgba(6, 182, 212, 0.3);">
              <div class="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse" 
                   style="background: rgba(6, 182, 212, 0.2);">
                <svg class="w-6 h-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 5L5 19M9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                </svg>
              </div>
              <div class="mb-4">
                <span class="text-white text-sm font-medium opacity-80">Taxa de Recuperação Média</span>
              </div>
              <div class="mb-3">
                <span class="text-3xl font-bold text-cyan-400 tracking-tight">
                  {{ averageRecoveryRate }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-xs">Todo o período</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full text-cyan-400"
                      style="background: rgba(6, 182, 212, 0.15);">
                  📈
                </span>
              </div>
              <div class="mt-4 h-8 flex items-end gap-1 opacity-50">
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 45%"></div>
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 60%"></div>
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 55%"></div>
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 70%"></div>
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 65%"></div>
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 80%"></div>
                <div class="w-1 bg-cyan-400 rounded-t" style="height: 100%"></div>
              </div>
            </div>

          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            <!-- Gráfico de Evolução Temporal -->
            <div class="rounded-2xl p-6 border" style="background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.1);">
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
                      <stop offset="0%" style="stop-color: rgba(124, 186, 16, 0.4); stop-opacity: 1" />
                      <stop offset="100%" style="stop-color: rgba(124, 186, 16, 0.0); stop-opacity: 0" />
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
                      stroke="var(--color-text1)"
                      stroke-width="3"
                    />
                    
                    <!-- Points -->
                    <circle 
                      v-for="(d, i) in timelineData" 
                      :key="'point-' + i"
                      :cx="(i / (timelineData.length - 1)) * 600"
                      :cy="250 - ((d.value / Math.max(...timelineData.map(d => d.value))) * 200)"
                      r="5"
                      fill="var(--color-text1)"
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
                  <div class="w-3 h-3 rounded-full" style="background: var(--color-text1)"></div>
                  <span class="text-gray-400">Receita Total</span>
                </div>
              </div>
            </div>

            <!-- Progress Rings - Status dos Leads -->
            <div class="rounded-2xl p-6 border" style="background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.1);">
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
                    <p class="font-semibold" style="color: var(--color-text1)">Convertidos</p>
                    <p class="text-gray-500 text-xs">Vendas fechadas</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </Card>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

circle:hover {
  r: 8;
  transition: r 0.2s ease;
}
</style>