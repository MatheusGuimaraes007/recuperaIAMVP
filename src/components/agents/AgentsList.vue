<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAgents } from '../../composables/useAgents';
import AgentsFilters from './AgentsFilters.vue';
import AgentsTable from './AgentsTable.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import Pagination from '../../shared/Pagination.vue';
import Navbar from '../../shared/Navbar.vue';
import Button from '../../shared/Button.vue';
import { PAGINATION } from '../../utils/constants';

const router = useRouter();

const {
  agents,
  loading,
  error,
  totalCount,
  hasAgents,
  getAgentsMetrics,
  fetchAgents,
  deleteAgent,
  clearAgents,
} = useAgents();

const currentPage = ref(PAGINATION.DEFAULT_PAGE);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
const currentSearch = ref('');

onMounted(async () => {
  await loadAgents();
});

const loadAgents = async (filters = {}) => {
  const filterParams = {
    page: currentPage.value,
    limit: itemsPerPage,
    ...filters
  };

  if (currentSearch.value && currentSearch.value.trim() !== '') {
    filterParams.search = currentSearch.value.trim();
  }

  await fetchAgents(filterParams);
};

const handleSearch = async (searchTerm) => {
  currentPage.value = 1;
  currentSearch.value = searchTerm || '';

  await loadAgents({
    search: searchTerm
  });
};

const handleClearFilters = async () => {
  currentPage.value = 1;
  currentSearch.value = '';

  clearAgents();
  await loadAgents();
};

const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadAgents();
};

const handleCreateAgent = () => {
  router.push('/admin/agentes/novo');
};

const handleEditAgent = (agent) => {
  router.push(`/admin/agentes/${agent.id}/editar`);
};

const handleDeleteAgent = async (agent) => {
  if (!confirm(`Tem certeza que deseja deletar o agente "${agent.name}"?`)) {
    return;
  }

  const result = await deleteAgent(agent.id);

  if (result.success) {
    await loadAgents();
  }
};

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / itemsPerPage);
});

const showEmptyState = computed(() => {
  return !loading.value && !hasAgents.value;
});

const hasActiveFilters = computed(() => {
  return currentSearch.value !== '';
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
            <h1 class="text-3xl font-bold text-white mb-2">
              Gestão de Agentes IA
            </h1>
            <p class="text-gray-400 text-sm">
              Configure e gerencie seus assistentes virtuais
            </p>
          </div>

          <Button
              @click="handleCreateAgent"
              class="flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Novo Agente</span>
          </Button>
        </div>

        <!-- Filtros -->
        <div class="mb-6">
          <AgentsFilters
              :loading="loading"
              :metrics="getAgentsMetrics"
              @search="handleSearch"
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
                class="w-5 h-5 shrink-0 mt-0.5"
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
            v-if="loading && !hasAgents"
            message="Carregando agentes..."
        />

        <!-- Empty State -->
        <EmptyState
            v-else-if="showEmptyState"
            :title="hasActiveFilters ? 'Nenhum agente encontrado' : 'Nenhum agente cadastrado'"
            :message="hasActiveFilters ? 'Tente ajustar os filtros ou a busca' : 'Crie seu primeiro agente IA para começar'"
            icon="robot"
            :action-label="hasActiveFilters ? 'Limpar filtros' : 'Criar Agente'"
            @action="hasActiveFilters ? handleClearFilters() : handleCreateAgent()"
        />

        <!-- Table -->
        <AgentsTable
            v-else
            :agents="agents"
            @agent-click="(agent) => router.push(`/agentes/${agent.id}`)"
            @edit-agent="handleEditAgent"
            @delete-agent="handleDeleteAgent"
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
        </AgentsTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>