<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RDivider from '@components/atoms/layout/RDivider.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: null },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg', 'xl', 'full'].includes(v) },
  closeOnOverlay: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) close()
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => document.addEventListener('keydown', handleEsc))
onUnmounted(() => document.removeEventListener('keydown', handleEsc))

// Prevent body scroll when open
watch(() => props.modelValue, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="r-modal-overlay" @click.self="handleOverlayClick">
      <div :class="['r-modal', `r-modal--${size}`]" role="dialog" aria-modal="true">

        <header v-if="title || $slots.header" class="r-modal__header">
          <slot name="header">
            <RHeading level="4">{{ title }}</RHeading>
          </slot>
          <RIconButton icon="x" variant="ghost" size="sm" @click="close" />
        </header>

        <RDivider v-if="title || $slots.header" />

        <div class="r-modal__body">
          <slot />
        </div>

        <template v-if="$slots.footer">
          <RDivider />
          <footer class="r-modal__footer">
            <slot name="footer" />
          </footer>
        </template>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.r-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: var(--spacing-4);
  animation: fadeIn 0.2s ease-out;
}

.r-modal {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  animation: slideUp 0.3s ease-out;
}

/* Sizes */
.r-modal--sm { max-width: 400px; }
.r-modal--md { max-width: 600px; }
.r-modal--lg { max-width: 800px; }
.r-modal--xl { max-width: 1140px; }
.r-modal--full { max-width: 100%; height: 100%; border-radius: 0; }

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
  background-color: var(--bg-secondary);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>