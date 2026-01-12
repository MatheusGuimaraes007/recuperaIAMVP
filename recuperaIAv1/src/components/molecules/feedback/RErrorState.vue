<script setup>
/**
 * RErrorState - Estado de Erro
 *
 * Componente molecule para exibir erros com mensagem,
 * código de erro opcional e ação de retry.
 *
 * @example
 * <RErrorState
 *   title="Erro ao carregar dados"
 *   message="Não foi possível conectar ao servidor"
 *   errorCode="ERR_CONNECTION_FAILED"
 *   retryLabel="Tentar novamente"
 *   @retry="handleRetry"
 * />
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RCode from '@components/atoms/typography/RCode.vue'

// Props
const props = defineProps({
  /**
   * Título do erro
   */
  title: {
    type: String,
    default: 'Algo deu errado'
  },

  /**
   * Mensagem de erro detalhada
   */
  message: {
    type: String,
    default: null
  },

  /**
   * Código do erro (opcional)
   */
  errorCode: {
    type: String,
    default: null
  },

  /**
   * Label do botão de retry
   */
  retryLabel: {
    type: String,
    default: 'Tentar novamente'
  },

  /**
   * Ícone a ser exibido
   */
  icon: {
    type: String,
    default: 'alert-circle'
  },

  /**
   * Tamanho do ícone
   */
  iconSize: {
    type: [String, Number],
    default: 48
  },

  /**
   * Tamanho do wrapper do ícone
   */
  iconWrapperSize: {
    type: Number,
    default: 80
  },

  /**
   * Variante do botão de retry
   * @values primary, secondary, outline, ghost
   */
  retryVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },

  /**
   * Tamanho do botão
   * @values sm, md, lg
   */
  retrySize: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Largura máxima do conteúdo
   */
  maxWidth: {
    type: String,
    default: '500px'
  }
})

// Emits
const emit = defineEmits(['retry'])

// Computed
const iconWrapperStyle = computed(() => {
  return {
    width: `${props.iconWrapperSize}px`,
    height: `${props.iconWrapperSize}px`
  }
})

const containerStyle = computed(() => {
  return {
    maxWidth: props.maxWidth
  }
})

// Handlers
const handleRetry = () => {
  emit('retry')
}
</script>

<template>
  <div class="r-error-state" :style="containerStyle">
    <!-- Icon -->
    <div
      class="r-error-state__icon-wrapper"
      :style="iconWrapperStyle"
    >
      <RIcon
        :name="icon"
        :size="iconSize"
        class="r-error-state__icon"
      />
    </div>

    <!-- Title -->
    <RHeading
      level="3"
      class="r-error-state__title"
    >
      {{ title }}
    </RHeading>

    <!-- Message -->
    <RText
      v-if="message"
      color="secondary"
      align="center"
      class="r-error-state__message"
    >
      {{ message }}
    </RText>

    <!-- Error Code -->
    <RCode v-if="errorCode" class="r-error-state__code">
      {{ errorCode }}
    </RCode>

    <!-- Custom Content Slot -->
    <div v-if="$slots.default" class="r-error-state__custom-content">
      <slot />
    </div>

    <!-- Retry Button -->
    <div v-if="retryLabel || $slots.action" class="r-error-state__action">
      <slot name="action">
        <RButton
          :variant="retryVariant"
          :size="retrySize"
          @click="handleRetry"
        >
          {{ retryLabel }}
        </RButton>
      </slot>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-error-state {
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-8);
  margin: 0 auto;
}

/* ============================================================================
   ICON WRAPPER
   ============================================================================ */

.r-error-state__icon-wrapper {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);

  /* Style */
  border-radius: var(--radius-full);
  background-color: var(--color-error-50);

  /* Animation */
  animation: r-error-shake 0.5s ease-in-out;
}

@keyframes r-error-shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}

/* ============================================================================
   ICON
   ============================================================================ */

.r-error-state__icon {
  color: var(--color-error);
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-error-state__title {
  margin-bottom: var(--spacing-2);
  color: var(--color-error-700);
}

.r-error-state__message {
  line-height: 1.6;
  margin-top: var(--spacing-2);
}

.r-error-state__code {
  margin-top: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.r-error-state__custom-content {
  margin-top: var(--spacing-4);
}

/* ============================================================================
   ACTION
   ============================================================================ */

.r-error-state__action {
  margin-top: var(--spacing-6);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-error-state {
    padding: var(--spacing-6) var(--spacing-4);
  }

  .r-error-state__icon-wrapper {
    width: 64px !important;
    height: 64px !important;
  }
}
</style>