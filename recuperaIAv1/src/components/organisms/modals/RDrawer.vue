<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import RIconButton from '@/components/atoms/buttons/RIconButton.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  position: { type: String, default: 'right' }, // right, left
  size: { type: String, default: 'md' } // sm (300px), md (500px), lg (800px)
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Bloquear scroll do body
watch(() => props.modelValue, (val) => {
  if (typeof document !== 'undefined') document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-black/50 transition-opacity" @click="close"></div>

      <div
          class="absolute inset-y-0 flex max-w-full"
          :class="position === 'right' ? 'right-0' : 'left-0'"
      >
        <div
            class="relative w-screen bg-bg-base shadow-xl flex flex-col transition-transform duration-300 transform"
            :class="{
            'max-w-xs': size === 'sm',
            'max-w-md': size === 'md',
            'max-w-2xl': size === 'lg'
          }"
        >
          <div class="flex items-center justify-between px-4 py-3 border-b border-border-light bg-bg-primary">
            <RHeading level="4">{{ title }}</RHeading>
            <RIconButton icon="x" variant="ghost" @click="close"  aria-label=""/>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <slot />
          </div>

          <div v-if="$slots.footer" class="border-t border-border-light p-4 bg-bg-secondary">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>