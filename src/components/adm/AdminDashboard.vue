<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useAdminDashboard } from '../../composables/useAdminDashboard';
import { onMounted, ref, computed } from 'vue';
import Button from '../../shared/Button.vue';
import Card from '../../shared/Card.vue';
import Navbar from '../../shared/Navbar.vue';
import GuaranteeCard from "../dashboard/GuaranteeCard.vue";

const router = useRouter();
const { user, isAdmin } = useAuth();
const {
  fetchFilteredStats,
  fetchHistoryStats,
  montlyRevenue,
  monthlyBillings,
  filteredTotalRevenue,
  historyTotalRevenue,
  averageRecoveryRate,
  revenueGrowth,
  billingGrowth,
  totalGrowth
} = useAdminDashboard();

const selectedFilter = ref('7d');
const customStartDate = ref('');
const customEndDate = ref('');
const showCustomInputs = ref(false);

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
};

const applyCustomFilter = async () => {
  if (customStartDate.value && customEndDate.value) {
    let end = new Date(customEndDate.value);
    end.setHours(23, 59, 59, 999);
    await fetchFilteredStats(new Date(customStartDate.value).toISOString(), end.toISOString(), false);
  }
};

onMounted(async () => {
  await applyFilter('7d');
  await fetchHistoryStats();
});

const goToCadastro = () => router.push('/cadastro');
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <!-- Guarantee Card Sidebar -->
    <GuaranteeCard />

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
        <Card padding="lg">
          <h3 class="text-3xl font-bold text-white mb-4">Visão Geral da Receita Recupera.ia</h3>

          <div class="p-8 border-b-2 border-t-2 flex flex-wrap gap-4 justify-center items-center" style="border-color: var(--color-border1)">

            <!-- Card Faturamento Mensalidade -->
            <div class="rounded-2xl p-5 border flex flex-col justify-between shrink-0 w-[300px] h-[180px]" style="background-color: var(--color-background3); border-color: var(--color-border1)">
              <div>
                <span class="text-white text-sm flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9" /></svg>
                  Faturamento Mensalidade
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold" style="color: var(--color-text1);">{{ montlyRevenue }}</span>
                <span class="text-[15px] font-medium" :class="getGrowthColor(revenueGrowth)">{{ revenueGrowth }}</span>
              </div>
              <span class="text-white text-[12px]">{{ filterLabel }}</span>
            </div>

            <!-- Card Faturamento Comissões -->
            <div class="rounded-2xl p-5 border flex flex-col justify-between shrink-0 w-[300px] h-[180px]" style="background-color: var(--color-background3); border-color: var(--color-border1)">
              <div>
                <span class="text-white text-sm flex items-center">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2L14 8L20 8M9 9l6 6M12 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M15 15a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" /></svg>
                  Faturamento Comissões
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold" style="color: var(--color-text1);">{{ monthlyBillings }}</span>
                <span class="text-[15px] font-medium" :class="getGrowthColor(billingGrowth)">{{ billingGrowth }}</span>
              </div>
              <span class="text-white text-[12px]">{{ filterLabel }}</span>
            </div>

            <!-- Card Faturamento Total -->
            <div class="rounded-2xl p-5 border flex flex-col justify-between shrink-0 w-[300px] h-[180px]" style="background-color: var(--color-background3); border-color: var(--color-border1)">
              <div>
                <span class="text-white text-sm flex items-center">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3H18L22 9L12 21L2 9L6 3Z M2 9H22 M6 3L12 9L18 3 M12 9L12 21"/></svg>
                  Faturamento Total
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold" style="color: var(--color-text1);">{{ filteredTotalRevenue }}</span>
                <span class="text-[15px] font-medium" :class="getGrowthColor(totalGrowth)">{{ totalGrowth }}</span>
              </div>
              <span class="text-white text-[12px]">{{ filterLabel }}</span>
            </div>

            <!-- Card Receita Total Histórica -->
            <div class="rounded-2xl p-5 border flex flex-col justify-between shrink-0 w-[300px] h-[180px]" style="background-color: var(--color-background3); border-color: var(--color-border1)">
              <div>
                <span class="text-white text-sm flex items-center">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8 M12 17v4 M7 4h10 M17 4v6a5 5 0 1 1-10 0V4 M6 9h-2a2 2 0 0 1 0-4h2 M18 9h2a2 2 0 0 0 0-4h-2"/></svg>
                  Receita Total da História
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold" style="color: var(--color-text1);">{{ historyTotalRevenue }}</span>
              </div>
              <span class="text-white text-[12px]">Todo o período</span>
            </div>

            <!-- Card Taxa de Recuperação -->
            <div class="rounded-2xl p-5 border flex flex-col justify-between shrink-0 w-[300px] h-[180px]" style="background-color: var(--color-background3); border-color: var(--color-border1)">
              <div>
                <span class="text-white text-sm flex items-center">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5L5 19M9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg>
                  Taxa de Recuperação Média
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold" style="color: var(--color-text1);">{{ averageRecoveryRate }}</span>
              </div>
              <span class="text-white text-[12px]">Todo o período</span>
            </div>

          </div>
        </Card>
      </div>
    </main>
  </div>
</template>