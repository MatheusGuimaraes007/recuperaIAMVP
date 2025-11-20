<script setup>
const props = defineProps({
  guarantee: {
    type: Object,
    required: true
  },
  daysRemaining: {
    type: Number,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  formatDate: {
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

const getDaysProgressWidth = () => {
  if (props.totalDays === 0) return 0;
  const elapsed = props.totalDays - props.daysRemaining;
  return Math.min((elapsed / props.totalDays) * 100, 100);
};
</script>

<template>
  <div class="time-section">
    <div class="section-header">
      <h4 class="section-title">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Período da Garantia
      </h4>
      <span class="days-remaining-badge" :class="{ 'critical': isCritical, 'alert': isInAlert }">
        <span class="days-number">{{ daysRemaining }}</span>
        <span class="days-text">dias</span>
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
</template>

<style scoped>
.time-section {
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

.days-remaining-badge {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: white;
}

.days-remaining-badge.alert {
  color: #f59e0b;
}

.days-remaining-badge.critical {
  color: #ef4444;
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.days-number {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.days-text {
  font-size: 16px;
  font-weight: 600;
  color: #9ca3af;
}

.time-bar-container {
  margin-bottom: 20px;
}

.time-bar-bg {
  height: 12px;
  background: rgba(124, 186, 16, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.time-bar-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.date-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.date-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-item.right {
  align-items: flex-end;
}

.date-label {
  color: #6b7280;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-value {
  color: #e5e7eb;
  font-size: 15px;
  font-weight: 600;
}

.date-separator {
  color: #4b5563;
  flex-shrink: 0;
}

.date-separator svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .days-remaining-badge {
    align-self: flex-end;
  }
}
</style>