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
import { Bot, Plus, AlertCircle } from 'lucide-vue-next';

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
  router.push('/agentes/novo');
};

const handleEditAgent = (agent) => {
  router.push(`/agentes/${agent.id}/editar`);
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
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Bot :size="24" class="text-white" />
                </div>
                <h1 class="text-3xl font-bold text-white">
                  Gestão de Agentes IA
                </h1>
              </div>
              <p class="text-gray-400 text-sm ml-15">
                Configure e gerencie seus assistentes virtuais
              </p>
            </div>

            <Button
                @click="handleCreateAgent"
                variant="primary"
                class="flex items-center gap-2"
            >
              <Plus :size="20" />
              <span>Novo Agente</span>
            </Button>
          </div>
        </Card>

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
            v-if="loading && !hasAgents"
            message="Carregando agentes..."
        />

        <!-- Empty State -->
        <EmptyState
            v-else-if="showEmptyState"
            :title="hasActiveFilters ? 'Nenhum agente encontrado' : 'Nenhum agente cadastrado'"
            :message="hasActiveFilters ? 'Tente ajustar os filtros ou a busca' : 'Crie seu primeiro agente IA para começar'"
            icon="bot"
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