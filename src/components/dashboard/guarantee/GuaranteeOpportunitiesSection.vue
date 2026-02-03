<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../../../utils/formatters';
import SectionHeader from '../../../shared/SectionHeader.vue';
import { CheckCircle, AlertTriangle, Layers, DollarSign } from 'lucide-vue-next';

const props = defineProps({
  guarantee: { type: Object, required: true },
  totalOpportunities: { type: Number, default: 0 },
  totalOpportunitiesValue: { type: Number, default: 0 },
  minimumRequired: { type: Number, default: 0 },
  minimumRequiredPercentage: { type: Number, default: 0 }
});

const meetsMinimum = computed(() => props.totalOpportunitiesValue >= props.minimumRequired);

const percentageOfMinimum = computed(() => Math.round(props.minimumRequiredPercentage));
</script>

<template>
  <div class="p-6 border-t border-primary/10 bg-black/20">
    <SectionHeader
        title="Oportunidades"
        icon="briefcase"
        variant="default"
    />

    <div class="grid gap-3 mb-4">
      <div class="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
        <div class="w-10 h-10 bg-metric-purple/15 rounded-lg flex items-center justify-center flex-shrink-0">
          <Layers :size="20" class="text-metric-purple" />
        </div>
        <div class="flex-1">
          <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Quantidade</span>
          <span class="text-xl font-bold text-white">{{ totalOpportunities }}</span>
        </div>
      </div>

      <div class="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
        <div class="w-10 h-10 bg-metric-green/15 rounded-lg flex items-center justify-center flex-shrink-0">
          <DollarSign :size="20" class="text-metric-green" />
        </div>
        <div class="flex-1">
          <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Valor Total</span>
          <span class="text-xl font-bold text-white">{{ formatCurrency(totalOpportunitiesValue) }}</span>
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
  </div>
</template>