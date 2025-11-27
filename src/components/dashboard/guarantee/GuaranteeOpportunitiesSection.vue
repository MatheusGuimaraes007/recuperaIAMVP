<script setup>
import { computed, watch, ref } from 'vue';
import { useGuaranteeOpportunities } from '../../../composables/useGuaranteeOpportunities.js';
import { formatCurrency } from '../../../utils/formatters';
import SectionHeader from '../../../shared/SectionHeader.vue';
import { CheckCircle, AlertTriangle, Layers, DollarSign } from 'lucide-vue-next';

const props = defineProps({
  guarantee: { type: Object, required: true }
});

const { loading, error, opportunitiesMetrics, fetchGuaranteeMetrics } = useGuaranteeOpportunities();
const isInitialized = ref(false);

watch(() => props.guarantee?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await fetchGuaranteeMetrics(newId);
    isInitialized.value = true;
  }
}, { immediate: true });

const minimumRequired = computed(() => {
  const goal = parseFloat(props.guarantee.goal_amount || 0);
  return goal * 10;
});

const meetsMinimum = computed(() => opportunitiesMetrics.value.totalValue >= minimumRequired.value);

const percentageOfMinimum = computed(() => {
  if (minimumRequired.value === 0) return 0;
  return Math.round((opportunitiesMetrics.value.totalValue / minimumRequired.value) * 100);
});
</script>

<template>
  <div class="p-6 border-t border-primary/10 bg-black/20">
    <SectionHeader
        title="Oportunidades"
        icon="briefcase"
        variant="default"
    />

    <div v-if="loading" class="flex items-center justify-center gap-3 p-8 text-gray-400">
      <div class="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <span>Carregando métricas...</span>
    </div>

    <div v-else-if="error" class="flex items-center justify-center gap-3 p-6 bg-status-error/5 border border-status-error/20 rounded-xl text-status-error">
      <AlertTriangle :size="20" />
      <span>{{ error }}</span>
    </div>

    <template v-else>
      <div class="grid gap-3 mb-4">
        <div class="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <div class="w-10 h-10 bg-metric-purple/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <Layers :size="20" class="text-metric-purple" />
          </div>
          <div class="flex-1">
            <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Quantidade</span>
            <span class="text-xl font-bold text-white">{{ opportunitiesMetrics.total }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <div class="w-10 h-10 bg-metric-green/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign :size="20" class="text-metric-green" />
          </div>
          <div class="flex-1">
            <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Valor Total</span>
            <span class="text-xl font-bold text-white">{{ formatCurrency(opportunitiesMetrics.totalValue) }}</span>
          </div>
        </div>
      </div>

      <div
          class="p-4 rounded-xl border transition-all"
          :class="meetsMinimum ? 'bg-status-success/5 border-status-success/20' : 'bg-status-warning/5 border-status-warning/20'"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="meetsMinimum ? 'bg-status-success/15 text-status-success' : 'bg-status-warning/15 text-status-warning'"
          >
            <CheckCircle v-if="meetsMinimum" :size="18" />
            <AlertTriangle v-else :size="18" />
          </div>
          <div>
            <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Mínimo exigido (10x a meta)</span>
            <span class="text-base font-bold text-white">{{ formatCurrency(minimumRequired) }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
                class="h-full rounded-full transition-all duration-700"
                :class="meetsMinimum ? 'bg-gradient-to-r from-status-success to-status-success-light' : 'bg-gradient-to-r from-status-warning to-status-warning-light'"
                :style="{ width: `${Math.min(percentageOfMinimum, 100)}%` }"
            ></div>
          </div>
          <span
              class="text-xs font-semibold text-center"
              :class="meetsMinimum ? 'text-status-success' : 'text-status-warning'"
          >
            {{ meetsMinimum ? `✓ Requisito atendido (${percentageOfMinimum}%)` : `${percentageOfMinimum}% do mínimo exigido` }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>