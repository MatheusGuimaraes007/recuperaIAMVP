<script setup>
import Card from '../../../shared/Card.vue';
import MetricCard from '../../../shared/MetricCard.vue';
import SkeletonText from "../../../shared/Skeleton/SkeletonText.vue";
import SkeletonMetricCard from "../../../shared/Skeleton/SkeletonMetricCard.vue";


defineProps({
  animatedRevenue: {
    type: Number,
    default: 0
  },
  animatedBillings: {
    type: Number,
    default: 0
  },
  animatedTotal: {
    type: Number,
    default: 0
  },
  animatedHistory: {
    type: Number,
    default: 0
  },
  averageRecoveryRate: {
    type: String,
    default: '-'
  },
  revenueGrowth: {
    type: String,
    default: null
  },
  billingGrowth: {
    type: String,
    default: null
  },
  totalGrowth: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  formatCurrency: {
    type: Function,
    required: true
  },
  getTrend: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <Card padding="lg" class="mb-6">
    <div class="mb-6">
      <SkeletonText v-if="loading" :lines="2" />

      <template v-else>
        <h2 class="text-xl font-bold text-white mb-1">Visão Geral da Receita</h2>
        <p class="text-sm text-gray-400">Principais indicadores de desempenho da plataforma</p>
      </template>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Skeleton Loading -->
      <template v-if="loading">
        <SkeletonMetricCard v-for="i in 5" :key="i" />
      </template>

      <!-- Actual Metrics -->
      <template v-else>
        <MetricCard
            label="Faturamento Mensalidade"
            :value="formatCurrency(animatedRevenue)"
            icon="dollar-sign"
            variant="blue"
            :trend="getTrend(revenueGrowth)"
            :loading="false"
        />

        <MetricCard
            label="Faturamento Comissões"
            :value="formatCurrency(animatedBillings)"
            icon="trending-up"
            variant="green"
            :trend="getTrend(billingGrowth)"
            :loading="false"
        />

        <MetricCard
            label="Faturamento Total"
            :value="formatCurrency(animatedTotal)"
            icon="target"
            variant="purple"
            :trend="getTrend(totalGrowth)"
            :loading="false"
        />

        <MetricCard
            label="Receita Total da História"
            :value="formatCurrency(animatedHistory)"
            icon="award"
            variant="orange"
            :loading="false"
        />

        <MetricCard
            label="Taxa de Recuperação Média"
            :value="averageRecoveryRate"
            icon="percent"
            variant="primary"
            :loading="false"
        />
      </template>
    </div>
  </Card>
</template>