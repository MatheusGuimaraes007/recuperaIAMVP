<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(v)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  preventScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'open'])

const sizeClasses = {
  xs: 'max-w-sm',
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-full mx-4'
}

const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    emit('close')
  }
}

const handleEscape = (event) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

// Prevent body scroll when modal is open
watch(() => props.isOpen, (newValue) => {
  if (props.preventScroll) {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      emit('open')
    } else {
      document.body.style.overflow = ''
    }
  }
})

onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  if (props.preventScroll) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isOpen"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="handleBackdropClick"
      >
        <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
          <div
              v-if="isOpen"
              :class="[
              'bg-background-card rounded-2xl shadow-2xl border border-border w-full max-h-[90vh] flex flex-col',
              sizeClasses[size]
            ]"
              @click.stop
          >
            <div
                v-if="title || subtitle || showClose || $slots.header"
                class="flex items-start justify-between p-6 border-b border-border flex-shrink-0"
            >
              <slot name="header">
                <div class="flex-1 min-w-0 pr-4">
                  <h3
                      v-if="title"
                      class="text-xl font-bold text-white leading-tight mb-1"
                  >
                    {{ title }}
                  </h3>
                  <p
                      v-if="subtitle"
                      class="text-sm text-gray-400 leading-relaxed"
                  >
                    {{ subtitle }}
                  </p>
                </div>
              </slot>

              <button
                  v-if="showClose"
                  @click="emit('close')"
                  class="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  aria-label="Fechar modal"
              >
                <X :size="20" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
              <slot />
            </div>

            <div
                v-if="$slots.footer"
                class="p-6 border-t border-border flex-shrink-0 bg-background-base/50"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Smooth scrolling for modal body */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>

