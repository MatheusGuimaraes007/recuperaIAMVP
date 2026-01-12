<script setup>
/**
 * RSuccessState - Estado de Sucesso
 *
 * Componente molecule para exibir confirmações de sucesso
 * com ícone animado, mensagem e ação.
 *
 * @example
 * <RSuccessState
 *   title="Operação concluída!"
 *   description="Seus dados foram salvos com sucesso"
 *   actionLabel="Continuar"
 *   @action="handleContinue"
 * />
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

// Props
const props = defineProps({
  /**
   * Título principal
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Descrição adicional (opcional)
   */
  description: {
    type: String,
    default: null
  },

  /**
   * Label do botão de ação
   */
  actionLabel: {
    type: String,
    default: 'Continuar'
  },

  /**
   * Ícone a ser exibido
   */
  icon: {
    type: String,
    default: 'check'
  },

  /**
   * Tamanho do ícone
   */
  iconSize: {
    type: [String, Number],
    default: 40
  },

  /**
   * Tamanho do wrapper do ícone
   */
  iconWrapperSize: {
    type: Number,
    default: 80
  },

  /**
   * Variante do botão
   * @values primary, secondary, outline, ghost
   */
  actionVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },

  /**
   * Tamanho do botão
   * @values sm, md, lg
   */
  actionSize: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Largura máxima do conteúdo
   */
  maxWidth: {
    type: String,
    default: '480px'
  }
})

// Emits
const emit = defineEmits(['action'])

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
const handleAction = () => {
  emit('action')
}
</script>

<template>
  <div class="r-success-state" :style="containerStyle">
    <!-- Icon -->
    <div
      class="r-success-state__icon-wrapper"
      :style="iconWrapperStyle"
    >
      <RIcon
        :name="icon"
        :size="iconSize"
        class="r-success-state__icon"
      />
    </div>

    <!-- Title -->
    <RHeading level="3" class="r-success-state__title">
      {{ title }}
    </RHeading>

    <!-- Description -->
    <RText
      v-if="description"
      color="secondary"
      align="center"
      class="r-success-state__description"
    >
      {{ description }}
    </RText>

    <!-- Custom Content Slot -->
    <div v-if="$slots.default" class="r-success-state__custom-content">
      <slot />
    </div>

    <!-- Action Button -->
    <div v-if="actionLabel || $slots.action" class="r-success-state__action">
      <slot name="action">
        <RButton
          :variant="actionVariant"
          :size="actionSize"
          @click="handleAction"
        >
          {{ actionLabel }}
        </RButton>
      </slot>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-success-state {
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

.r-success-state__icon-wrapper {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-6);

  /* Style */
  border-radius: var(--radius-full);
  background-color: var(--color-success-50);

  /* Animation */
  animation: r-success-pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes r-success-pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ============================================================================
   ICON
   ============================================================================ */

.r-success-state__icon {
  color: var(--color-success);
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-success-state__title {
  margin-bottom: var(--spacing-2);
}

.r-success-state__description {
  line-height: 1.6;
  margin-top: var(--spacing-2);
  margin-bottom: var(--spacing-8);
}

.r-success-state__custom-content {
  margin-top: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

/* ============================================================================
   ACTION
   ============================================================================ */

.r-success-state__action {
  margin-top: auto;
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-success-state {
    padding: var(--spacing-6) var(--spacing-4);
  }

  .r-success-state__icon-wrapper {
    width: 64px !important;
    height: 64px !important;
  }

  .r-success-state__description {
    margin-bottom: var(--spacing-6);
  }
}
</style>