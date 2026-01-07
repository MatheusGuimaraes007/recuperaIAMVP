<script setup>
/**
 * RAlertBanner - Banner de alerta
 */
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  message: { type: String, required: true },
  variant: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'warning', 'error'].includes(v)
  },
  closeable: { type: Boolean, default: true },
  actionLabel: { type: String, default: null }
})

const emit = defineEmits(['close', 'action'])

const iconMap = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌'
}
</script>

<template>
  <div :class="['r-alert-banner', `r-alert-banner--${variant}`]">
    <span class="r-alert-banner__icon">{{ iconMap[variant] }}</span>

    <RText size="sm" class="r-alert-banner__message">{{ message }}</RText>

    <div class="r-alert-banner__actions">
      <RButton
        v-if="actionLabel"
        size="sm"
        variant="ghost"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </RButton>

      <RIconButton
        v-if="closeable"
        variant="ghost"
        size="sm"
        aria-label="Fechar"
        @click="emit('close')"
      >
        ✕
      </RIconButton>
    </div>
  </div>
</template>

<style scoped>
.r-alert-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.r-alert-banner--info {
  background-color: var(--color-info-bg);
  border-left-color: var(--color-info);
  color: var(--color-info-700);
}

.r-alert-banner--success {
  background-color: var(--color-success-bg);
  border-left-color: var(--color-success);
  color: var(--color-success-700);
}

.r-alert-banner--warning {
  background-color: var(--color-warning-bg);
  border-left-color: var(--color-warning);
  color: var(--color-warning-700);
}

.r-alert-banner--error {
  background-color: var(--color-error-bg);
  border-left-color: var(--color-error);
  color: var(--color-error-700);
}

.r-alert-banner__icon {
  font-size: 20px;
  flex-shrink: 0;
}

.r-alert-banner__message {
  flex: 1;
}

.r-alert-banner__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-left: auto;
}
</style>