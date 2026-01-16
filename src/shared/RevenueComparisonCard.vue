<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../utils/formatters';
import Card from "./Card.vue";

const props = defineProps({
  platformRevenue: {
    type: Number,
    required: true
  },
  recoveredRevenue: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const recoveryPercentage = computed(() => {
  if (props.platformRevenue === 0) return 0;
  return ((props.recoveredRevenue / props.platformRevenue) * 100).toFixed(1);
});

const platformOnlyRevenue = computed(() => {
  return props.platformRevenue - props.recoveredRevenue;
});

const platformPercentage = computed(() => {
  if (props.platformRevenue === 0) return 0;
  return ((platformOnlyRevenue.value / props.platformRevenue) * 100).toFixed(1);
});
</script>

<template>
  <Card padding="lg" class="relative overflow-hidden">
    <div class="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent"></div>

    <div class="relative">
      <h3 class="text-lg font-bold text-white mb-2">
        Faturamento (tracking) × Recupera.ia
      </h3>
      <p class="text-sm text-gray-400 mb-6">
        Somente produtos ativos no RVP
      </p>

      <div v-if="loading" class="space-y-4">
        <div class="h-6 bg-gray-700 rounded animate-pulse w-2/3"></div>
        <div class="h-20 bg-gray-700 rounded animate-pulse"></div>
        <div class="h-6 bg-gray-700 rounded animate-pulse w-2/3"></div>
        <div class="h-20 bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div v-else class="space-y-6">
        <!-- Plataforma -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-300">Venda dos Produtos</span>
            <span class="text-lg font-bold text-white">
              {{ formatCurrency(props.platformRevenue) }}
            </span>
          </div>
          <!-- barra removida conforme solicitado -->
        </div>

        <!-- Recupera.ia -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-300">Recupera.ia</span>
            <div class="text-right">
              <span class="text-lg font-bold text-primary mr-2">
                {{ formatCurrency(recoveredRevenue) }}
              </span>
              <span class="text-sm text-primary font-semibold">
                ({{ recoveryPercentage }}%)
              </span>
            </div>
          </div>
          <div class="relative h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
                class="absolute inset-y-0 left-0 bg-linear-to-r from-primary to-primary-dark rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(124,186,16,0.5)]"
                :style="{ width: `${recoveryPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>