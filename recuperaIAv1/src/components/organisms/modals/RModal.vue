<script setup>
/**
 * RModal - Modal/Dialog Base
 *
 * Componente organism para criar modais completos.
 */

import { onMounted, onUnmounted, watch, computed } from 'vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RDivider from '@components/atoms/layout/RDivider.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: null },
  size: { type: String, default: 'md', validator: v => ['xs','sm','md','lg','xl','full'].includes(v) },
  closeOnOverlay: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  persistent: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleOverlayClick = () => props.closeOnOverlay && !props.persistent && close()
const handleEsc = (e) => e.key === 'Escape' && props.modelValue && props.closeOnEsc && !props.persistent && close()

onMounted(() => document.addEventListener('keydown', handleEsc))
onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="r-modal">
      <div v-if="modelValue" class="r-modal-overlay" @click.self="handleOverlayClick">
        <div :class="['r-modal', `r-modal--${size}`]" role="dialog" aria-modal="true">
          <header v-if="title || $slots.header || showClose" class="r-modal__header">
            <slot name="header">
              <RHeading level="4">{{ title }}</RHeading>
            </slot>
            <RIconButton v-if="showClose && !persistent" icon="x" variant="ghost" size="sm" @click="close" />
          </header>
          <RDivider v-if="title || $slots.header" />
          <div class="r-modal__body"><slot /></div>
          <template v-if="$slots.footer">
            <RDivider />
            <footer class="r-modal__footer"><slot name="footer" /></footer>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.r-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
}
.r-modal {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
}
.r-modal--xs { max-width: 320px; }
.r-modal--sm { max-width: 400px; }
.r-modal--md { max-width: 600px; }
.r-modal--lg { max-width: 800px; }
.r-modal--xl { max-width: 1140px; }
.r-modal--full { max-width: 100%; height: 100vh; border-radius: 0; }
.r-modal__header {
  padding: var(--spacing-4) var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.r-modal__body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}
.r-modal__footer {
  padding: var(--spacing-4) var(--spacing-6);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  background: var(--color-bg-secondary);
}
.r-modal-enter-active, .r-modal-leave-active {
  transition: opacity 0.3s;
}
.r-modal-enter-active .r-modal, .r-modal-leave-active .r-modal {
  transition: transform 0.3s;
}
.r-modal-enter-from, .r-modal-leave-to {
  opacity: 0;
}
.r-modal-enter-from .r-modal {
  transform: scale(0.9);
}
.r-modal-leave-to .r-modal {
  transform: scale(0.95);
}
</style>