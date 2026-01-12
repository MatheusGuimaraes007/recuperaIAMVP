<script setup>
import RModal from './RModal.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  type: { type: String, default: 'warning', validator: v => ['info','success','warning','error'].includes(v) },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const icons = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle'
}

const handleConfirm = () => emit('confirm')
const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<template>
  <RModal :model-value="modelValue" size="sm" :persistent="loading" @update:model-value="$emit('update:modelValue', $event)">
    <div class="r-confirm-dialog">
      <div :class="['r-confirm-dialog__icon', `r-confirm-dialog__icon--${type}`]">
        <RIcon :name="icons[type]" size="32" />
      </div>
      <RText size="lg" weight="semibold" class="r-confirm-dialog__title">{{ title }}</RText>
      <RText color="secondary" align="center">{{ message }}</RText>
    </div>
    <template #footer>
      <RButton variant="ghost" :disabled="loading" @click="handleCancel">{{ cancelText }}</RButton>
      <RButton :variant="type === 'error' ? 'error' : 'primary'" :loading="loading" @click="handleConfirm">
        {{ confirmText }}
      </RButton>
    </template>
  </RModal>
</template>

<style scoped>
.r-confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  text-align: center;
}
.r-confirm-dialog__icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}
.r-confirm-dialog__icon--info { background: var(--color-info-50); color: var(--color-info); }
.r-confirm-dialog__icon--success { background: var(--color-success-50); color: var(--color-success); }
.r-confirm-dialog__icon--warning { background: var(--color-warning-50); color: var(--color-warning); }
.r-confirm-dialog__icon--error { background: var(--color-error-50); color: var(--color-error); }
</style>