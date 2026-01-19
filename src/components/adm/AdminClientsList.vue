<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useAdminClients } from "../../composables/useAdminClients.js";

import AdminClientsFilters from './AdminClientsFilters.vue';
import AdminClientsTable from './AdminClientsTable.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import Pagination from '../../shared/Pagination.vue';
import Navbar from '../../shared/Navbar.vue';
import { PAGINATION } from '../../utils/constants';
import { Users, AlertCircle } from 'lucide-vue-next';

const { logout, isAdmin } = useAuth();
const router = useRouter();

const {
  clients,
  loading,
  error,
  totalCount,
  hasClients,
  platformCardsMetrics,
  statusOptions,
  fetchPlatformClients,
  fetchPlatformStats,
  clearClients
} = useAdminClients();

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
const currentStatus = ref('all');
const currentSearch = ref('');

onMounted(async () => {
  if (!isAdmin.value) {
    router.push('/clientes');
    return;
  }
  await Promise.all([
    loadClients(),
    fetchPlatformStats()
  ]);
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
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Header -->
        <Card padding="lg" class="mb-8 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:40px_40px]"></div>
          </div>

          <div class="relative flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Users :size="24" class="text-white" />
                </div>
                <h1 class="text-3xl font-bold text-white">
                  Gestão de Clientes da Plataforma
                </h1>
              </div>
              <p class="text-gray-400 text-sm ml-15">
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
        </Card>

        <!-- Filters -->
        <div class="mb-6">
          <AdminClientsFilters
              :loading="loading"
              :metrics="platformCardsMetrics"
              :status-options="statusOptions"
              @search="handleSearch"
              @status-change="handleStatusChange"
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