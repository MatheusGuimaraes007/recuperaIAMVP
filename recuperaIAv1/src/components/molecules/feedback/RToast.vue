<script setup>
/**
 * RToast - Notificação Toast
 *
 * Componente molecule para exibir notificações temporárias
 * tipo toast com fechamento automático.
 *
 * @example
 * <RToast
 *   type="success"
 *   title="Salvo!"
 *   message="Dados salvos com sucesso"
 *   :duration="3000"
 *   @close="handleClose"
 * />
 */

import { onMounted, computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'

// Props
const props = defineProps({
  /**
   * Tipo/variante do toast
   * @values success, error, warning, info
   */
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },

  /**
   * Título do toast
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Mensagem adicional (opcional)
   */
  message: {
    type: String,
    default: null
  },

  /**
   * Duração em ms (0 = não fecha automaticamente)
   */
  duration: {
    type: Number,
    default: 3000,
    validator: (value) => value >= 0
  },

  /**
   * Ícone customizado
   */
  customIcon: {
    type: String,
    default: null
  },

  /**
   * Tamanho do ícone
   */
  iconSize: {
    type: [String, Number],
    default: 24
  },

  /**
   * Se pode ser fechado manualmente
   */
  closable: {
    type: Boolean,
    default: true
  },

  /**
   * Posição na tela
   * @values top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
   */
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(value)
  }
})

// Emits
const emit = defineEmits(['close'])

// Ícones padrão por tipo
const defaultIcons = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info'
}

// Computed
const iconName = computed(() => {
  return props.customIcon || defaultIcons[props.type]
})

const toastClasses = computed(() => {
  return [
    'r-toast',
    `r-toast--${props.type}`,
    `r-toast--${props.position}`
  ]
})

// Auto-close após duration
onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})

// Handlers
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div :class="toastClasses" role="alert" aria-live="polite">
    <!-- Icon -->
    <div class="r-toast__icon-wrapper">
      <RIcon :name="iconName" :size="iconSize" />
    </div>

    <!-- Content -->
    <div class="r-toast__content">
      <!-- Title -->
      <RText weight="semibold" class="r-toast__title">
        {{ title }}
      </RText>

      <!-- Message -->
      <RText
        v-if="message"
        size="sm"
        color="secondary"
        class="r-toast__message"
      >
        {{ message }}
      </RText>

      <!-- Custom Content Slot -->
      <slot />
    </div>

    <!-- Close Button -->
    <button
      v-if="closable"
      class="r-toast__close"
      aria-label="Fechar notificação"
      @click="handleClose"
    >
      <RIcon name="x" size="16" />
    </button>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-toast {
  /* Layout */
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  min-width: 300px;
  max-width: 400px;

  /* Style */
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  border-left: 4px solid;

  /* Animation */
  animation: r-toast-slide-in var(--transition-normal) var(--easing-out);
}

/* ============================================================================
   ANIMATIONS
   ============================================================================ */

@keyframes r-toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes r-toast-slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes r-toast-slide-in-top {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes r-toast-slide-in-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ============================================================================
   POSITION ANIMATIONS
   ============================================================================ */

.r-toast--top-left,
.r-toast--bottom-left {
  animation-name: r-toast-slide-in-left;
}

.r-toast--top-center {
  animation-name: r-toast-slide-in-top;
}

.r-toast--bottom-center {
  animation-name: r-toast-slide-in-bottom;
}

/* ============================================================================
   ICON WRAPPER
   ============================================================================ */

.r-toast__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-toast__content {
  flex: 1;
  min-width: 0;
}

.r-toast__title {
  display: block;
  margin-bottom: var(--spacing-1);
}

.r-toast__message {
  display: block;
  line-height: 1.5;
}

/* ============================================================================
   CLOSE BUTTON
   ============================================================================ */

.r-toast__close {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-1);
  flex-shrink: 0;

  /* Style */
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);

  /* Interaction */
  cursor: pointer;
  opacity: 0.6;

  /* Transition */
  transition: opacity var(--transition-fast) var(--easing-out),
              background-color var(--transition-fast) var(--easing-out);
}

.r-toast__close:hover {
  opacity: 1;
  background-color: var(--color-gray-100);
}

/* ============================================================================
   TYPES / VARIANTS
   ============================================================================ */

/* Success */
.r-toast--success {
  border-left-color: var(--color-success);
}

.r-toast--success .r-toast__icon-wrapper {
  color: var(--color-success);
}

/* Error */
.r-toast--error {
  border-left-color: var(--color-error);
}

.r-toast--error .r-toast__icon-wrapper {
  color: var(--color-error);
}

/* Warning */
.r-toast--warning {
  border-left-color: var(--color-warning);
}

.r-toast--warning .r-toast__icon-wrapper {
  color: var(--color-warning);
}

/* Info */
.r-toast--info {
  border-left-color: var(--color-info);
}

.r-toast--info .r-toast__icon-wrapper {
  color: var(--color-info);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-toast {
    min-width: 280px;
    max-width: 100%;
    margin: 0 var(--spacing-4);
  }
}
</style>