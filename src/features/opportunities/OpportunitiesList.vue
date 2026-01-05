<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Briefcase, Plus, Eye} from 'lucide-vue-next'
import { useListManagement } from "../../composables/lists/useListManagement.js"
import { useOpportunities } from "../../composables/useOpportunities.js"
import {Navbar} from "../../components/organisms/Navigation/index.js";
import Button from "../../components/atoms/Button/Button.vue";
import {BaseFilters} from "../../components/organisms/Filters/index.js";
import {DataTable} from "../../components/organisms/Tables/index.js";
import Pagination from "../../components/atoms/Pagination/Pagination.vue";

const router = useRouter()
const {
  fetchOpportunities,
  getOpportunityMetrics,
  formatOpportunityStatus,
  formatCurrency,
  formatDate,
  getStatusColor
} = useOpportunities()

const {
  items: opportunities,
  loading,
  totalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  isEmpty,
  handleSearch,
  handlePageChange,
  updateFilters,
  clearFilters,
  refresh
} = useListManagement({
  fetchFn: fetchOpportunities,
  itemsPerPage: 12,
  initialFilters: {
    status: 'all',
    period: 'last7days'
  }
})

const metricsArray = computed(() => {
  const metrics = getOpportunityMetrics()

  return [
    {
      label: 'Total Oportunidades',
      value: metrics.total || 0,
      icon: 'briefcase',
      variant: 'blue',
      subtitle: 'Todas as oportunidades'
    },
    {
      label: 'Taxa de Conversão',
      value: `${metrics.conversionRate || 0}%`,
      icon: 'trending-up',
      variant: 'green',
      subtitle: 'Oportunidades ganhas'
    },
    {
      label: 'Valor Total',
      value: formatCurrency(metrics.totalValue || 0),
      icon: 'dollar-sign',
      variant: 'purple',
      subtitle: 'Valor em pipeline'
    },
    {
      label: 'Valor Convertido',
      value: formatCurrency(metrics.convertedValue || 0),
      icon: 'check-circle',
      variant: 'orange',
      subtitle: 'Vendas realizadas'
    }
  ]
})

const filterConfig = {
  searchConfig: {
    enabled: true,
    placeholder: 'Buscar por nome, telefone ou email...',
    debounce: 500
  },
  filterOptions: [
    {
      key: 'status',
      label: 'Status da Oportunidade',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos os Status' },
        { value: 'active', label: 'Ativos' },
        { value: 'won', label: 'Ganhos' },
        { value: 'lost', label: 'Perdidos' },
        { value: 'paused', label: 'Pausados' }
      ]
    },
    {
      key: 'period',
      label: 'Período',
      type: 'select',
      options: [
        { value: 'today', label: 'Hoje' },
        { value: 'last7days', label: 'Últimos 7 dias' },
        { value: 'last30days', label: 'Últimos 30 dias' },
        { value: 'last90days', label: 'Últimos 90 dias' },
        { value: 'all', label: 'Todo o período' }
      ]
    }
  ]
}

const columns = [
  { key: 'contact', label: 'Contato', sortable: true },
  { key: 'agent', label: 'Agente', sortable: false },
  { key: 'product', label: 'Produto', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'opportunity_type', label: 'Tipo', sortable: false },
  { key: 'value', label: 'Valor', sortable: true },
  { key: 'message_count', label: 'Msgs', sortable: true, align: 'center' },
  { key: 'created_at', label: 'Criado em', sortable: true },
  { key: 'actions', label: 'Ações', align: 'right' }
]

// ✅ Handlers
const handleCreateOpportunity = () => router.push('/admin/opportunities/novo')
const handleViewOpportunity = (opp) => router.push(`/admin/opportunities/${opp.id}`)
const handleRowClick = (opp) => router.push(`/admin/opportunities/${opp.id}`)

const handleFilterChange = (key, value) => {
  updateFilters({ [key]: value })
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
              <Briefcase :size="32" class="text-primary" />
              Gestão de Oportunidades
            </h1>
            <p class="text-gray-400 text-sm mt-2">
              Acompanhe suas vendas e conversões
            </p>
          </div>
          <Button variant="primary" @click="handleCreateOpportunity">
            <Plus :size="20" />
            <span>Nova Oportunidade</span>
          </Button>
        </div>

        <!-- ✅ BaseFilters -->
        <BaseFilters
            :loading="loading"
            :metrics="metricsArray"
            :search-config="filterConfig.searchConfig"
            :filter-options="filterConfig.filterOptions"
            @search="handleSearch"
            @filter-change="handleFilterChange"
            @clear="clearFilters"
        />

        <!-- ✅ DataTable -->
        <DataTable
            :data="opportunities"
            :columns="columns"
            :loading="loading"
            :empty-message="isEmpty ? 'Nenhuma oportunidade encontrada' : ''"
            @row-click="handleRowClick"
        >
          <!-- Custom cells -->
          <template #cell-contact="{ row }">
            <div v-if="row.contact">
              <p class="text-white font-semibold">{{ row.contact.name }}</p>
              <p class="text-xs text-gray-400">{{ row.contact.phone }}</p>
            </div>
            <span v-else class="text-gray-500">-</span>
          </template>

          <template #cell-agent="{ row }">
            <div v-if="row.agent" class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {{ row.agent.name?.charAt(0) }}
              </div>
              <span class="text-sm text-white">{{ row.agent.name }}</span>
            </div>
            <span v-else class="text-gray-500">-</span>
          </template>

          <template #cell-product="{ row }">
            <span v-if="row.product" class="text-sm text-white">{{ row.product.name }}</span>
            <span v-else class="text-gray-500">-</span>
          </template>

          <template #cell-status="{ row }">
            <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :style="{
                backgroundColor: `${getStatusColor(row.status)}20`,
                color: getStatusColor(row.status)
              }"
            >
              {{ formatOpportunityStatus(row.status) }}
            </span>
          </template>

          <template #cell-opportunity_type="{ row }">
            <span class="text-sm text-white capitalize">
              {{ row.opportunity_type || '-' }}
            </span>
          </template>

          <template #cell-value="{ row }">
            <div>
              <p class="text-white font-semibold">{{ formatCurrency(row.value) }}</p>
              <p v-if="row.status === 'won' && row.converted_value" class="text-xs text-green-400">
                Convertido: {{ formatCurrency(row.converted_value) }}
              </p>
            </div>
          </template>

          <template #cell-message_count="{ row }">
            <div class="flex items-center justify-center">
              <span class="px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                {{ row.message_count || 0 }}
              </span>
            </div>
          </template>

          <template #cell-created_at="{ row }">
            <span class="text-sm text-gray-400">{{ formatDate(row.created_at) }}</span>
          </template>

          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <button
                  @click.stop="handleViewOpportunity(row)"
                  class="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Ver detalhes"
              >
                <Eye :size="16" />
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