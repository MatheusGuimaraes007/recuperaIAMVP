<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../../../utils/formatters';
import SectionHeader from '../../../shared/SectionHeader.vue';

const props = defineProps({
  guarantee: { type: Object, required: true },
  progressPercentage: { type: Number, required: true },
  progressBarColor: { type: String, required: true },
  remainingAmount: { type: Number, required: true },
  hasActiveGuarantee: { type: Boolean, required: true },
  isCritical: { type: Boolean, default: false },
  isInAlert: { type: Boolean, default: false },
  roi: { type: Number, default: 0 }
});

const progressWidth = computed(() => Math.min(props.progressPercentage, 100));

const progressGlow = computed(() => {
  if (props.isCritical) return 'rgba(239, 68, 68, 0.4)';
  if (props.isInAlert) return 'rgba(245, 158, 11, 0.4)';
  return 'rgba(124, 186, 16, 0.4)';
});

const showROI = computed(() => {
  return props.roi > 0;
});
</script>

<template>
  <div class="p-6 border-b border-primary/10">
    <SectionHeader
        title="Progresso da Meta"
        icon="trending-up"
        variant="primary"
    >
      <template #action>
        <span class="text-3xl font-bold text-white">{{ progressPercentage.toFixed(1) }}%</span>
      </template>
    </SectionHeader>

    <div class="mb-5">
      <div class="h-3 bg-primary/10 rounded-full overflow-hidden relative">
        <div
            class="h-full rounded-full relative transition-all duration-1000 ease-out"
            :style="{
            width: `${progressWidth}%`,
            background: `linear-gradient(90deg, ${progressBarColor} 0%, ${progressBarColor}dd 100%)`,
            boxShadow: `0 0 20px ${progressGlow}`
          }"
        >
          <div class="absolute inset-0 w-full h-full animate-[shine_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div class="p-4 bg-primary/5 border border-primary/15 rounded-xl hover:bg-primary/10 hover:border-primary/25 transition-all group">
        <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recuperado</span>
        <span class="block text-2xl font-bold text-primary group-hover:scale-105 transition-transform origin-left">
          {{ formatCurrency(guarantee.current_recovered_amount) }}
        </span>
      </div>
      <div class="p-4 bg-primary/5 border border-primary/15 rounded-xl hover:bg-primary/10 hover:border-primary/25 transition-all group">
        <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Meta</span>
        <span class="block text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
          {{ formatCurrency(guarantee.goal_amount) }}
        </span>
      </div>
    </div>

    <!-- ROI Card - Only shows when positive -->
    <div v-if="showROI" class="mb-5 p-4 bg-gradient-to-br from-status-success/10 to-status-success/5 border border-status-success/20 rounded-xl">
      <div class="flex items-center justify-between">
        <div>
          <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Retorno sobre Investimento</span>
          <span class="block text-2xl font-bold text-status-success">{{ roi.toFixed(1) }}%</span>
        </div>
        <div class="w-12 h-12 bg-status-success/15 rounded-xl flex items-center justify-center">
          <span class="text-2xl">📈</span>
        </div>
      </div>
    </div>

    <div v-if="hasActiveGuarantee && remainingAmount > 0"
         class="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-dashed border-primary/30">
      <span class="text-sm font-semibold text-gray-400">Falta recuperar</span>
      <span class="text-lg font-bold text-white">{{ formatCurrency(remainingAmount) }}</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes shine {
  to { transform: translateX(200%); }
}
</style>