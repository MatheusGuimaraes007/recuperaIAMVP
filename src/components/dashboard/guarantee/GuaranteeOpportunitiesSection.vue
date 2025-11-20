<script setup>
import { computed, watch, ref } from 'vue';
import { useGuaranteeOpportunities } from '../../../composables/useGuaranteeOpportunities.js';

const props = defineProps({
  guarantee: {
    type: Object,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  }
});

const {
  loading,
  error,
  opportunitiesMetrics,
  fetchGuaranteeMetrics  
} = useGuaranteeOpportunities();

const isInitialized = ref(false);


watch(() => props.guarantee?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await fetchGuaranteeMetrics(newId);
    isInitialized.value = true;
  }
}, { immediate: true });

const minimumRequired = computed(() => {
  const goalAmount = parseFloat(props.guarantee.goal_amount || 0);
  return goalAmount * 10;
});

const meetsMinimum = computed(() => {
  return opportunitiesMetrics.value.totalValue >= minimumRequired.value;
});

const percentageOfMinimum = computed(() => {
  if (minimumRequired.value === 0) return 0;
  return Math.round((opportunitiesMetrics.value.totalValue / minimumRequired.value) * 100);
});
</script>

<template>
  <div class="opportunities-section">
    <div class="opportunities-header">
      <h3 class="section-title">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Oportunidades
      </h3>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Carregando métricas...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Content -->
    <template v-else>
      <div class="opportunities-grid">
        <!-- Total de Oportunidades -->
        <div class="opportunity-card">
          <div class="card-icon qty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div class="card-content">
            <span class="card-label">Oportunidades (qtd)</span>
            <span class="card-value">{{ opportunitiesMetrics.total }}</span>
          </div>
        </div>

        <!-- Valor das Oportunidades -->
        <div class="opportunity-card">
          <div class="card-icon value-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="card-content">
            <span class="card-label">Valor das oportunidades</span>
            <span class="card-value">{{ formatCurrency(opportunitiesMetrics.totalValue) }}</span>
          </div>
        </div>
      </div>

      <!-- Mínimo Exigido -->
      <div class="minimum-required" :class="{ 'meets-minimum': meetsMinimum, 'below-minimum': !meetsMinimum }">
        <div class="minimum-header">
          <div class="minimum-icon">
            <svg v-if="meetsMinimum" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="minimum-text">
            <span class="minimum-label">Mínimo exigido (10× a meta)</span>
            <span class="minimum-value">{{ formatCurrency(minimumRequired) }}</span>
          </div>
        </div>

        <div class="minimum-status">
          <div class="status-bar">
            <div 
              class="status-bar-fill" 
              :style="{ width: `${Math.min(percentageOfMinimum, 100)}%` }"
            ></div>
          </div>
          <span class="status-text">
            <template v-if="meetsMinimum">
              ✓ Requisito atendido ({{ percentageOfMinimum }}%)
            </template>
            <template v-else>
              {{ percentageOfMinimum }}% do mínimo exigido
            </template>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.opportunities-section {
  padding: 24px;
  border-top: 1px solid rgba(124, 186, 16, 0.1);
}

.opportunities-header {
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.section-title svg {
  width: 22px;
  height: 22px;
  color: var(--color-text1);
}

/* Loading State */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  color: #9ca3af;
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(124, 186, 16, 0.2);
  border-top-color: var(--color-text1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 14px;
}

.error-state svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Opportunities Grid */
.opportunities-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.opportunity-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: rgba(124, 186, 16, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(124, 186, 16, 0.1);
  transition: all 0.3s ease;
}

.opportunity-card:hover {
  background: rgba(124, 186, 16, 0.08);
  border-color: rgba(124, 186, 16, 0.2);
  transform: translateY(-1px);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qty-icon {
  background: rgba(99, 102, 241, 0.15);
}

.qty-icon svg {
  width: 20px;
  height: 20px;
  color: #6366f1;
}

.value-icon {
  background: rgba(16, 185, 129, 0.15);
}

.value-icon svg {
  width: 20px;
  height: 20px;
  color: #10b981;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.card-label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  color: white;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

/* Minimum Required Section */
.minimum-required {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid;
  transition: all 0.3s ease;
}

.minimum-required.meets-minimum {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
}

.minimum-required.below-minimum {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.minimum-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.minimum-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.meets-minimum .minimum-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.below-minimum .minimum-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.minimum-icon svg {
  width: 18px;
  height: 18px;
}

.minimum-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.minimum-label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.minimum-value {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.minimum-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.status-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-text1), rgba(124, 186, 16, 0.8));
  border-radius: 3px;
  transition: width 0.6s ease;
}

.meets-minimum .status-bar-fill {
  background: linear-gradient(90deg, #10b981, #059669);
}

.below-minimum .status-bar-fill {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.status-text {
  color: #d1d5db;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.meets-minimum .status-text {
  color: #10b981;
}

.below-minimum .status-text {
  color: #f59e0b;
}
</style>