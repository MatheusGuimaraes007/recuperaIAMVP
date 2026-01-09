<script setup>
import RMetricCard from '@components/molecules/cards/RMetricCard.vue'

defineProps({
  metrics: {
    type: Object,
    required: true,
    // Espera formato: { totalRecovered: 1000, totalOpportunities: 50, ... }
  },
  loading: { type: Boolean, default: false }
})

// Função auxiliar para formatar moeda se não vier formatado
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}
</script>

<template>
  <div class="r-dashboard-metrics">
    <RMetricCard
      label="Total Recuperado"
      :value="formatCurrency(metrics.totalRecovered)"
      icon="dollar-sign"
      variant="primary"
      :loading="loading"
      description="+12% vs mês anterior"
    />

    <RMetricCard
      label="Oportunidades"
      :value="metrics.totalOpportunities || 0"
      icon="briefcase"
      variant="warning"
      :loading="loading"
    />

    <RMetricCard
      label="Taxa de Conversão"
      :value="`${metrics.conversionRate || 0}%`"
      :percentage="metrics.conversionRate"
      total="100"
      icon="trending-up"
      variant="info"
      :loading="loading"
    />

    <RMetricCard
      label="Clientes Ativos"
      :value="metrics.activeClients || 0"
      icon="users"
      variant="success"
      :loading="loading"
    />
  </div>
</template>

<style scoped>
.r-dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-4);
}

@media (min-width: 640px) {
  .r-dashboard-metrics { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .r-dashboard-metrics { grid-template-columns: repeat(4, 1fr); }
}
</style>