<script setup>
import { computed } from 'vue';

const props = defineProps({
  guarantee: {
    type: Object,
    required: true
  },
  guaranteeStatusConfig: {
    type: Object,
    required: true
  },
  statusMessage: {
    type: String,
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

const statusGradient = computed(() => {
  if (props.isCritical) {
    return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)';
  }
  if (props.isInAlert) {
    return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)';
  }
  return 'linear-gradient(135deg, rgba(124, 186, 16, 0.2) 0%, rgba(124, 186, 16, 0.05) 100%)';
});
</script>

<template>
  <div class="card-header" :style="{ background: statusGradient }">
    <div class="header-top">
      <div class="model-info">
        <div class="model-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 class="model-title">{{ guarantee.model_name }}</h3>
          <p class="model-subtitle">Garantia de Resultados</p>
        </div>
      </div>

      <div class="status-badge" :style="{
        backgroundColor: guaranteeStatusConfig.bgColor,
        color: guaranteeStatusConfig.color,
        boxShadow: `0 4px 12px ${guaranteeStatusConfig.bgColor}`
      }">
        <span class="status-icon">{{ guaranteeStatusConfig.icon }}</span>
        <span class="status-label">{{ guaranteeStatusConfig.label }}</span>
      </div>
    </div>

    <div class="status-message" :class="{
      'critical': isCritical,
      'alert': isInAlert && !isCritical
    }">
      <div class="message-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="message-text">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
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
  min-width: 0;
}

.model-icon {
  width: 56px;
  height: 56px;
  background: rgba(124, 186, 16, 0.15);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.model-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-text1);
}

.model-title {
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.2;
  word-break: break-word;
}

.model-subtitle {
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.status-icon {
  color: #f5f5dc;
  font-size: 18px;
  line-height: 1;
}

.status-label {
    color: #f5f5dc;
  font-size: 14px;
  font-weight: 600;
}

.status-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  background: rgba(248, 248, 219, 0.1);
  border-left: 3px solid #fffaca;
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
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin-top: 1px;
}

.message-icon svg {
  width: 100%;
  height: 100%;
  color: #fffaca;
}

.message-text {
  color: #fffaca;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

@media (max-width: 640px) {
  .header-top {
    flex-direction: column;
    align-items: stretch;
  }

  .status-badge {
    justify-content: center;
  }
}
</style>