<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useClients } from '../../composables/useClients';
import ClientesFilters from './ClientesFilters.vue';
import ClientesTable from './ClientesTable.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import Pagination from '../../shared/Pagination.vue';
import Navbar from '../../shared/Navbar.vue';
import { PAGINATION } from '../../utils/constants';

const { logout } = useAuth();
const router = useRouter();

const {
  contacts,
  loading,
  error,
  totalCount,
  hasContacts,
  getContactMetrics,
  statusOptions,
  fetchContacts,
  clearContacts
} = useClients();

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
const currentStatus = ref('all');
const currentSearch = ref('');

onMounted(async () => {
  await loadContacts();
});

const loadContacts = async (filters = {}) => {
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

  await fetchContacts(filterParams);
};

const handleSearch = async (filters) => {
  currentPage.value = 1;
  currentSearch.value = filters.search || '';
  currentStatus.value = filters.status || 'all';

  await loadContacts({
    search: filters.search,
    status: filters.status
  });
};

const handleStatusChange = async (status) => {
  currentStatus.value = status;
  currentPage.value = 1;

  await loadContacts({
    status: status !== 'all' ? status : null,
    search: currentSearch.value
  });
};

const handleClearFilters = async () => {
  currentPage.value = 1;
  currentStatus.value = 'all';
  currentSearch.value = '';

  clearContacts();
  await loadContacts();
};

const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadContacts();
};

const handleContactClick = (contact) => {
  router.push(`/clientes/${contact.id}`);
};

const handleStatusChangeForContact = async ({ contactId, newStatus }) => {
  console.log('Change status:', contactId, newStatus);
};

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / itemsPerPage);
});

const showEmptyState = computed(() => {
  return !loading.value && !hasContacts.value;
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
        <div class="mb-8 flex items-center justify-between p-6 rounded-lg"
             style="background-color: var(--color-background4); border: 1px solid var(--color-border1)">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">
              Contatos
            </h1>
            <p class="text-gray-400 text-sm">
              Visualize e gerencie todos os seus contatos
            </p>
          </div>
        </div>

        <div class="mb-6">
          <ClientesFilters
            :loading="loading"
            :metrics="getContactMetrics"
            :status-options="statusOptions"
            @search="handleSearch"
            @status-change="handleStatusChange"
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
          v-if="loading && !hasContacts"
          message="Carregando contatos..."
        />

        <EmptyState
          v-else-if="showEmptyState"
          :title="hasActiveFilters ? 'Nenhum contato encontrado' : 'Nenhum contato cadastrado'"
          :message="hasActiveFilters ? 'Tente ajustar os filtros ou a busca' : 'Seus contatos aparecerão aqui quando forem criados'"
          icon="users"
          :action-label="hasActiveFilters ? 'Limpar filtros' : undefined"
          @action="handleClearFilters"
        />

        <ClientesTable
          v-else
          :contacts="contacts"
          @contact-click="handleContactClick"
          @status-change="handleStatusChangeForContact"
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
        </ClientesTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>