<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

import AdminClientsFilters from './AdminClientsFilters.vue';
import AdminClientsTable from './AdminClientsTable.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import Pagination from '../../shared/Pagination.vue';
import Navbar from '../../shared/Navbar.vue';
import { PAGINATION } from '../../utils/constants';
import {useAdminClients} from "../../composables/useAdminClients.js.js";

const { logout, isAdmin } = useAuth();
const router = useRouter();

const {
  clients,
  loading,
  error,
  totalCount,
  hasClients,
  getClientsMetrics,
  statusOptions,
  fetchPlatformClients,
  clearClients
} = useAdminClients();

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
const currentStatus = ref('all');
const currentSearch = ref('');

// Verificar se é admin antes de carregar
onMounted(async () => {
  if (!isAdmin.value) {
    router.push('/clientes');
    return;
  }
  await loadClients();
});

const loadClients = async (filters = {}) => {
  const filterParams = {
    page: currentPage.value,
    limit: itemsPerPage,
    ...filters
  };

  if (currentStatus.value && currentStatus.value !== 'all') {
    filterParams.status = currentStatus.value;
  }

  if (currentSearch.value && currentSearch.value.trim() !== '') {
    filterParams.search = currentSearch.value.trim();
  }

  await fetchPlatformClients(filterParams);
};

const handleSearch = async (filters) => {
  currentPage.value = 1;
  currentSearch.value = filters.search || '';
  currentStatus.value = filters.status || 'all';

  await loadClients({
    search: filters.search,
    status: filters.status
  });
};

const handleStatusChange = async (status) => {
  currentStatus.value = status;
  currentPage.value = 1;

  await loadClients({
    status: status !== 'all' ? status : null,
    search: currentSearch.value
  });
};

const handleClearFilters = async () => {
  currentPage.value = 1;
  currentStatus.value = 'all';
  currentSearch.value = '';

  clearClients();
  await loadClients();
};

const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadClients();
};

const handleClientClick = (client) => {
  router.push(`/admin/dashboard/${client.id}`);
};

const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    router.push('/login');
  }
};

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / itemsPerPage);
});

const showEmptyState = computed(() => {
  return !loading.value && !hasClients.value;
});

const hasActiveFilters = computed(() => {
  return currentSearch.value !== '' || currentStatus.value !== 'all';
});
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />
    
    <div class="p-6">
      <div class="max-w-[1600px] mx-auto">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between p-6 rounded-lg"
             style="background-color: var(--color-background4); border: 1px solid var(--color-border1)">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-white">
                Gestão de Clientes da Plataforma
              </h1>
            </div>
            <p class="text-gray-400 text-sm ml-13">
              Visualize e gerencie todos os clientes cadastrados na plataforma
            </p>
          </div>
          <div>
            <button
              @click="handleLogout"
              class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              title="Sair"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6">
          <AdminClientsFilters
            :loading="loading"
            :metrics="getClientsMetrics"
            :status-options="statusOptions"
            @search="handleSearch"
            @status-change="handleStatusChange"
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
          v-if="loading && !hasClients"
          message="Carregando clientes da plataforma..."
        />

        <!-- Empty State -->
        <EmptyState
          v-else-if="showEmptyState"
          :title="hasActiveFilters ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'"
          :message="hasActiveFilters ? 'Tente ajustar os filtros ou a busca' : 'Os clientes aparecerão aqui quando forem cadastrados'"
          icon="users"
          :action-label="hasActiveFilters ? 'Limpar filtros' : undefined"
          @action="handleClearFilters"
        />

        <!-- Table -->
        <AdminClientsTable
          v-else
          :clients="clients"
          @client-click="handleClientClick"
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
        </AdminClientsTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>