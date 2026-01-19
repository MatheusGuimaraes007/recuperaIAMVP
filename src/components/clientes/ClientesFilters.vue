<script setup>
import { ref, watch } from 'vue'
import Card from '../../shared/Card.vue'
import Input from '../../shared/Input.vue'
import Button from '../../shared/Button.vue'
import MetricCard from '../../shared/MetricCard.vue'
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  loading: Boolean,
  metrics: {
    type: Object,
    default: () => ({})
  },
  statusOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search', 'status-change', 'clear'])

const searchInput = ref('')
const selectedStatus = ref('all')
const searchTimeout = ref(null)

const handleSearchInput = (value) => {
  searchInput.value = value

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    emit('search', {
      search: searchInput.value,
      status: selectedStatus.value
    })
  }, 500)
}

const handleStatusChange = (status) => {
  selectedStatus.value = status
  emit('status-change', status)
}

const handleClear = () => {
  searchInput.value = ''
  selectedStatus.value = 'all'
  emit('clear')
}

watch(() => props.loading, (newVal) => {
  if (newVal && searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

const hasActiveFilters = () => {
  return searchInput.value !== '' || selectedStatus.value !== 'all'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Métricas removidas para versão cliente (exibimos só filtros/listagem) -->

    <!-- Filtros -->
    <Card padding="lg" class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div class="relative space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white mb-1">Filtros de Busca</h3>
            <p class="text-sm text-gray-400">Encontre contatos rapidamente usando os filtros abaixo</p>
          </div>
          <div v-if="hasActiveFilters()" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-100 border border-primary-300">
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span class="text-sm font-medium text-primary">Filtros Ativos</span>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <Input
              :model-value="searchInput"
              @update:model-value="handleSearchInput"
              placeholder="Buscar por nome, telefone ou email..."
              icon="search"
              :disabled="loading"
          />

          <div class="flex items-center gap-2 mt-2 text-xs">
            <AlertCircle :size="16" class="text-gray-500" />
            <p class="text-gray-500">
              A busca é feita automaticamente enquanto você digita
            </p>
          </div>
        </div>

        <!-- Status Filters -->
        <div>
          <label class="text-sm font-semibold text-gray-300 mb-3 block">Filtrar por Status</label>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="option in statusOptions"
                :key="option.value"
                @click="handleStatusChange(option.value)"
                :disabled="loading"
                class="group relative px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                :class="selectedStatus === option.value
                ? 'border-primary text-white bg-primary-200 shadow-lg'
                : 'border-border-card text-gray-400 hover:border-gray-600 hover:text-gray-300 bg-gray-800/30'"
            >
              <div v-if="selectedStatus === option.value" class="absolute inset-0 rounded-xl bg-primary-200 blur-xl"></div>
              <span class="relative flex items-center gap-2">
                <span>{{ option.label }}</span>
                <span v-if="selectedStatus === option.value" class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-background-base">
                  ✓
                </span>
              </span>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
              variant="secondary"
              :disabled="loading || !hasActiveFilters()"
              @click="handleClear"
              class="flex items-center justify-center gap-2 group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Limpar Filtros</span>
          </Button>

          <div v-if="loading" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-400">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="font-medium">Buscando contatos...</span>
          </div>

          <div v-else-if="!loading && hasActiveFilters()" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-success-light border border-status-success-border text-sm text-status-success">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">Filtros aplicados</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>