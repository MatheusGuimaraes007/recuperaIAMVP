<script setup>
/**
 * RAlertBanner - Banner de Alerta
 *
 * Componente molecule para exibir alertas e notificações
 * com diferentes variantes semânticas e ação de fechar.
 *
 * @example
 * <RAlertBanner
 *   variant="success"
 *   title="Sucesso!"
 *   :closable="true"
 *   @close="handleClose"
 * >
 *   Operação realizada com sucesso.
 * </RAlertBanner>
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

// Props
const props = defineProps({
  /**
   * Variante visual semântica
   * @values info, success, warning, error
   */
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },

  /**
   * Título do alerta (opcional)
   */
  title: {
    type: String,
    default: null
  },

  /**
   * Se pode ser fechado
   */
  closable: {
    type: Boolean,
    default: false
  },

  /**
   * Ícone customizado (substitui o ícone padrão da variante)
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
    default: 20
  },

  /**
   * Se tem borda
   */
  bordered: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close'])

// Ícones padrão por variante
const defaultIcons = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle'
}

// Computed
const iconName = computed(() => {
  return props.customIcon || defaultIcons[props.variant]
})

const alertClasses = computed(() => {
  const classes = [
    'r-alert',
    `r-alert--${props.variant}`
  ]

  if (props.bordered) {
    classes.push('r-alert--bordered')
  }

  return classes
})

// Handlers
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div :class="alertClasses" role="alert">
    <!-- Icon -->
    <div class="r-alert__icon">
      <RIcon :name="iconName" :size="iconSize" />
    </div>

    <!-- Content -->
    <div class="r-alert__content">
      <!-- Title -->
      <RText
        v-if="title"
        weight="semibold"
        class="r-alert__title"
      >
        {{ title }}
      </RText>

      <!-- Description -->
      <div class="r-alert__description">
        <slot />
      </div>
    </div>

    <!-- Close Button -->
    <div v-if="closable" class="r-alert__action">
      <RIconButton
        icon="x"
        variant="ghost"
        size="sm"
        aria-label="Fechar alerta"
        @click="handleClose"
      />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-alert {
  /* Layout */
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);

  /* Style */
  border-radius: var(--radius-md);
  border: 1px solid transparent;

  /* Typography */
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.r-alert--bordered {
  border-width: 1px;
}

/* ============================================================================
   ICON
   ============================================================================ */

.r-alert__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px; /* Alinhamento óptico com texto */
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-alert__content {
  flex: 1;
  min-width: 0;
}

.r-alert__title {
  display: block;
  margin-bottom: var(--spacing-1);
}

.r-alert__description {
  color: inherit;
}

/* ============================================================================
   ACTION
   ============================================================================ */

.r-alert__action {
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
}

/* ============================================================================
   VARIANTS
   ============================================================================ */

/* Info */
.r-alert--info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

.r-alert--info.r-alert--bordered {
  border-color: var(--color-info-100);
}

.r-alert--info .r-alert__icon {
  color: var(--color-info);
}

/* Success */
.r-alert--success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.r-alert--success.r-alert--bordered {
  border-color: var(--color-success-100);
}

.r-alert--success .r-alert__icon {
  color: var(--color-success);
}

/* Warning */
.r-alert--warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.r-alert--warning.r-alert--bordered {
  border-color: var(--color-warning-100);
}

.r-alert--warning .r-alert__icon {
  color: var(--color-warning);
}

/* Error */
.r-alert--error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}

.r-alert--error.r-alert--bordered {
  border-color: var(--color-error-100);
}

.r-alert--error .r-alert__icon {
  color: var(--color-error);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-alert {
    padding: var(--spacing-3);
  }
}
</style>