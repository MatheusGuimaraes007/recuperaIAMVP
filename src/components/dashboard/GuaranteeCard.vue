<script setup>
import { onMounted } from 'vue';
import { useGuarantee } from '../../composables/useGuarantee.js';
import SidebarTrigger from '../../shared/SidebarTrigger.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import GuaranteeHeader from './guarantee/GuaranteeHeader.vue';
import GuaranteeProgressSection from './guarantee/GuaranteeProgressSection.vue';
import GuaranteeTimeSection from './guarantee/GuarantteTimeSection.vue';
import GuaranteeInfoSection from './guarantee/GuaranteeInfoSection.vue';
import GuaranteeOpportunitiesSection from './guarantee/GuaranteeOpportunitiesSection.vue';

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
</script>

<template>
  <SidebarTrigger
    v-if="!loading || guarantee"
    icon="shield"
    label="Garantia"
    position="left"
    width="600px"
  >
    <!-- Loading State dentro do sidebar -->
    <LoadingState v-if="loading && !guarantee" message="Carregando garantia..." />

    <!-- Error State -->
    <div v-else-if="error" class="guarantee-error">
      <div class="error-icon">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h3>Erro ao carregar</h3>
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!guarantee"
      title="Nenhuma garantia ativa"
      message="Entre em contato com o suporte para ativar sua garantia Risco Zero"
      icon="folder"
      action-label="Contatar Suporte"
      @action="() => {}"
    />

    <!-- Guarantee Card -->
    <div v-else class="guarantee-card">
      <GuaranteeHeader
        :guarantee="guarantee"
        :guarantee-status-config="guaranteeStatusConfig"
        :status-message="statusMessage"
        :is-critical="isCritical"
        :is-in-alert="isInAlert"
      />

      <GuaranteeProgressSection
        :guarantee="guarantee"
        :progress-percentage="progressPercentage"
        :progress-bar-color="progressBarColor"
        :remaining-amount="remainingAmount"
        :has-active-guarantee="hasActiveGuarantee"
        :format-currency="formatCurrency"
        :is-critical="isCritical"
        :is-in-alert="isInAlert"
      />

      <GuaranteeTimeSection
        :guarantee="guarantee"
        :days-remaining="daysRemaining"
        :total-days="totalDays"
        :format-date="formatDate"
        :is-critical="isCritical"
        :is-in-alert="isInAlert"
      />

      <GuaranteeInfoSection
        :guarantee="guarantee"
        :has-active-guarantee="hasActiveGuarantee"
        :format-currency="formatCurrency"
      />

      <GuaranteeOpportunitiesSection
        :guarantee="guarantee"
        :format-currency="formatCurrency"
      />
    </div>
  </SidebarTrigger>
</template>


<style scoped>
/* Error State */
.guarantee-error {
  text-align: center;
  padding: 40px 20px;
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

/* Guarantee Card */
.guarantee-card {
  background: var(--color-background4);
  border-radius: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .guarantee-error {
    padding: 30px 16px;
  }

  .error-icon {
    width: 56px;
    height: 56px;
  }

  .error-icon svg {
    width: 28px;
    height: 28px;
  }

  .guarantee-error h3 {
    font-size: 16px;
  }

  .guarantee-error p {
    font-size: 13px;
  }
}
</style>