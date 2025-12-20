<script setup>
import { ref, watch, computed } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { useAdminDashboard } from '../../composables/useAdminDashboard';
import { useDashboardClients } from '../../composables/useDashboardClients';
import Navbar from '../../shared/Navbar.vue';
import DashboardHeader from './dashboard/DashboardHeader.vue';
import LowConversionAlert from './dashboard/LowConversionAlert.vue';
import DashboardFilters from './dashboard/DashboardFilters.vue';
import DashboardMetrics from './dashboard/DashboardMetrics.vue';
import DashboardCharts from './dashboard/DashboardCharts.vue';
import DashboardClients from './dashboard/DashboardClients.vue';

const { user, isAdmin } = useAuth();

const {
  formattedStats,
  timelineData,
  loading,
  selectedFilter,
  customStartDate,
  customEndDate,
  showCustomInputs,
  filtersList,
  filterLabel,
  periodConversionRate,
  animatedRevenue,
  animatedBillings,
  animatedTotal,
  animatedHistory,
  animatedRings,
  applyFilter,
  applyCustomFilter,
  formatCurrency,
  formatShortCurrency
} = useAdminDashboard();

const {
  clientsWithGuarantee,
  loadClientsWithGuarantees,
  formatPercent
} = useDashboardClients();

const loadingClients = ref(false);
const clientsLoaded = ref(false);

const lowConversionClients = computed(() => {
  return clientsWithGuarantee.value.filter(client =>
      parseFloat(client.metrics?.conversionRate || 0) < 12
  );
});

const getTrend = (growthStr) => {
  if (!growthStr) return null;
  const value = parseFloat(growthStr.replace(/[^0-9.-]/g, ''));
  if (isNaN(value)) return null;
  return {
    value: Math.abs(value),
    direction: value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'
  };
};

const loadClients = async () => {
  if (!loading.value && !clientsLoaded.value) {
    loadingClients.value = true;
    await loadClientsWithGuarantees();
    loadingClients.value = false;
    clientsLoaded.value = true;
  }
};

const handleMetricsLoaded = () => {
  if (!loading.value) {
    setTimeout(() => {
      loadClients();
    }, 300);
  }
};

watch(loading, (newVal) => {
  if (!newVal) {
    handleMetricsLoaded();
  }
});
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1600px] mx-auto">

        <!-- Header Welcome Card -->
        <DashboardHeader
            :userName="user?.name || 'Usuário'"
            :loading="loading"
        />

        <!-- Low Conversion Alert -->
        <LowConversionAlert
            :clients="lowConversionClients"
            :loading="loadingClients"
            :formatPercent="formatPercent"
            :filterLabel="filterLabel"
            :periodConversionRate="periodConversionRate"
        />

        <!-- Filters Card -->
        <DashboardFilters
            :filtersList="filtersList"
            :selectedFilter="selectedFilter"
            :filterLabel="filterLabel"
            :showCustomInputs="showCustomInputs"
            v-model:customStartDate="customStartDate"
            v-model:customEndDate="customEndDate"
            :loading="loading"
            @apply-filter="applyFilter"
            @apply-custom-filter="applyCustomFilter"
        />

        <!-- Admin Content -->
        <div v-if="isAdmin">
          <!-- Metrics Section -->
          <DashboardMetrics
              :animatedRevenue="animatedRevenue"
              :animatedBillings="animatedBillings"
              :animatedTotal="animatedTotal"
              :animatedHistory="animatedHistory"
              :averageRecoveryRate="formattedStats.averageRecoveryRate"
              :revenueGrowth="formattedStats.revenueGrowth"
              :billingGrowth="formattedStats.billingGrowth"
              :totalGrowth="formattedStats.totalGrowth"
              :loading="loading"
              :formatCurrency="formatCurrency"
              :getTrend="getTrend"
              :filterLabel="filterLabel"
              :selectedFilter="selectedFilter"
              :periodConversionRate="periodConversionRate"
              :lowConversionCount="lowConversionClients.length"
          />

          <!-- Charts Section -->
          <DashboardCharts
              :timelineData="timelineData"
              :animatedRings="animatedRings"
              :loading="loading"
              :formatShortCurrency="formatShortCurrency"
          />

          <!-- Clients Section (carrega após as métricas) -->
          <div class="mt-6">
            <DashboardClients :loading="loadingClients" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>