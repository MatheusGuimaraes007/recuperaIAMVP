<script setup>
import { ref, computed, onMounted } from 'vue';
import OpportunityFilters from './OpportunityFilters.vue';
import OpportunityTable from './OpportunityTable.vue';
import { PAGINATION } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import LoadingState from "../../shared/LoadingState.vue";
import EmptyState from "../../shared/EmptyState.vue";
import Pagination from "../../shared/Pagination.vue";
import {useOpportunities} from "../../composables/useOpportunities.js";

const {
  opportunities,
  loading,
  error,
  totalCount,
  fetchOpportunities,
  clearFilters
} = useOpportunities();

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

onMounted(async () => {
  await loadOpportunities();
});

const loadOpportunities = async (filters = {}) => {
  const filterParams = {
    ...filters,
    page: currentPage.value,
    limit: itemsPerPage
  };

  await fetchOpportunities(filterParams);
};

const handleSearch = async (filters) => {
  currentPage.value = 1;
  await loadOpportunities(filters);
};

const handleStatusChange = async (status) => {
  currentPage.value = 1;
  await loadOpportunities({
    status: status !== 'all' ? status : null
  });
};

const handleClearFilters = async () => {
  currentPage.value = 1;
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

const hasOpportunities = computed(() => {
  return opportunities.value && opportunities.value.length > 0;
});
</script>

<template>
  <div class="min-h-screen p-6" style="background-color: var(--color-background3)">
    <div class="max-w-7xl mx-auto">

      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Oportunidades</h1>
            <p class="text-gray-400">Gerencie e acompanhe suas oportunidades de venda</p>
          </div>

          <div class="text-right">
            <div class="text-sm text-gray-400 mb-1">Total de oportunidades</div>
            <div class="text-2xl font-bold" style="color: var(--color-text1)">
              {{ totalCount }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <OpportunityFilters
            :loading="loading"
            @search="handleSearch"
            @status-change="handleStatusChange"
            @clear="handleClearFilters"
        />
      </div>

      <Card v-if="error" padding="md" class="mb-6">
        <div class="p-4 rounded-lg border"
             style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
          <p class="text-sm" style="color: var(--color-text2)">{{ error }}</p>
        </div>
      </Card>

      <LoadingState
          v-if="loading && !hasOpportunities"
          message="Carregando oportunidades..."
      />

      <EmptyState
          v-else-if="!loading && !hasOpportunities"
          title="Nenhuma oportunidade encontrada"
          message="Tente ajustar os filtros ou a busca"
          icon="search"
          action-label="Limpar filtros"
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
</template>