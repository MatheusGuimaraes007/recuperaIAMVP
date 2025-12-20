<script setup>
import { computed } from 'vue';
import { formatDate } from '../../../utils/formatters';
import { ArrowRight } from 'lucide-vue-next';
import SectionHeader from '../../../shared/SectionHeader.vue';

const props = defineProps({
  guarantee: { type: Object, required: true },
  daysRemaining: { type: Number, required: true },
  totalDays: { type: Number, required: true },
  isCritical: { type: Boolean, default: false },
  isInAlert: { type: Boolean, default: false }
});

const progressWidth = computed(() => {
  if (props.totalDays === 0) return 0;
  const elapsed = props.totalDays - props.daysRemaining;
  return Math.min((elapsed / props.totalDays) * 100, 100);
});

const barColor = computed(() => {
  if (props.isCritical) return '#ef4444';
  if (props.isInAlert) return '#f59e0b';
  return '#6b7280';
});
</script>

<template>
  <div class="p-6 border-b border-primary/10">
    <SectionHeader
        title="Período da Garantia"
        icon="clock"
    >
      <template #action>
        <div class="flex items-baseline gap-1.5"
             :class="{'text-status-error animate-pulse': isCritical, 'text-status-warning': isInAlert, 'text-white': !isCritical && !isInAlert}">
          <span class="text-3xl font-bold">{{ daysRemaining }}</span>
          <span class="text-base font-semibold text-gray-400">dias</span>
        </div>
      </template>
    </SectionHeader>

    <div class="mb-5">
      <div class="h-3 bg-primary/10 rounded-full overflow-hidden">
        <div
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${progressWidth}%`, backgroundColor: barColor }"
        ></div>
      </div>
    </div>

    <div class="flex justify-between items-center gap-4">
      <div class="flex-1">
        <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Início</span>
        <span class="text-sm font-semibold text-gray-200">{{ formatDate(guarantee.start_date) }}</span>
      </div>

      <ArrowRight :size="20" class="text-gray-600 flex-shrink-0" />

      <div class="flex-1 text-right">
        <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Término</span>
        <span class="text-sm font-semibold text-gray-200">{{ formatDate(guarantee.end_date) }}</span>
      </div>
    </div>
  </div>
</template>