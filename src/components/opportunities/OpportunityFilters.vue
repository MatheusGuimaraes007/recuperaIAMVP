<script setup>
import { ref, computed, watch } from 'vue';
import { STATUS_OPTIONS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import Input from "../../shared/Input.vue";
import Button from "../../shared/Button.vue";
import DatePicker from "../../shared/DatePicker.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  metrics: {
    type: Object,
    default: () => ({
      total: 0,
      won: 0,
      conversionRate: 0,
      totalValue: 0,
      convertedValue: 0,
      roi: 0,
      averageMessages: 0,
      averageTime: '0min'
    })
  }
});

const emit = defineEmits(['search', 'clear', 'status-change', 'period-change', 'date-range-change']);

const searchTerm = ref('');
const selectedStatus = ref('all');
const selectedPeriod = ref('last7days');
const customDateRange = ref({
  startDate: null,
  endDate: null
});

let searchTimeout = null;

const periodOptions = [
  { value: 'last7days', label: 'Últimos 7 dias' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
  { value: 'all', label: 'Desde o início' }
];

const isCustomPeriod = computed(() => selectedPeriod.value === 'custom');

watch(searchTerm, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    if (newValue.trim() !== '' || newValue === '') {
      handleSearch();
    }
  }, 500);
});

const handleSearch = () => {
  emit('search', {
    search: searchTerm.value.trim(),
    status: selectedStatus.value !== 'all' ? selectedStatus.value : null
  });
};

const handleStatusFilter = (status) => {
  selectedStatus.value = status;
  emit('status-change', status);
};

const handlePeriodChange = (period) => {
  selectedPeriod.value = period;
  
  if (period !== 'custom') {
    customDateRange.value = { startDate: null, endDate: null };
    emit('period-change', period);
  }
};

const handleDateRangeApply = (dates) => {
  emit('date-range-change', dates);
};

const handleDateRangeClear = () => {
  selectedPeriod.value = 'last7days';
  emit('period-change', 'last7days');
};

const handleClear = () => {
  searchTerm.value = '';
  selectedStatus.value = 'all';
  selectedPeriod.value = 'last7days';
  customDateRange.value = { startDate: null, endDate: null };
  
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  emit('clear');
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="period in periodOptions"
        :key="period.value"
        @click="handlePeriodChange(period.value)"
        :disabled="loading"
        class="px-4 py-2 rounded-lg border transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        :class="selectedPeriod === period.value
          ? 'text-white'
          : 'border-gray-700 text-gray-400 hover:border-gray-600'"
        :style="selectedPeriod === period.value ? 'background-color: var(--color-text1); border-color: var(--color-text1)' : ''"
      >
        {{ period.label }}
      </button>
      
      <div class="w-64">
        <DatePicker
          v-model="customDateRange"
          label="Período Personalizado"
          :disabled="loading"
          @apply="handleDateRangeApply"
          @clear="handleDateRangeClear"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Oportunidades</p>
          <p class="text-3xl font-bold text-white">{{ metrics.total }}</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Oportunidades Convertidas</p>
          <p class="text-3xl font-bold" style="color: var(--color-text1)">{{ metrics.won }}</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Taxa de Conversão</p>
          <p class="text-3xl font-bold text-white">{{ metrics.conversionRate }}%</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Valor das Oportunidades</p>
          <p class="text-3xl font-bold text-white">{{ formatCurrency(metrics.totalValue) }}</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Valor Convertido</p>
          <p class="text-3xl font-bold" style="color: var(--color-text1)">{{ formatCurrency(metrics.convertedValue) }}</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">ROI</p>
          <p class="text-3xl font-bold text-white">{{ metrics.roi }}%</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Média de Mensagens (Conversões)</p>
          <p class="text-3xl font-bold text-white">{{ metrics.averageMessages }}</p>
        </div>
      </Card>

      <Card padding="md" class="border-gray-700">
        <div>
          <p class="text-sm text-gray-400 mb-2">Tempo Médio até Conversão</p>
          <p class="text-3xl font-bold text-white">{{ metrics.averageTime }}</p>
        </div>
      </Card>
    </div>

    <Card padding="md">
      <div class="mb-4">
        <Input
          v-model="searchTerm"
          placeholder="Buscar por nome, telefone ou email do contato..."
          icon="search"
          :disabled="loading"
        />
        <p class="text-xs text-gray-500 mt-1">
          A busca é feita automaticamente enquanto você digita
        </p>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="status in STATUS_OPTIONS"
          :key="status.value"
          @click="handleStatusFilter(status.value)"
          :disabled="loading"
          class="px-4 py-2 rounded-lg border transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          :class="selectedStatus === status.value
            ? 'border-[#7cba10] text-[#7cba10] bg-[#7cba10]/10'
            : 'border-gray-700 text-gray-400 hover:border-gray-600'"
        >
          {{ status.label }}
        </button>
      </div>

      <div class="flex gap-2">
        <Button
          variant="secondary"
          :disabled="loading"
          @click="handleClear"
        >
          Limpar filtros
        </Button>
        
        <div v-if="loading" class="flex items-center text-sm text-gray-400 ml-2">
          <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Carregando...
        </div>
      </div>
    </Card>
  </div>
</template>