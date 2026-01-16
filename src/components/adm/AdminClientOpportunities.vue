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
import { useAdminClients } from "../../composables/useAdminClients.js";
import { ArrowLeft, Briefcase, AlertCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { fetchClientById, currentClient, loading: clientLoading } = useAdminClients();

const opportunitiesStore = useOpportunitiesStore();
const metricsCalculator = useMetricsCalculator();

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

  // Forçar busca pelas oportunidades do cliente (admin view)
  params.userId = currentClient.value?.id || clientId.value;
  await opportunitiesStore.fetchOpportunities(params);
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

// Métricas totais (all-time) vindas do objeto do cliente — exibidas sempre
const totalMetrics = computed(() => {
  const cm = currentClient.value?.metrics;
  if (!cm) {
    return {
      total: 0,
      won: 0,
      lost: 0,
      recovered: 0,
      conversionRate: 0,
      recoveryRate: 0,
      totalValue: 0,
      lostValue: 0,
      convertedValue: 0,
      recoveredValue: 0,
      roi: 0,
      averageMessages: 0,
      averageRecoveryMessages: 0,
      averageTime: '0min',
      averageRecoveryTime: '0min'
    };
  }

  return {
    total: cm.totalOpportunities || cm.total || 0,
    won: cm.wonOpportunities || cm.won || 0,
    lost: cm.lostOpportunities || cm.lost || 0,
    recovered: cm.recoveredOpportunities || cm.recovered || 0,
    conversionRate: cm.conversionRate || cm.conversion_rate || 0,
    recoveryRate: cm.recoveryRate || 0,
    totalValue: cm.totalValue || 0,
    lostValue: cm.lostValue || 0,
    convertedValue: cm.totalWonValue || cm.totalRecovered || 0,
    recoveredValue: cm.totalRecoveredValue || cm.totalRecovered || 0,
    roi: cm.roi || 0,
    averageMessages: cm.averageMessages || 0,
    averageRecoveryMessages: cm.averageRecoveryMessages || 0,
    averageTime: cm.averageTime || '0min',
    averageRecoveryTime: cm.averageRecoveryTime || '0min'
  };
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
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Back Button -->
        <div class="mb-6">
          <button
              @click="goBack"
              class="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft :size="20" class="transition-transform group-hover:-translate-x-1" />
            <span class="font-medium">Voltar para Dashboard do Cliente</span>
          </button>
        </div>

        <!-- Header -->
        <Card padding="lg" class="mb-8 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
          </div>

          <div class="relative">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Briefcase :size="24" class="text-white" />
              </div>
              <h1 class="text-3xl font-bold text-white">
                Oportunidades de {{ currentClient?.name || 'Cliente' }}
              </h1>
            </div>
            <p class="text-gray-400 text-sm ml-15">
              Visualize e filtre todas as oportunidades de vendas deste cliente
            </p>
          </div>
        </Card>

        <!-- Filters -->
        <div class="mb-6">
            <OpportunityFilters
              :loading="loading"
              :metrics="totalMetrics"
              @search="handleSearch"
              @status-change="handleStatusChange"
              @period-change="handlePeriodChange"
              @date-range-change="handleDateRangeChange"
              @clear="handleClearFilters"
          />
        </div>

        <!-- Error State -->
        <Card v-if="error" padding="md" class="mb-6">
          <div class="p-4 rounded-lg border flex items-start gap-3 bg-status-error-light border-status-error-border">
            <AlertCircle :size="20" class="text-status-error flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-status-error">
                Erro ao carregar dados
              </p>
              <p class="text-sm mt-1 text-status-error opacity-80">
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