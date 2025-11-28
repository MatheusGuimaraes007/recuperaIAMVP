<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useOpportunities } from "../../composables/useOpportunities.js";
import { PAGINATION } from '../../utils/constants';

// Componentes
import OpportunityFilters from './OpportunityFilters.vue';
import OpportunityTable from './OpportunityTable.vue';
import Card from "../../shared/Card.vue";
import LoadingState from "../../shared/LoadingState.vue";
import EmptyState from "../../shared/EmptyState.vue";
import Pagination from "../../shared/Pagination.vue";
import GuaranteeCard from "../dashboard/GuaranteeCard.vue";
import Navbar from '../../shared/Navbar.vue'; // ✅ Import da Navbar

const { logout } = useAuth();
const router = useRouter();
const {
  opportunities,
  loading,
  error,
  totalCount,
  hasOpportunities,
  hasActiveFilters,
  fetchOpportunities,
  clearFilters,
  getMetricsByPeriod,
  getMetricsByDateRange
} = useOpportunities();

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
const currentPeriod = ref('last7days');
const currentDateRange = ref(null);
const currentStatus = ref('all');
const currentSearch = ref('');

onMounted(async () => {
  await loadOpportunities();
});

const loadOpportunities = async (filters = {}) => {
  const filterParams = {
    page: currentPage.value,
    limit: itemsPerPage,
    period: currentPeriod.value,
    ...filters
  };

  if (currentStatus.value && currentStatus.value !== 'all') {
    filterParams.status = currentStatus.value;
  }

  if (currentSearch.value && currentSearch.value.trim() !== '') {
    filterParams.search = currentSearch.value.trim();
  }

  if (currentDateRange.value?.startDate && currentDateRange.value?.endDate) {
    filterParams.startDate = currentDateRange.value.startDate;
    filterParams.endDate = currentDateRange.value.endDate;
    delete filterParams.period;
  }

  await fetchOpportunities(filterParams);
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

  clearFilters();
  await loadOpportunities();
};

const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadOpportunities();
};

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / itemsPerPage);
});

const metrics = computed(() => {
  if (!opportunities.value || opportunities.value.length === 0) {
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
    return getMetricsByDateRange(
        currentDateRange.value.startDate,
        currentDateRange.value.endDate
    );
  }

  return getMetricsByPeriod(currentPeriod.value);
});

const showEmptyState = computed(() => {
  return !loading.value && !hasOpportunities.value;
});

const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    router.push('/login');
  }
};
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <div class="p-6">
      <GuaranteeCard />

      <div class="max-w-[1600px] mx-auto">

        <div class="mb-8 flex items-center justify-between p-6 rounded-lg"
             style="background-color: var(--color-background4); border: 1px solid var(--color-border1)">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">
              Detalhamento dos Atendimentos
            </h1>
            <p class="text-gray-400 text-sm">
              Visualize e filtre suas oportunidades de vendas
            </p>
          </div>
        </div>

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

        <LoadingState
            v-if="loading && !hasOpportunities"
            message="Carregando oportunidades..."
        />

        <EmptyState
            v-else-if="showEmptyState"
            :title="hasActiveFilters ? 'Nenhuma oportunidade encontrada' : 'Nenhuma oportunidade cadastrada'"
            :message="hasActiveFilters ? 'Tente ajustar os filtros ou a busca' : 'Comece criando sua primeira oportunidade'"
            icon="search"
            :action-label="hasActiveFilters ? 'Limpar filtros' : undefined"
            @action="handleClearFilters"
        />

        <OpportunityTable
            v-else
            :opportunities="opportunities"
        >
          <template #pagination>
            <Pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-count="totalCount"
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