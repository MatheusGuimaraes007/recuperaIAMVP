<script setup>
import { ref, watch, computed } from 'vue';
import Card from '../../shared/Card.vue';
import Input from '../../shared/Input.vue';
import Button from '../../shared/Button.vue';

const props = defineProps({
  loading: Boolean,
  metrics: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['search', 'clear']);

const searchInput = ref('');
const searchTimeout = ref(null);

const handleSearchInput = (value) => {
  searchInput.value = value;

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    emit('search', searchInput.value);
  }, 500);
};

const handleClear = () => {
  searchInput.value = '';
  emit('clear');
};

watch(() => props.loading, (newVal) => {
  if (newVal && searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});

const hasActiveFilters = computed(() => {
  return searchInput.value !== '';
});
</script>

<template>
  <div class="space-y-6">
    <!-- Métricas Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total de Agentes -->
      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <span class="text-3xl">🤖</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Total de Agentes</p>
            <p class="text-3xl font-bold text-white">{{ metrics.total || 0 }}</p>
          </div>
        </div>
      </Card>

      <!-- Agentes Ativos -->
      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <span class="text-3xl">✅</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Agentes Ativos</p>
            <p class="text-3xl font-bold" style="color: var(--color-text1)">{{ metrics.activeAgents || 0 }}</p>
          </div>
        </div>
      </Card>

      <!-- Tokens Usados -->
      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <span class="text-3xl">⚡</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Tokens Usados</p>
            <p class="text-3xl font-bold text-white">{{ metrics.totalTokens || 0 }}</p>
          </div>
        </div>
      </Card>

      <!-- Custo Total -->
      <Card padding="md" class="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <span class="text-3xl">💰</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-400 mb-1 font-medium">Custo Total (USD)</p>
            <p class="text-3xl font-bold text-white">${{ metrics.totalCost || '0.00' }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Filtros -->
    <Card padding="lg" class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>

      <div class="relative space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white mb-1">Filtros de Busca</h3>
            <p class="text-sm text-gray-400">Encontre agentes rapidamente</p>
          </div>
          <div v-if="hasActiveFilters" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7cba10]/10 border border-[#7cba10]/30">
            <div class="w-2 h-2 rounded-full bg-[#7cba10] animate-pulse"></div>
            <span class="text-sm font-medium" style="color: var(--color-text1)">Filtros Ativos</span>
          </div>
        </div>

        <div class="relative">
          <Input
              :model-value="searchInput"
              @update:model-value="handleSearchInput"
              placeholder="Buscar por nome ou função..."
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

        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t" style="border-color: var(--color-border1)">
          <Button
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

          <div v-if="loading" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-400">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="font-medium">Buscando agentes...</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>