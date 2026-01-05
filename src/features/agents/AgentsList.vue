<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bot, Plus, Edit2, Trash2 } from 'lucide-vue-next'
import {useListManagement} from "../../composables/lists/useListManagement.js";
import {useAgents} from "../../composables/useAgents.js";
import {Navbar} from "../../components/organisms/Navigation/index.js";
import Button from "../../components/atoms/Button/Button.vue";
import {BaseFilters} from "../../components/organisms/Filters/index.js";
import {DataTable} from "../../components/organisms/Tables/index.js";
import Pagination from "../../components/atoms/Pagination/Pagination.vue";


const router = useRouter()
const { fetchAgents, deleteAgent, getAgentsMetrics, formatTokens, getAIModelLabel } = useAgents()

// ✅ Código de lista, paginação, busca agora é 1 linha!
const {
  items: agents,
  loading,
  totalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  isEmpty,
  handleSearch,
  handlePageChange,
  clearFilters,
  refresh
} = useListManagement({
  fetchFn: fetchAgents,
  itemsPerPage: 12
})

// ✅ Métricas formatadas para o BaseFilters
const metricsArray = computed(() => {
  const metrics = getAgentsMetrics.value
  return [
    {
      label: 'Total de Agentes',
      value: metrics.total || 0,
      icon: 'users',
      variant: 'blue'
    },
    {
      label: 'Agentes Ativos',
      value: metrics.activeAgents || 0,
      icon: 'check-circle',
      variant: 'green'
    },
    {
      label: 'Tokens Usados',
      value: formatTokens(metrics.totalTokens || 0),
      icon: 'zap',
      variant: 'purple'
    },
    {
      label: 'Custo Total',
      value: `$${metrics.totalCost || 0}`,
      icon: 'dollar-sign',
      variant: 'orange'
    }
  ]
})

// ✅ Configuração de busca
const searchConfig = {
  enabled: true,
  placeholder: 'Buscar por nome do agente...',
  debounce: 500
}

// ✅ Configuração das colunas da tabela
const columns = [
  { key: 'name', label: 'Agente', sortable: true, icon: Bot },
  { key: 'user.name', label: 'Cliente', sortable: false },
  { key: 'whatsapp_number.status', label: 'WhatsApp', sortable: false },
  { key: 'ai_model', label: 'Modelo IA', sortable: false },
  { key: 'token_used', label: 'Tokens', sortable: true },
  { key: 'created_at', label: 'Criado em', sortable: true },
  { key: 'actions', label: 'Ações', align: 'right' }
]

// ✅ Handlers
const handleCreateAgent = () => router.push('/admin/agents/novo')
const handleEditAgent = (agent) => router.push(`/admin/agents/${agent.id}/editar`)
const handleRowClick = (agent) => router.push(`/admin/agents/${agent.id}`)

const handleDeleteAgent = async (agent) => {
  if (!confirm(`Deletar "${agent.name}"?`)) return
  const result = await deleteAgent(agent.id)
  if (result.success) refresh()
}
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Header -->
        <div class="flex items-center justify-between mb-8 p-6 rounded-xl bg-background-card border border-border">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              <Bot :size="32" class="text-primary" />
              Gestão de Agentes IA
            </h1>
            <p class="text-gray-400 text-sm mt-2">
              Configure e gerencie seus assistentes virtuais
            </p>
          </div>
          <Button variant="primary" @click="handleCreateAgent">
            <Plus :size="20" />
            <span>Novo Agente</span>
          </Button>
        </div>

        <!-- ✅ BaseFilters -->
        <BaseFilters
            :loading="loading"
            :metrics="metricsArray"
            :search-config="searchConfig"
            @search="handleSearch"
            @clear="clearFilters"
        />

        <!-- ✅ DataTable -->
        <DataTable
            :data="agents"
            :columns="columns"
            :loading="loading"
            :empty-message="isEmpty ? 'Nenhum agente encontrado' : ''"
            @row-click="handleRowClick"
        >
          <!-- Custom cells -->
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                {{ row.name?.charAt(0) }}
              </div>
              <div>
                <p class="text-white font-semibold">{{ row.name }}</p>
                <p v-if="row.function" class="text-xs text-gray-400">{{ row.function }}</p>
              </div>
            </div>
          </template>

          <template #cell-user.name="{ row }">
            <span class="text-sm text-white">{{ row.user?.name || '-' }}</span>
          </template>

          <template #cell-whatsapp_number.status="{ row }">
            <span v-if="row.whatsapp_number" class="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
              {{ row.whatsapp_number.display_name }}
            </span>
            <span v-else class="text-sm text-gray-500">-</span>
          </template>

          <template #cell-ai_model="{ row }">
            <span class="text-sm text-white">{{ getAIModelLabel(row.ai_model) }}</span>
          </template>

          <template #cell-token_used="{ row }">
            <span class="text-sm text-white">{{ formatTokens(row.token_used) }}</span>
          </template>

          <template #cell-created_at="{ row }">
            <span class="text-sm text-gray-400">{{ new Date(row.created_at).toLocaleDateString() }}</span>
          </template>

          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <button
                  @click.stop="handleEditAgent(row)"
                  class="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              >
                <Edit2 :size="16" />
              </button>
              <button
                  @click.stop="handleDeleteAgent(row)"
                  class="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </template>

          <!-- Pagination -->
          <template #footer>
            <Pagination
                v-if="!isEmpty"
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-count="totalCount"
                :items-per-page="itemsPerPage"
                @page-change="handlePageChange"
            />
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>