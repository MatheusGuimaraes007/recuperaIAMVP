<script setup>
import { ref, watch } from 'vue';
import Button from '../../../shared/Button.vue';
import Card from '../../../shared/Card.vue';
import DatePicker from '../../../shared/DatePicker.vue';
import { Filter } from 'lucide-vue-next';
import SkeletonFilterBar from "../../../shared/Skeleton/SkeletonFilterBar.vue";

const props = defineProps({
  filtersList: {
    type: Array,
    required: true
  },
  selectedFilter: {
    type: String,
    required: true
  },
  filterLabel: {
    type: String,
    default: ''
  },
  showCustomInputs: {
    type: Boolean,
    default: false
  },
  customStartDate: {
    type: String,
    default: ''
  },
  customEndDate: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['apply-filter', 'apply-custom-filter', 'update:customStartDate', 'update:customEndDate']);

const dateRange = ref({
  startDate: props.customStartDate || null,
  endDate: props.customEndDate || null
});

watch(() => [props.customStartDate, props.customEndDate], ([start, end]) => {
  dateRange.value = {
    startDate: start || null,
    endDate: end || null
  };
});

const handleDateRangeApply = (range) => {

  emit('update:customStartDate', range.startDate);
  emit('update:customEndDate', range.endDate);

  emit('apply-custom-filter');
};

const handleDateRangeClear = () => {

  dateRange.value = {
    startDate: null,
    endDate: null
  };

  emit('update:customStartDate', '');
  emit('update:customEndDate', '');
};
</script>

<template>
  <Card padding="lg" class="mb-6">
    <SkeletonFilterBar v-if="loading" :buttonCount="5" />

    <template v-else>
      <div class="flex items-start justify-between mb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <Filter :size="18" class="text-primary" />
            <h3 class="text-lg font-semibold text-white">Filtros de Período</h3>
          </div>
          <p class="text-sm text-gray-400">Selecione um período para visualizar as métricas</p>
        </div>

        <div v-if="filterLabel" class="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <span class="text-primary text-sm font-medium">{{ filterLabel }}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <Button
            v-for="filter in filtersList"
            :key="filter.value"
            :variant="selectedFilter === filter.value ? 'primary' : 'secondary'"
            size="sm"
            @click="emit('apply-filter', filter.value)"
            :disabled="loading"
        >
          {{ filter.label }}
        </Button>
      </div>

      <div
          v-if="showCustomInputs"
          class="mt-4 p-4 rounded-lg border border-border bg-background-card"
      >
        <div class="flex flex-col gap-4">
          <DatePicker
              v-model="dateRange"
              label="Período Personalizado"
              @apply="handleDateRangeApply"
              @clear="handleDateRangeClear"
          />

          <div
              v-if="dateRange.startDate && dateRange.endDate"
              class="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
          >
            <svg
                class="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="text-xs text-gray-300">
              <p class="font-medium text-primary">Período selecionado aplicado</p>
              <p class="mt-0.5 text-gray-400">
                Os dados exibidos correspondem ao intervalo escolhido
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>