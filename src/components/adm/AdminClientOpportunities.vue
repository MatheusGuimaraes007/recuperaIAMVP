<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Navbar from '../../shared/Navbar.vue';
import OpportunityFilters from '../opportunities/OpportunityFilters.vue';
import OpportunityTable from '../opportunities/OpportunityTable.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import Pagination from '../../shared/Pagination.vue';
import { PAGINATION } from '../../utils/constants';
import { useOpportunitiesStore } from '../../stores/useOpportunitiesStore';
import { useMetricsCalculator } from '../../composables/useMetricsCalculator';
import {useAdminClients} from "../../composables/useAdminClients.js.js";

const route = useRoute();
const router = useRouter();
const { fetchClientById, currentClient, loading: clientLoading } = useAdminClients();

const opportunitiesStore = useOpportunitiesStore();
const metricsCalculator = useMetricsCalculator();

// Usar storeToRefs para reatividade
const {
  opportunities,
  loading: oppsLoading,
  error,
  totalCount
} = storeToRefs(opportunitiesStore);

const clientId = computed(() => route.params.clientId);
const loading = computed(() => clientLoading.value || oppsLoading.value);

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
const currentPeriod = ref('last7days');
const currentDateRange = ref(null);
const currentStatus = ref('all');
const currentSearch = ref('');

onMounted(async () => {
  await fetchClientById(clientId.value);
  await loadOpportunities();
});

// Observar mudanças no clientId
watch(clientId, async (newId) => {
  if (newId) {
    await fetchClientById(newId);
    await loadOpportunities();
  }
});

const loadOpportunities = async (filterParams = {}) => {
  const params = {
    page: currentPage.value,
    limit: itemsPerPage,
    period: currentPeriod.value,
    ...filterParams
  };

  if (currentStatus.value && currentStatus.value !== 'all') {
    params.status = currentStatus.value;
  }

  if (currentSearch.value && currentSearch.value.trim() !== '') {
    params.search = currentSearch.value.trim();
  }

  if (currentDateRange.value?.startDate && currentDateRange.value?.endDate) {
    params.startDate = currentDateRange.value.startDate;
    params.endDate = currentDateRange.value.endDate;
    delete params.period;
  }

  // Buscar oportunidades do cliente específico
  const result = await opportunitiesStore.fetchOpportunities(params);
  
  // Filtrar apenas as do cliente (caso a store não filtre automaticamente)
  if (result.success && opportunities.value) {
    // Já vem filtrado da store, apenas garantir
  }
};

const handleSearch = async (filters) => {
  currentPage.value = 1;
  currentSearch.value = filters.search || '';
  currentStatus.value = filters.status || 'all';

  await loadOpportunities({
    search: filters.search,
    status: filters.status
  });
};

const handleStatusChange = async (status) => {
  currentStatus.value = status;
  currentPage.value = 1;

  await loadOpportunities({
    status: status !== 'all' ? status : null,
    search: currentSearch.value
  });
};

const handlePeriodChange = async (period) => {
  currentPeriod.value = period;
  currentDateRange.value = null;
  currentPage.value = 1;

  await loadOpportunities({
    period: period,
    status: currentStatus.value !== 'all' ? currentStatus.value : null,
    search: currentSearch.value
  });
};

const handleDateRangeChange = async (dates) => {
  currentPeriod.value = 'custom';
  currentDateRange.value = dates;
  currentPage.value = 1;

  await loadOpportunities({
    startDate: dates.startDate,
    endDate: dates.endDate,
    status: currentStatus.value !== 'all' ? currentStatus.value : null,
    search: currentSearch.value
  });
};

const handleClearFilters = async () => {
  currentPage.value = 1;
  currentPeriod.value = 'last7days';
  currentDateRange.value = null;
  currentStatus.value = 'all';
  currentSearch.value = '';

  opportunitiesStore.clearFilters();
  await loadOpportunities();
};

const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadOpportunities();
};

