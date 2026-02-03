<script setup>
import { computed } from 'vue';
import { OPPORTUNITY_TYPE_LABELS } from '../../utils/constants';
import Card from '../../shared/Card.vue';

const props = defineProps({
  opportunities: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const opportunityTypeCounts = computed(() => {
  const counts = {};

  props.opportunities.forEach(opp => {
    const type = opp.opportunity_type;
    if (!counts[type]) {
      counts[type] = 0;
    }
    counts[type]++;
  });

  return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        label: OPPORTUNITY_TYPE_LABELS[type] || type,
        count,
        percentage: props.opportunities.length > 0
            ? ((count / props.opportunities.length) * 100).toFixed(0)
            : 0
      }))
      .sort((a, b) => b.count - a.count);
});

const getBarColor = (index) => {
  const colors = [
    'bg-gradient-to-r from-primary to-primary-dark',
    'bg-gradient-to-r from-metric-blue to-metric-blue-light',
    'bg-gradient-to-r from-metric-purple to-metric-purple-light',
    'bg-gradient-to-r from-metric-orange to-metric-orange-light'
  ];
  return colors[index % colors.length];
};
</script>

<template>
  <Card padding="lg" class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>

    <div class="relative flex flex-col">
      <h3 class="text-lg font-bold text-white mb-6 shrink-0">
        Tipos de Oportunidade
      </h3>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="space-y-2">
          <div class="h-5 bg-gray-700 rounded animate-pulse w-1/2"></div>
          <div class="h-8 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="opportunityTypeCounts.length === 0" class="text-center py-8">
        <p class="text-gray-400 text-sm">Nenhuma oportunidade registrada</p>
      </div>

      <div v-else class="max-h-[300px] overflow-y-auto pr-2 scrollbar-custom space-y-5 pb-2">
        <div
            v-for="(item, index) in opportunityTypeCounts"
            :key="item.type"
            class="group"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {{ item.label }}
            </span>
            <span class="text-lg font-bold text-white">
              {{ item.count }}
            </span>
          </div>

          <div class="relative h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
                class="absolute inset-y-0 left-0 rounded-full transition-all duration-500 group-hover:shadow-lg"
                :class="getBarColor(index)"
                :style="{ width: `${item.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>