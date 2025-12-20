<script setup>
import { onMounted, computed } from 'vue';
import { useGuarantee } from '../../composables/useGuarantee.js';
import SidebarTrigger from '../../shared/SidebarTrigger.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';

import GuaranteeHeader from './guarantee/GuaranteeHeader.vue';
import GuaranteeProgressSection from './guarantee/GuaranteeProgressSection.vue';
import GuaranteeTimeSection from './guarantee/GuaranteeTimeSection.vue';
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
  showGuarantee,
  isGracePeriod,
  roi,
  fetchActiveGuarantee,
} = useGuarantee();

onMounted(async () => {
  await fetchActiveGuarantee();
});

const shouldShowTrigger = computed(() => {
  return showGuarantee.value && (!loading.value || guarantee.value);
});
</script>

<template>
  <SidebarTrigger
      v-if="shouldShowTrigger"
      icon="shield"
      label="Garantia"
      position="left"
      width="600px"
      class="m-4 sm:m-6"
  >
    <LoadingState v-if="loading && !guarantee" message="Carregando garantia..." />

    <div v-else-if="error" class="text-center py-10 px-5">
      <div class="w-16 h-16 mx-auto mb-4 bg-status-error/10 rounded-full flex items-center justify-center text-status-error">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-status-error mb-2">Erro ao carregar</h3>
      <p class="text-gray-400 text-sm">{{ error }}</p>
    </div>

    <EmptyState
        v-else-if="!guarantee"
        title="Nenhuma garantia ativa"
        message="Entre em contato com o suporte para ativar sua garantia Risco Zero"
        icon="shield"
        action-label="Contatar Suporte"
        @action="() => {}"
    />

    <div v-else class="bg-background-card">
      <GuaranteeHeader
          :guarantee="guarantee"
          :guarantee-status-config="guaranteeStatusConfig"
          :status-message="statusMessage"
          :is-critical="isCritical"
          :is-in-alert="isInAlert"
          :is-grace-period="isGracePeriod"
      />

      <GuaranteeProgressSection
          :guarantee="guarantee"
          :progress-percentage="progressPercentage"
          :progress-bar-color="progressBarColor"
          :remaining-amount="remainingAmount"
          :has-active-guarantee="hasActiveGuarantee"
          :is-critical="isCritical"
          :is-in-alert="isInAlert"
          :roi="roi"
      />

      <GuaranteeTimeSection
          :guarantee="guarantee"
          :days-remaining="daysRemaining"
          :total-days="totalDays"
          :is-critical="isCritical"
          :is-in-alert="isInAlert"
      />

      <GuaranteeInfoSection
          :guarantee="guarantee"
          :has-active-guarantee="hasActiveGuarantee"
      />

      <GuaranteeOpportunitiesSection
          :guarantee="guarantee"
      />
    </div>
  </SidebarTrigger>
</template>