const goBack = () => {
  router.push(`/admin/dashboard/${clientId.value}`);
};

const totalPages = computed(() => {
  return Math.ceil((totalCount.value || 0) / itemsPerPage);
});

const metrics = computed(() => {
  // Garantir que opportunities é um array
  const opps = Array.isArray(opportunities.value) ? opportunities.value : [];
  
  if (opps.length === 0) {
    return {
      total: 0,
      won: 0,
      conversionRate: 0,
      totalValue: 0,
      convertedValue: 0,
      roi: 0,
      averageMessages: 0,
      averageTime: '0min'
    };
  }

  if (currentDateRange.value?.startDate && currentDateRange.value?.endDate) {
    return metricsCalculator.calculateAllMetrics(
      metricsCalculator.filterByDateRange(
        opps,
        currentDateRange.value.startDate,
        currentDateRange.value.endDate
      )
    );
  }

  const { startDate, endDate } = metricsCalculator.getDateRangeFromPeriod(currentPeriod.value);
  const filteredOpps = metricsCalculator.filterByDateRange(opps, startDate, endDate);

  return metricsCalculator.calculateAllMetrics(filteredOpps);
});

const showEmptyState = computed(() => {
  const opps = Array.isArray(opportunities.value) ? opportunities.value : [];
  return !loading.value && opps.length === 0;
});

const hasActiveFilters = computed(() => {
  return currentSearch.value !== '' || 
         currentStatus.value !== 'all' || 
         currentPeriod.value !== 'last7days' ||
         currentDateRange.value !== null;
});
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />
    
    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">
        
        <!-- Back Button -->
        <div class="mb-6">
          <button
            @click="goBack"
            class="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-medium">Voltar para Dashboard do Cliente</span>
          </button>
        </div>

        <!-- Header -->
        <div class="mb-8 flex items-center justify-between p-6 rounded-lg"
             style="background-color: var(--color-background4); border: 1px solid var(--color-border1)">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-white">
                Oportunidades de {{ currentClient?.name || 'Cliente' }}
              </h1>
            </div>
            <p class="text-gray-400 text-sm ml-13">
              Visualize e filtre todas as oportunidades de vendas deste cliente
            </p>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6">
          <OpportunityFilters
            :loading="loading"
            :metrics="metrics"
            @search="handleSearch"
            @status-change="handleStatusChange"
            @period-change="handlePeriodChange"
            @date-range-change="handleDateRangeChange"
            @clear="handleClearFilters"
          />
        </div>

        <!-- Error State -->
        <Card v-if="error" padding="md" class="mb-6">
          <div
            class="p-4 rounded-lg border flex items-start gap-3"
            style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)"
          >
            <svg
              class="w-5 h-5 flex-shrink-0 mt-0.5"
              style="color: var(--color-text2)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="text-sm font-medium" style="color: var(--color-text2)">
                Erro ao carregar dados
              </p>
              <p class="text-sm mt-1" style="color: var(--color-text2); opacity: 0.8">
                {{ error }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Loading State -->
        <LoadingState
          v-if="loading && (!opportunities || opportunities.length === 0)"
          message="Carregando oportunidades..."
        />

        <!-- Empty State -->
        <EmptyState
          v-else-if="showEmptyState"
          :title="hasActiveFilters ? 'Nenhuma oportunidade encontrada' : 'Nenhuma oportunidade cadastrada'"
          :message="hasActiveFilters ? 'Tente ajustar os filtros ou a busca' : 'Este cliente ainda não possui oportunidades'"
          icon="search"
          :action-label="hasActiveFilters ? 'Limpar filtros' : undefined"
          @action="handleClearFilters"
        />

        <!-- Table -->
        <OpportunityTable
          v-else
          :opportunities="opportunities || []"
        >
          <template #pagination>
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :total-count="totalCount || 0"
              :items-per-page="itemsPerPage"
              @page-change="handlePageChange"
            />
          </template>
        </OpportunityTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>