<script setup>
import { ref, watch, computed } from 'vue';
import { STATUS_OPTIONS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import Input from "../../shared/Input.vue";
import Button from "../../shared/Button.vue";
import DatePicker from "../../shared/DatePicker.vue";
import MetricCard from "../../shared/MetricCard.vue"; // ✅ Novo Import

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
const customDateRange = ref({ startDate: null, endDate: null });
let searchTimeout = null;

const periodOptions = [
  { value: 'last7days', label: 'Últimos 7 dias' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
  { value: 'all', label: 'Desde o início' }
];

watch(searchTerm, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emit('search', {
      search: newValue.trim(),
      status: selectedStatus.value !== 'all' ? selectedStatus.value : null
    });
  }, 500);
});

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

const handleDateRangeApply = (dates) => emit('date-range-change', dates);

const handleClear = () => {
  searchTerm.value = '';
  selectedStatus.value = 'all';
  selectedPeriod.value = 'last7days';
  customDateRange.value = { startDate: null, endDate: null };
  emit('clear');
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
          class="px-4 py-2 rounded-lg border transition-all text-sm font-medium disabled:opacity-50"
          :class="selectedPeriod === period.value
          ? 'bg-primary text-background-base border-primary'
          : 'border-gray-700 text-gray-400 hover:border-gray-600'"
      >
        {{ period.label }}
      </button>

      <div class="w-64">
        <DatePicker
            v-model="customDateRange"
            label="Período Personalizado"
            :disabled="loading"
            @apply="handleDateRangeApply"
            @clear="() => handlePeriodChange('last7days')"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
          label="Oportunidades"
          :value="metrics.total"
          icon="layers"
          variant="blue"
          :loading="loading"
      />
      <MetricCard
          label="Convertidas"
          :value="metrics.won"
          icon="check-circle"
          variant="green"
          :loading="loading"
      />
      <MetricCard
          label="Taxa Conversão"
          :value="metrics.conversionRate"
          icon="percent"
          variant="purple"
          :loading="loading"
          :trend="{ value: metrics.conversionRate, direction: metrics.conversionRate > 0 ? 'up' : 'down' }"
      />
      <MetricCard
          label="Valor Total"
          :value="metrics.totalValue"
          icon="dollar-sign"
          variant="blue"
          :loading="loading"
      />
      <MetricCard
          label="Valor Convertido"
          :value="metrics.convertedValue"
          icon="dollar-sign"
          variant="green"
          :loading="loading"
      />
      <MetricCard
          label="ROI"
          :value="`${metrics.roi}%`"
          icon="trending-up"
          variant="orange"
          :loading="loading"
      />
      <MetricCard
          label="Média Mensagens"
          :value="metrics.averageMessages"
          icon="message-circle"
          variant="purple"
          :loading="loading"
      />
      <MetricCard
          label="Tempo Médio"
          :value="metrics.averageTime"
          icon="clock"
          variant="orange"
          :loading="loading"
      />
    </div>

    <Card padding="md">
      <div class="mb-4">
        <Input
            v-model="searchTerm"
            placeholder="Buscar por nome, telefone ou email..."
            icon="search"
            :disabled="loading"
        />
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <button
            v-for="status in STATUS_OPTIONS"
            :key="status.value"
            @click="handleStatusFilter(status.value)"
            :disabled="loading"
            class="px-4 py-2 rounded-lg border transition-all text-sm font-medium disabled:opacity-50"
            :class="selectedStatus === status.value
            ? 'border-primary text-primary bg-primary/10'
            : 'border-gray-700 text-gray-400 hover:border-gray-600'"
        >
          {{ status.label }}
        </button>
      </div>

      <div class="flex gap-2">
        <Button variant="secondary" :disabled="loading" @click="handleClear">
          Limpar filtros
        </Button>
      </div>
    </Card>
  </div>
</template>