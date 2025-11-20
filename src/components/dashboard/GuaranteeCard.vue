<script setup>
import { onMounted, computed } from 'vue';
import { useGuarantee } from '../../composables/useGuarantee.js';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';

const {
  guarantee,
  loading,
  error,
  guaranteeStatusConfig,
  daysRemaining,
  totalDays,
  progressPercentage,
  remainingAmount,
  isInAlert,
  isCritical,
  statusMessage,
  progressBarColor,
  hasActiveGuarantee,
  fetchActiveGuarantee,
  formatCurrency,
  formatDate
} = useGuarantee();

onMounted(async () => {
  await fetchActiveGuarantee();
});

const getProgressWidth = () => {
  return Math.min(progressPercentage.value, 100);
};

const getDaysProgressWidth = () => {
  if (totalDays.value === 0) return 0;
  const elapsed = totalDays.value - daysRemaining.value;
  return Math.min((elapsed / totalDays.value) * 100, 100);
};

const statusGradient = computed(() => {
  if (isCritical.value) {
    return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)';
  }
  if (isInAlert.value) {
    return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)';
  }
  return 'linear-gradient(135deg, rgba(124, 186, 16, 0.2) 0%, rgba(124, 186, 16, 0.05) 100%)';
});

const progressGlow = computed(() => {
  if (isCritical.value) return 'rgba(239, 68, 68, 0.4)';
  if (isInAlert.value) return 'rgba(245, 158, 11, 0.4)';
  return 'rgba(124, 186, 16, 0.4)';
});
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading && !guarantee" class="guarantee-loading">
    <div class="loading-spinner"></div>
    <p class="loading-text">Carregando garantia...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="guarantee-error">
    <div class="error-icon">
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </div>
    <h3>Erro ao carregar</h3>
    <p>{{ error }}</p>
  </div>

  <!-- Empty State -->
  <div v-else-if="!guarantee" class="guarantee-empty">
    <div class="empty-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <h3>Nenhuma garantia ativa</h3>
    <p>Entre em contato com o suporte para ativar sua garantia Risco Zero</p>
    <button class="contact-button">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Contatar Suporte
    </button>
  </div>

  <!-- Guarantee Card -->
  <div v-else class="guarantee-card">
    <!-- Header with Status -->
    <div class="card-header" :style="{ background: statusGradient }">
      <div class="header-top">
        <div class="model-info">
          <div class="model-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3>{{ guarantee.model_name }}</h3>
            <p>Garantia de Resultados</p>
          </div>
        </div>

        <div class="status-badge" :style="{
          backgroundColor: guaranteeStatusConfig.bgColor,
          color: guaranteeStatusConfig.color,
          boxShadow: `0 4px 12px ${guaranteeStatusConfig.bgColor}`
        }">
          <span class="status-icon">{{ guaranteeStatusConfig.icon }}</span>
          <span>{{ guaranteeStatusConfig.label }}</span>
        </div>
      </div>

      <!-- Status Message -->
      <div class="status-message" :class="{
        'critical': isCritical,
        'alert': isInAlert && !isCritical
      }">
        <div class="message-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p>{{ statusMessage }}</p>
      </div>
    </div>

    <!-- Financial Progress -->
    <div class="progress-section">
      <div class="section-header">
        <h4>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Progresso da Meta
        </h4>
        <span class="percentage">{{ progressPercentage.toFixed(1) }}%</span>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-bg">
          <div
              class="progress-bar-fill"
              :style="{
              width: `${getProgressWidth()}%`,
              background: `linear-gradient(90deg, ${progressBarColor} 0%, ${progressBarColor}dd 100%)`,
              boxShadow: `0 0 20px ${progressGlow}`
            }"
          >
            <div class="progress-shine"></div>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Recuperado</div>
          <div class="stat-value primary">
            {{ formatCurrency(guarantee.current_recovered_amount) }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Meta</div>
          <div class="stat-value">
            {{ formatCurrency(guarantee.goal_amount) }}
          </div>
        </div>
      </div>

      <div v-if="hasActiveGuarantee && remainingAmount > 0" class="remaining-amount">
        <span class="remaining-label">Falta recuperar</span>
        <span class="remaining-value">{{ formatCurrency(remainingAmount) }}</span>
      </div>
    </div>

    <!-- Time Progress -->
    <div class="time-section">
      <div class="section-header">
        <h4>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Período da Garantia
        </h4>
        <span class="days-remaining" :class="{ 'critical': isCritical, 'alert': isInAlert }">
          {{ daysRemaining }} dias
        </span>
      </div>

      <div class="time-bar-container">
        <div class="time-bar-bg">
          <div
              class="time-bar-fill"
              :style="{
              width: `${getDaysProgressWidth()}%`,
              backgroundColor: isCritical ? '#ef4444' : isInAlert ? '#f59e0b' : '#6b7280'
            }"
          ></div>
        </div>
      </div>

      <div class="date-range">
        <div class="date-item">
          <span class="date-label">Início</span>
          <span class="date-value">{{ formatDate(guarantee.start_date) }}</span>
        </div>
        <div class="date-separator">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <div class="date-item right">
          <span class="date-label">Término</span>
          <span class="date-value">{{ formatDate(guarantee.end_date) }}</span>
        </div>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="info-section">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="info-content">
            <span class="info-label">Investimento (90 dias)</span>
            <span class="info-value">{{ formatCurrency(guarantee.investment_90days) }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="info-content">
            <span class="info-label">Plano</span>
            <span class="info-value">{{ guarantee.subscription?.plan_name || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <button v-if="!hasActiveGuarantee" class="refund-button">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Solicitar Reembolso
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Loading State */
.guarantee-loading {
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(124, 186, 16, 0.1);
  border-top-color: var(--color-text1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #9ca3af;
  font-size: 14px;
}

/* Error State */
.guarantee-error {
  padding: 40px 24px;
  text-align: center;
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon svg {
  width: 32px;
  height: 32px;
}

.guarantee-error h3 {
  color: #ef4444;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.guarantee-error p {
  color: #9ca3af;
  font-size: 14px;
}

/* Empty State */
.guarantee-empty {
  padding: 50px 32px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, rgba(124, 186, 16, 0.15), rgba(124, 186, 16, 0.05));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-text1);
}

.guarantee-empty h3 {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.guarantee-empty p {
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-text1), rgba(124, 186, 16, 0.8));
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(124, 186, 16, 0.3);
}

.contact-button svg {
  width: 18px;
  height: 18px;
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 186, 16, 0.4);
}

/* Guarantee Card */
.guarantee-card {
  background: var(--color-background4);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(124, 186, 16, 0.15);
}

/* Header */
.card-header {
  padding: 24px;
  border-bottom: 1px solid rgba(124, 186, 16, 0.1);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.model-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.model-icon {
  width: 48px;
  height: 48px;
  background: rgba(124, 186, 16, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.model-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text1);
}

.model-info h3 {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.2;
}

.model-info p {
  color: #9ca3af;
  font-size: 13px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(8px);
}

.status-icon {
  font-size: 16px;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(99, 102, 241, 0.1);
  border-left: 3px solid #6366f1;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.status-message.alert {
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
}

.status-message.critical {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
  50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
}

.message-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.message-icon svg {
  width: 100%;
  height: 100%;
  color: currentColor;
}

.status-message p {
  color: currentColor;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

/* Progress Section */
.progress-section,
.time-section,
.info-section {
  padding: 24px;
  border-bottom: 1px solid rgba(124, 186, 16, 0.1);
}

.info-section {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d1d5db;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-header h4 svg {
  width: 18px;
  height: 18px;
  color: var(--color-text1);
}

.percentage,
.days-remaining {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.days-remaining.alert {
  color: #f59e0b;
}

.days-remaining.critical {
  color: #ef4444;
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Progress Bars */
.progress-bar-container,
.time-bar-container {
  margin-bottom: 20px;
}

.progress-bar-bg,
.time-bar-bg {
  height: 12px;
  background: rgba(124, 186, 16, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill,
.time-bar-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  to { left: 100%; }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  padding: 16px;
  background: rgba(124, 186, 16, 0.05);
  border: 1px solid rgba(124, 186, 16, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(124, 186, 16, 0.08);
  border-color: rgba(124, 186, 16, 0.25);
  transform: translateY(-2px);
}

.stat-label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-value {
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.stat-value.primary {
  color: var(--color-text1);
}

/* Remaining Amount */
.remaining-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(124, 186, 16, 0.08);
  border-radius: 10px;
  border: 1px dashed rgba(124, 186, 16, 0.3);
}

.remaining-label {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
}

.remaining-value {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

/* Date Range */
.date-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.date-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-item.right {
  align-items: flex-end;
}

.date-label {
  color: #6b7280;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.date-value {
  color: #e5e7eb;
  font-size: 14px;
  font-weight: 600;
}

.date-separator {
  color: #4b5563;
  flex-shrink: 0;
}

.date-separator svg {
  width: 20px;
  height: 20px;
}

/* Info Grid */
.info-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(124, 186, 16, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(124, 186, 16, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(124, 186, 16, 0.08);
  border-color: rgba(124, 186, 16, 0.2);
}

.info-icon {
  width: 40px;
  height: 40px;
  background: rgba(124, 186, 16, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-text1);
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

/* Refund Button */
.refund-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: linear-gradient(135deg, var(--color-text1), rgba(124, 186, 16, 0.8));
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(124, 186, 16, 0.3);
}

.refund-button svg {
  width: 20px;
  height: 20px;
}

.refund-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(124, 186, 16, 0.4);
}

.refund-button:active {
  transform: translateY(0);
}
</style>