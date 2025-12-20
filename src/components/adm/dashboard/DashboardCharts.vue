<script setup>
import Card from '../../../shared/Card.vue';
import BarChart from '../../../shared/BarChart.vue';
import DonutChart from '../../../shared/DonutChart.vue';
import SkeletonText from "../../../shared/Skeleton/SkeletonText.vue";
import SkeletonChart from "../../../shared/Skeleton/SkeletonChart.vue";
import SkeletonBase from "../../../shared/Skeleton/SkeletonBase.vue";


defineProps({
  timelineData: {
    type: Array,
    default: () => []
  },
  animatedRings: {
    type: Object,
    default: () => ({
      novos: 0,
      engajados: 0,
      qualificados: 0,
      convertidos: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  },
  formatShortCurrency: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Bar Chart -->
    <Card padding="lg">
      <div class="mb-6">
        <SkeletonText v-if="loading" :lines="2" :widths="['w-40', 'w-48']" :heights="['h-5', 'h-4']" />

        <template v-else>
          <h4 class="text-lg font-bold text-white mb-1">Evolução de Receita</h4>
          <p class="text-gray-400 text-sm">Receita total ao longo do período</p>
        </template>
      </div>

      <SkeletonChart v-if="loading" height="h-80" />
      <BarChart
          v-else
          :data="timelineData"
          :loading="false"
          :formatValue="formatShortCurrency"
      />
    </Card>

    <!-- Donut Charts -->
    <Card padding="lg">
      <div class="mb-6">
        <SkeletonText v-if="loading" :lines="2" :widths="['w-40', 'w-48']" :heights="['h-5', 'h-4']" />

        <template v-else>
          <h4 class="text-lg font-bold text-white mb-1">Distribuição de Leads</h4>
          <p class="text-gray-400 text-sm">Status atual das oportunidades</p>
        </template>
      </div>

      <div v-if="loading" class="grid grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="flex flex-col items-center">
          <SkeletonBase width="w-32" height="h-32" rounded="rounded-full" />
          <div class="mt-3 space-y-2 w-full flex flex-col items-center">
            <SkeletonBase width="w-20" height="h-4" />
            <SkeletonBase width="w-16" height="h-3" />
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-6">
        <DonutChart
            :value="animatedRings.novos"
            label="Novos"
            sublabel="Leads recentes"
            color="rgb(59, 130, 246)"
        />

        <DonutChart
            :value="animatedRings.engajados"
            label="Engajados"
            sublabel="Em contato"
            color="rgb(251, 191, 36)"
        />

        <DonutChart
            :value="animatedRings.qualificados"
            label="Qualificados"
            sublabel="Pronto p/ venda"
            color="rgb(168, 85, 247)"
        />

        <DonutChart
            :value="animatedRings.convertidos"
            label="Convertidos"
            sublabel="Vendas fechadas"
            color="rgb(124, 186, 16)"
        />
      </div>
    </Card>
  </div>
</template>