<script setup>
import { watch } from 'vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: null },
  position: { type: String, default: 'right', validator: v => ['left','right','top','bottom'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['sm','md','lg','xl'].includes(v) }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="r-drawer-overlay">
      <div v-if="modelValue" class="r-drawer-overlay" @click.self="close">
        <Transition :name="`r-drawer-${position}`">
          <div :class="['r-drawer', `r-drawer--${position}`, `r-drawer--${size}`]">
            <header v-if="title" class="r-drawer__header">
              <RHeading level="4">{{ title }}</RHeading>
              <RIconButton icon="x" variant="ghost" @click="close" />
            </header>
            <div class="r-drawer__body">
              <slot />
            </div>
            <footer v-if="$slots.footer" class="r-drawer__footer">
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.r-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
}
.r-drawer {
  position: fixed;
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}
.r-drawer--right { right: 0; top: 0; bottom: 0; }
.r-drawer--left { left: 0; top: 0; bottom: 0; }
.r-drawer--top { top: 0; left: 0; right: 0; }
.r-drawer--bottom { bottom: 0; left: 0; right: 0; }
.r-drawer--sm { width: 320px; }
.r-drawer--md { width: 480px; }
.r-drawer--lg { width: 640px; }
.r-drawer--xl { width: 800px; }
.r-drawer__header {
  padding: var(--spacing-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-light);
}
.r-drawer__body {
  flex: 1;
  padding: var(--spacing-4);
  overflow-y: auto;
}
.r-drawer__footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border-light);
}
.r-drawer-overlay-enter-active, .r-drawer-overlay-leave-active {
  transition: opacity 0.3s;
}
.r-drawer-overlay-enter-from, .r-drawer-overlay-leave-to {
  opacity: 0;
}
.r-drawer-right-enter-active, .r-drawer-right-leave-active {
  transition: transform 0.3s;
}
.r-drawer-right-enter-from { transform: translateX(100%); }
.r-drawer-right-leave-to { transform: translateX(100%); }
.r-drawer-left-enter-from { transform: translateX(-100%); }
.r-drawer-left-leave-to { transform: translateX(-100%); }
</style>