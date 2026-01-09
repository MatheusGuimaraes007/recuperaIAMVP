<script setup>
import { onMounted } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  type: { type: String, default: 'info', validator: v => ['success', 'error', 'warning', 'info'].includes(v) },
  title: { type: String, required: true },
  message: { type: String, default: null },
  duration: { type: Number, default: 3000 }
})

const emit = defineEmits(['close'])

const icons = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info'
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => emit('close'), props.duration)
  }
})
</script>

<template>
  <div :class="['r-toast', `r-toast--${type}`]" role="alert">
    <div class="r-toast__icon-wrapper">
      <RIcon :name="icons[type]" size="24" />
    </div>

    <div class="r-toast__content">
      <RText weight="semibold" class="r-toast__title">{{ title }}</RText>
      <RText v-if="message" size="sm" class="r-toast__message">{{ message }}</RText>
    </div>

    <button class="r-toast__close" @click="$emit('close')">
      <RIcon name="x" size="16" />
    </button>
  </div>
</template>

<style scoped>
.r-toast {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.r-toast__content { flex: 1; }
.r-toast__close { background: none; border: none; cursor: pointer; opacity: 0.5; }
.r-toast__close:hover { opacity: 1; }

/* Types */
.r-toast--success { border-left-color: var(--color-success); }
.r-toast--success .r-toast__icon-wrapper { color: var(--color-success); }

.r-toast--error { border-left-color: var(--color-error); }
.r-toast--error .r-toast__icon-wrapper { color: var(--color-error); }

.r-toast--warning { border-left-color: var(--color-warning); }
.r-toast--warning .r-toast__icon-wrapper { color: var(--color-warning); }

.r-toast--info { border-left-color: var(--color-info); }
.r-toast--info .r-toast__icon-wrapper { color: var(--color-info); }
</style>