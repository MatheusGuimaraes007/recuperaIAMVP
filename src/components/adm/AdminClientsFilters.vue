<script setup>
import { ref, watch } from 'vue';
import Card from '../../shared/Card.vue';
import Input from '../../shared/Input.vue';
import Button from '../../shared/Button.vue';
import { formatCurrency } from '../../utils/formatters';

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
});

const emit = defineEmits(['search', 'status-change', 'clear']);

const searchInput = ref('');
const selectedStatus = ref('all');
const searchTimeout = ref(null);

const handleSearchInput = (value) => {
  searchInput.value = value;
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    emit('search', {
      search: searchInput.value,
      status: selectedStatus.value
    });
  }, 500);
};

const handleStatusChange = (status) => {
  selectedStatus.value = status;
  emit('status-change', status);
};

const handleClear = () => {
  searchInput.value = '';
  selectedStatus.value = 'all';
  emit('clear');
};

watch(() => props.loading, (newVal) => {
  if (newVal && searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});

const hasActiveFilters = () => {
  return searchInput.value !== '' || selectedStatus.value !== 'all';
};
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Total de Clientes</p>
            <p class="text-3xl font-bold text-white">{{ metrics.total || 0 }}</p>
          </div>
        </div>
      </Card>

      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Clientes Ativos</p>
            <p class="text-3xl font-bold" style="color: var(--color-text1)">{{ metrics.active || 0 }}</p>
          </div>
        </div>
      </Card>

      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Total Recuperado</p>
            <p class="text-2xl font-bold text-white">{{ formatCurrency(metrics.totalRecovered || 0) }}</p>
          </div>
        </div>
      </Card>

      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
              <path d="m16 15-3-3 3-3"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Total Oportunidades</p>
            <p class="text-3xl font-bold text-white">{{ metrics.totalOpportunities || 0 }}</p>
          </div>
        </div>
      </Card>
    </div>

    <Card padding="lg" class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>

      <div class="relative space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white mb-1">Filtros de Busca</h3>
            <p class="text-sm text-gray-400">Encontre clientes rapidamente usando os filtros abaixo</p>
          </div>
          <div v-if="hasActiveFilters()" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7cba10]/10 border border-[#7cba10]/30">
            <div class="w-2 h-2 rounded-full bg-[#7cba10] animate-pulse"></div>
            <span class="text-sm font-medium" style="color: var(--color-text1)">Filtros Ativos</span>
          </div>
        </div>

        <div class="relative">
          <div class="relative">
            <Input
              :model-value="searchInput"
              @update:model-value="handleSearchInput"
              placeholder="Buscar por nome ou email..."
              icon="search"
              :disabled="loading"
              class="pr-24"
            />
            <div v-if="loading && searchInput" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2 text-xs">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500">
              A busca é feita automaticamente enquanto você digita
            </p>
          </div>
        </div>

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
                ? 'border-[#7cba10] text-white bg-[#7cba10]/20 shadow-lg'
                : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 bg-gray-800/30'"
            >
              <div v-if="selectedStatus === option.value" class="absolute inset-0 rounded-xl bg-[#7cba10]/20 blur-xl"></div>
              <span class="relative flex items-center gap-2">
                <span>{{ option.label }}</span>
                <span v-if="selectedStatus === option.value" class="px-2 py-0.5 rounded-full text-xs font-bold bg-[#7cba10] text-white">
                  ✓
                </span>
              </span>
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t" style="border-color: var(--color-border1)">
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
            <span class="font-medium">Buscando clientes...</span>
          </div>

          <div v-else-if="!loading && hasActiveFilters()" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
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

button {
  transition: all 0.2s ease-in-out;
}
</style>