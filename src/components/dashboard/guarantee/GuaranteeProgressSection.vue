<script setup>
import { computed } from 'vue';

const props = defineProps({
  guarantee: {
    type: Object,
    required: true
  },
  progressPercentage: {
    type: Number,
    required: true
  },
  progressBarColor: {
    type: String,
    required: true
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  hasActiveGuarantee: {
    type: Boolean,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  isInAlert: {
    type: Boolean,
    default: false
  }
});

const getProgressWidth = () => {
  return Math.min(props.progressPercentage, 100);
};

const progressGlow = computed(() => {
  if (props.isCritical) return 'rgba(239, 68, 68, 0.4)';
  if (props.isInAlert) return 'rgba(245, 158, 11, 0.4)';
  return 'rgba(124, 186, 16, 0.4)';
});
</script>

<template>
  <div class="progress-section">
    <div class="section-header">
      <h4 class="section-title">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Progresso da Meta
      </h4>
      <span class="percentage-large">{{ progressPercentage.toFixed(1) }}%</span>
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
</template>

<style scoped>
.progress-section {
  padding: 24px;
  border-bottom: 1px solid rgba(124, 186, 16, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d1d5db;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
}

.section-title svg {
  width: 20px;
  height: 20px;
  color: var(--color-text1);
  flex-shrink: 0;
}

.percentage-large {
  font-size: 32px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.progress-bar-container {
  margin-bottom: 20px;
}

.progress-bar-bg {
  height: 12px;
  background: rgba(124, 186, 16, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.stat-card {
  padding: 18px;
  background: rgba(124, 186, 16, 0.05);
  border: 1px solid rgba(124, 186, 16, 0.15);
  border-radius: 14px;
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
  letter-spacing: 0.6px;
  margin-bottom: 10px;
  display: block;
}

.stat-value {
  color: white;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  display: block;
}

.stat-value.primary {
  color: var(--color-text1);
}

.remaining-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(124, 186, 16, 0.08);
  border-radius: 12px;
  border: 1px dashed rgba(124, 186, 16, 0.3);
  gap: 12px;
}

.remaining-label {
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
}

.remaining-value {
  color: white;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .percentage-large {
    align-self: flex-end;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>