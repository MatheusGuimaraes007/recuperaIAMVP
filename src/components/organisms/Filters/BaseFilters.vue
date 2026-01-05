<script setup>
import { ref, computed, watch } from 'vue'

import { AlertCircle, Search, X } from 'lucide-vue-next'
import MetricCard from "../../molecules/Cards/MetricCard.vue";
import Card from "../../atoms/Card/Card.vue";
import Button from "../../atoms/Button/Button.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  metrics: {
    type: Array,
    default: () => []
  },

  searchConfig: {
    type: Object,
    default: () => ({
      enabled: true,
      placeholder: 'Buscar...',
      debounce: 500
    })
  },

  filterOptions: {
    type: Array,
    default: () => []
  },

  initialFilters: {
    type: Object,
    default: () => ({})
  },

  showClearButton: {
    type: Boolean,
    default: true
  },

  title: {
    type: String,
    default: 'Filtros de Busca'
  },

  subtitle: {
    type: String,
    default: 'Encontre itens rapidamente usando os filtros abaixo'
  }
})

const emit = defineEmits(['search', 'filter-change', 'filters-change', 'clear'])

const searchInput = ref('')
const selectedFilters = ref({ ...props.initialFilters })
const searchTimeout = ref(null)

const hasActiveFilters = computed(() => {
  const hasSearch = searchInput.value.trim() !== ''
  const hasFilters = Object.keys(selectedFilters.value).some(key => {
    const value = selectedFilters.value[key]
    return value !== null && value !== undefined && value !== '' && value !== 'all'
  })
  return hasSearch || hasFilters
})


/**
 * Handle search input with debounce
 */
const handleSearchInput = (value) => {
  searchInput.value = value

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    emit('search', searchInput.value)
  }, props.searchConfig.debounce)
}

/**
 * Clear search
 */
const clearSearch = () => {
  searchInput.value = ''
  emit('search', '')
}

/**
 * Handle single filter change
 */
const handleFilterChange = (filterKey, value) => {
  selectedFilters.value = {
    ...selectedFilters.value,
    [filterKey]: value
  }
  emit('filter-change', filterKey, value)
  emit('filters-change', selectedFilters.value)
}

/**
 * Clear all filters
 */
const handleClear = () => {
  searchInput.value = ''
  selectedFilters.value = { ...props.initialFilters }
  emit('clear')
}

/**
 * Get filter component type
 */
const getFilterType = (filter) => {
  return filter.type || 'select'
}

watch(() => props.loading, (newVal) => {
  if (newVal && searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

watch(() => props.initialFilters, (newVal) => {
  selectedFilters.value = { ...newVal }
}, { deep: true })
</script>

<template>
  <div class="space-y-6">
    <div
        v-if="metrics && metrics.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <MetricCard
          v-for="metric in metrics"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :icon="metric.icon"
          :variant="metric.variant"
          :loading="loading"
          :trend="metric.trend"
          :subtitle="metric.subtitle"
      />
    </div>

    <Card padding="lg" class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div class="relative space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white mb-1">{{ title }}</h3>
            <p class="text-sm text-gray-400">{{ subtitle }}</p>
          </div>

          <div
              v-if="hasActiveFilters"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20"
          >
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span class="text-sm font-medium text-primary">Filtros Ativos</span>
          </div>
        </div>

        <div v-if="searchConfig.enabled" class="relative">
          <div class="relative">
            <Search
                :size="18"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
                v-model="searchInput"
                type="text"
                :placeholder="searchConfig.placeholder"
                :disabled="loading"
                @input="handleSearchInput($event.target.value)"
                class="w-full pl-10 pr-10 py-2.5 bg-background-base border border-border rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                v-if="searchInput"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X :size="18" />
            </button>
          </div>

          <div class="flex items-center gap-2 mt-2 text-xs">
            <AlertCircle :size="16" class="text-gray-500" />
            <p class="text-gray-500">
              A busca é feita automaticamente enquanto você digita
            </p>
          </div>
        </div>

        <div v-if="filterOptions && filterOptions.length > 0" class="space-y-4">
          <div
              v-for="filter in filterOptions"
              :key="filter.key"
          >
            <div v-if="getFilterType(filter) === 'select'">
              <label class="text-sm font-semibold text-gray-300 mb-3 block">
                {{ filter.label }}
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                    v-for="option in filter.options"
                    :key="option.value"
                    @click="handleFilterChange(filter.key, option.value)"
                    :disabled="loading"
                    class="group relative px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    :class="selectedFilters[filter.key] === option.value
                    ? 'border-primary text-white bg-primary/20 shadow-lg'
                    : 'border-border text-gray-400 hover:border-gray-600 hover:text-gray-300 bg-background-base/30'"
                >
                  <div
                      v-if="selectedFilters[filter.key] === option.value"
                      class="absolute inset-0 rounded-xl bg-primary/20 blur-xl"
                  ></div>
                  <span class="relative flex items-center gap-2">
                    <span>{{ option.label }}</span>
                    <span
                        v-if="selectedFilters[filter.key] === option.value"
                        class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-background-base"
                    >
                      ✓
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div v-else-if="getFilterType(filter) === 'dropdown'">
              <label class="text-sm font-semibold text-gray-300 mb-3 block">
                {{ filter.label }}
              </label>
              <select
                  v-model="selectedFilters[filter.key]"
                  @change="handleFilterChange(filter.key, selectedFilters[filter.key])"
                  :disabled="loading"
                  class="w-full px-4 py-2.5 bg-background-base border border-border rounded-lg text-white focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option
                    v-for="option in filter.options"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
              v-if="showClearButton"
              variant="secondary"
              :disabled="loading || !hasActiveFilters"
              @click="handleClear"
              class="flex items-center justify-center gap-2 group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Limpar Filtros</span>
          </Button>

          <div
              v-if="loading"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-base/50 border border-border text-sm text-gray-400"
          >
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="font-medium">Buscando...</span>
          </div>

          <div
              v-else-if="!loading && hasActiveFilters"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-success/10 border border-status-success/20 text-sm text-status-success"
          >
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

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
