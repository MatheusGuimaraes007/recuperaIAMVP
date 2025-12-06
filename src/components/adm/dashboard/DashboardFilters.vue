<script setup>
import Button from '../../../shared/Button.vue';
import Card from '../../../shared/Card.vue';
import { Filter } from 'lucide-vue-next';
import SkeletonFilterBar from "../../../shared/Skeleton/SkeletonFilterBar.vue";

defineProps({
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

        <!-- Active Filter Badge -->
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

      <!-- Custom Date Range -->
      <div v-if="showCustomInputs" class="flex flex-wrap items-center gap-3 mt-4 p-4 rounded-lg border border-border bg-background-card">
        <div class="flex items-center gap-2">
          <label class="text-gray-400 text-sm font-medium">De:</label>
          <input
              type="date"
              :value="customStartDate"
              @input="emit('update:customStartDate', $event.target.value)"
              class="bg-background-base text-white text-sm border border-border rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <span class="text-gray-400">até</span>

        <div class="flex items-center gap-2">
          <label class="text-gray-400 text-sm font-medium">Até:</label>
          <input
              type="date"
              :value="customEndDate"
              @input="emit('update:customEndDate', $event.target.value)"
              class="bg-background-base text-white text-sm border border-border rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <Button variant="primary" size="sm" @click="emit('apply-custom-filter')" :disabled="loading">
          {{ loading ? 'Filtrando...' : 'Aplicar' }}
        </Button>
      </div>
    </template>
  </Card>
</template>