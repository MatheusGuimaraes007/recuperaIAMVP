<script setup>
import Button from '../../../shared/Button.vue';

defineProps({
  guarantee: {
    type: Object,
    required: true
  },
  hasActiveGuarantee: {
    type: Boolean,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  }
});
</script>

<template>
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

    <Button
      v-if="!hasActiveGuarantee"
      variant="primary"
      full-width
      size="lg"
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 8px;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
      Solicitar Reembolso
    </Button>
  </div>
</template>

<style scoped>
.info-section {
  padding: 24px;
}

.info-grid {
  display: grid;
  gap: 14px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: rgba(124, 186, 16, 0.05);
  border-radius: 14px;
  border: 1px solid rgba(124, 186, 16, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(124, 186, 16, 0.08);
  border-color: rgba(124, 186, 16, 0.2);
}

.info-icon {
  width: 44px;
  height: 44px;
  background: rgba(124, 186, 16, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon svg {
  width: 22px;
  height: 22px;
  color: var(--color-text1);
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.info-label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: white;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  word-break: break-word;
}
</style>