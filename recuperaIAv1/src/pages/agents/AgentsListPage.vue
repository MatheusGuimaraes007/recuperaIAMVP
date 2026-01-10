<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAgents as useAgentsComposable } from '@/composables/data/useAgents'

// Templates & Organisms
import RListTemplate from '@/components/templates/sections/RListTemplate.vue'
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'
import RAgentsTable from '@/components/organisms/tables/RAgentsTable.vue'
import RConfirmDialog from '@/components/organisms/modals/RConfirmDialog.vue'

// Molecules
import RStatCard from '@/components/molecules/cards/RStatCard.vue'
import RSearchFilter from '@/components/molecules/filters/RSearchFilter.vue'
import RFilterChips from '@/components/molecules/filters/RFilterChips.vue'
import RPagination from '@/components/molecules/navigation/RPagination.vue'

// Atoms
import RButton from '@/components/atoms/buttons/RButton.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'
import REmptyState from '@/components/molecules/feedback/REmptyState.vue'

const router = useRouter()

// Composable
const {
  useAgentsQuery,
  useDeleteAgent,
  calculateAggregatedMetrics
} = useAgentsComposable()

// Estado local
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const agentToDelete = ref(null)
const showDeleteDialog = ref(false)

// Filtros computados
const filters = computed(() => ({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchQuery.value || undefined
}))

// Queries
const { data: agentsData, isLoading } = useAgentsQuery(filters)
const deleteMutation = useDeleteAgent()

// Dados computados
const agents = computed(() => agentsData.value || [])
const metrics = computed(() => calculateAggregatedMetrics(agents.value))

// Breadcrumb
const breadcrumb = [
  { label: 'Admin', to: '/admin/dashboard' },
  { label: 'Agentes IA', to: '/admin/agents' }
]

// Handlers
const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleClearFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleCreate = () => {
  router.push('/admin/agents/novo')
}

const handleEdit = (agent) => {
  router.push(`/admin/agents/${agent.id}/editar`)
}

const handleDeleteClick = (agent) => {
  agentToDelete.value = agent
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  if (!agentToDelete.value) return

  await deleteMutation.mutateAsync(agentToDelete.value.id)

  showDeleteDialog.value = false
  agentToDelete.value = null
}

const handleDeleteCancel = () => {
  showDeleteDialog.value = false
  agentToDelete.value = null
}

// Chips de filtros ativos
const activeFilters = computed(() => {
  const chips = []
  if (searchQuery.value) {
    chips.push({
      label: `Busca: ${searchQuery.value}`,
      onRemove: () => { searchQuery.value = '' }
    })
  }
  return chips
})
</script>

<template>
  <RListTemplate
    title="Agentes de IA"
    subtitle="Gerencie seus assistentes virtuais e configurações"
    :breadcrumb="breadcrumb"
    :loading="isLoading"
  >
    <!-- Header Actions -->
    <template #header-actions>
      <RButton
        variant="primary"
        icon-left="plus"
        @click="handleCreate"
      >
        Novo Agente
      </RButton>
    </template>

    <!-- Métricas -->
    <template #metrics>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RStatCard
          label="Total de Agentes"
          :value="metrics.total"
          icon="bot"
          color="blue"
        />
        <RStatCard
          label="Agentes Ativos"
          :value="metrics.active"
          icon="check-circle"
          color="green"
        />
        <RStatCard
          label="Com WhatsApp"
          :value="metrics.withWhatsApp"
          icon="smartphone"
          color="purple"
        />
      </div>
    </template>

    <!-- Filtros -->
    <template #filters>
      <div class="space-y-4">
        <RSearchFilter
          v-model="searchQuery"
          placeholder="Buscar por nome, função ou modelo..."
          @search="handleSearch"
        />

        <RFilterChips
          v-if="activeFilters.length > 0"
          :chips="activeFilters"
          @clear-all="handleClearFilters"
        />
      </div>
    </template>

    <!-- Loading State -->
    <RLoadingState v-if="isLoading && !agents.length" message="Carregando agentes..." />

    <!-- Empty State -->
    <REmptyState
      v-else-if="!isLoading && !agents.length"
      title="Nenhum agente encontrado"
      :message="searchQuery ? 'Tente ajustar os filtros' : 'Crie seu primeiro agente IA'"
      icon="bot"
      :action-label="searchQuery ? 'Limpar filtros' : 'Criar Agente'"
      @action="searchQuery ? handleClearFilters() : handleCreate()"
    />

    <!-- Tabela -->
    <template v-else>
      <RAgentsTable
        :agents="agents"
        :loading="isLoading"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />

      <!-- Paginação -->
      <div class="mt-6">
        <RPagination
          :current-page="currentPage"
          :total-pages="Math.ceil(metrics.total / pageSize)"
          @update:current-page="handlePageChange"
        />
      </div>
    </template>

    <!-- Dialog de Confirmação -->
    <RConfirmDialog
      v-model="showDeleteDialog"
      title="Deletar Agente"
      :message="`Tem certeza que deseja deletar o agente '${agentToDelete?.name}'?`"
      confirm-text="Deletar"
      cancel-text="Cancelar"
      variant="danger"
      :loading="deleteMutation.isPending.value"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </RListTemplate>
</template>