<script setup>
import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: v => ['info', 'success', 'warning', 'error'].includes(v)
  },
  title: { type: String, default: null },
  closable: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const icons = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle'
}

const alertClasses = computed(() => [
  'r-alert',
  `r-alert--${props.variant}`
])
</script>

<template>
  <div :class="alertClasses" role="alert">
    <div class="r-alert__icon">
      <RIcon :name="icons[variant]" size="20" />
    </div>

    <div class="r-alert__content">
      <RText v-if="title" weight="semibold" class="r-alert__title">{{ title }}</RText>
      <div class="r-alert__description">
        <slot />
      </div>
    </div>

    <div v-if="closable" class="r-alert__action">
      <RIconButton
        icon="x"
        variant="ghost"
        size="sm"
        @click="$emit('close')"
        aria-label=""/>
    </div>
  </div>
</template>

<style scoped>
.r-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  margin-bottom: var(--spacing-4);
}

.r-alert__content {
  flex: 1;
  font-size: var(--font-size-sm);
  color: inherit;
}

.r-alert__title {
  margin-bottom: var(--spacing-1);
}

/* Variants */
.r-alert--info {
  background-color: var(--color-info-50, #EFF6FF);
  border-color: var( #BFDBFE);
  color: var( #1E40AF);
}

.r-alert--success {
  background-color: var(--color-success-50, #ECFDF5);
  border-color: var( #A7F3D0);
  color: var( #065F46);
}

.r-alert--warning {
  background-color: var(--color-warning-50, #FFFBEB);
  border-color: var( #FDE68A);
  color: var( #92400E);
}

.r-alert--error {
  background-color: var(--color-error-50, #FEF2F2);
  border-color: var(#FECACA);
  color: var( #991B1B);
}
</style>