<script setup>
import { onMounted, ref, computed, watch } from 'vue'; // Adicionado 'watch'
import Card from '../../../shared/Card.vue';
import ClientCard from './ClientCard.vue';
import Pagination from '../../../shared/Pagination.vue'; // Certifique-se que este caminho está correto
import { Users, Search, X } from 'lucide-vue-next';
import { useDashboardClients } from '../../../composables/useDashboardClients';
import SkeletonText from "../../../shared/Skeleton/SkeletonText.vue";
import SkeletonClientCard from "../../../shared/Skeleton/SkeletonClientCard.vue";
import { PAGINATION } from '../../../utils/constants';

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const {
  localLoading,
  clientsWithGuarantee,
  hasClientsData,
  loadClientsWithGuarantees,
  getDaysRemaining,
  getGuaranteeStatus,
  getProgressColor,
  formatPercent,
  clientStatusConfig,
  formatCurrency
} = useDashboardClients();

const currentPage = ref(1);
const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

const searchQuery = ref('');

const selectedStatus = ref('all');
const selectedConversionFilter = ref('all');

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'trial', label: 'Trial' },
  { value: 'suspended', label: 'Suspensos' },
  { value: 'canceled', label: 'Cancelados' }
];

const conversionOptions = [
  { value: 'all', label: 'Todas conversões' },
  { value: 'low', label: 'Baixa (< 12%)' },
  { value: 'medium', label: 'Média (12% - 25%)' },
  { value: 'high', label: 'Alta (> 25%)' }
];

const filteredClients = computed(() => {
  let filtered = [...clientsWithGuarantee.value];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(client =>
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.cs_name?.toLowerCase().includes(query)
    );
  }

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(client => client.status === selectedStatus.value);
  }

  if (selectedConversionFilter.value !== 'all') {
    filtered = filtered.filter(client => {
      const rate = parseFloat(client.metrics?.conversionRate || 0);

      switch (selectedConversionFilter.value) {
        case 'low':
          return rate < 12;
        case 'medium':
          return rate >= 12 && rate <= 25;
        case 'high':
          return rate > 25;
        default:
          return true;
      }
    });
  }

  return filtered;
});

watch([searchQuery, selectedStatus, selectedConversionFilter], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / itemsPerPage);
});

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredClients.value.slice(start, end);
});

const lowConversionCount = computed(() => {
  return clientsWithGuarantee.value.filter(client =>
      parseFloat(client.metrics?.conversionRate || 0) < 12
  ).length;
});

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearSearch = () => {
  searchQuery.value = '';
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = 'all';
  selectedConversionFilter.value = 'all';
};

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() ||
      selectedStatus.value !== 'all' ||
      selectedConversionFilter.value !== 'all';
});

onMounted(async () => {
  await loadClientsWithGuarantees();
});
</script>

<template>
  <div>
    <Card padding="lg">
      <div class="mb-6">
        <SkeletonText v-if="loading || localLoading" :lines="2" />

        <template v-else>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users :size="20" class="text-primary" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-white">Clientes</h2>
                <p class="text-sm text-gray-400">
                  {{ filteredClients.length }} de {{ clientsWithGuarantee.length }} cliente{{ clientsWithGuarantee.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>

            <div
                v-if="lowConversionCount > 0"
                class="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {{ lowConversionCount }} cliente{{ lowConversionCount !== 1 ? 's' : '' }} com baixa conversão
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mb-4">
            <div class="flex-1 relative">
              <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar por nome, email ou CS..."
                  class="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              />
              <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X :size="18" />
              </button>
            </div>

            <select
                v-model="selectedStatus"
                class="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <select
                v-model="selectedConversionFilter"
                class="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
            >
              <option v-for="option in conversionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <button
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              Limpar
            </button>
          </div>
        </template>
      </div>

      <div v-if="loading || localLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SkeletonClientCard v-for="i in 6" :key="i" />
      </div>

      <div v-else-if="filteredClients.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <ClientCard
              v-for="client in paginatedClients"
              :key="client.id"
              :client="client"
              :get-days-remaining="getDaysRemaining"
              :get-guarantee-status="getGuaranteeStatus"
              :get-progress-color="getProgressColor"
              :format-percent="formatPercent"
              :client-status-config="clientStatusConfig"
              :format-currency="formatCurrency"
          />
        </div>

        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-count="filteredClients.length"
            :items-per-page="itemsPerPage"
            @page-change="handlePageChange"
        />
      </div>

      <div v-else-if="!hasClientsData" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-800 mb-4">
          <Users :size="32" class="text-gray-600" />
        </div>
        <h3 class="text-lg font-medium text-white mb-2">Nenhum cliente encontrado</h3>
        <p class="text-sm text-gray-500">
          Os clientes aparecerão aqui quando cadastrados no sistema
        </p>
      </div>

      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-800 mb-4">
          <Search :size="32" class="text-gray-600" />
        </div>
        <h3 class="text-lg font-medium text-white mb-2">Nenhum resultado encontrado</h3>
        <p class="text-sm text-gray-500 mb-4">
          Tente ajustar os filtros ou buscar por outros termos
        </p>
        <button
            @click="clearFilters"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Limpar filtros
        </button>
      </div>
    </Card>
  </div>
</template>