<script setup>
/**
 * REmptyState - Estado Vazio
 *
 * Componente molecule para exibir telas de estado vazio
 * com ícone, mensagem e ação opcional.
 *
 * @example
 * <REmptyState
 *   icon="inbox"
 *   title="Nenhum item encontrado"
 *   description="Adicione seu primeiro item para começar"
 *   actionLabel="Adicionar Item"
 *   @action="handleAddItem"
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
   * Ícone a ser exibido
   */
  icon: {
    type: String,
    default: 'inbox'
  },

  /**
   * Tamanho do ícone
   */
  iconSize: {
    type: [String, Number],
    default: 48
  },

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
   * Label do botão de ação (se null, não exibe)
   */
  actionLabel: {
    type: String,
    default: null
  },

  /**
   * Variante do botão de ação
   * @values primary, secondary, outline, ghost
   */
  actionVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },

  /**
   * Tamanho do botão de ação
   * @values sm, md, lg
   */
  actionSize: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Tamanho do wrapper do ícone
   */
  iconWrapperSize: {
    type: Number,
    default: 80
  },

  /**
   * Cor de fundo do wrapper do ícone
   */
  iconBackground: {
    type: String,
    default: null
  },

  /**
   * Cor do ícone
   */
  iconColor: {
    type: String,
    default: null
  },

  /**
   * Largura máxima do conteúdo
   */
  maxWidth: {
    type: String,
    default: '400px'
  },

  /**
   * Se deve ter espaçamento vertical maior
   */
  spacious: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['action'])

// Computed
const containerClasses = computed(() => {
  const classes = ['r-empty-state']

  if (props.spacious) {
    classes.push('r-empty-state--spacious')
  }

  return classes
})

const iconWrapperStyle = computed(() => {
  const style = {
    width: `${props.iconWrapperSize}px`,
    height: `${props.iconWrapperSize}px`
  }

  if (props.iconBackground) {
    style.backgroundColor = props.iconBackground
  }

  return style
})

const iconStyle = computed(() => {
  if (props.iconColor) {
    return { color: props.iconColor }
  }
  return {}
})

const contentStyle = computed(() => {
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
  <div :class="containerClasses">
    <!-- Icon -->
    <div
      class="r-empty-state__icon-wrapper"
      :style="iconWrapperStyle"
    >
      <RIcon
        :name="icon"
        :size="iconSize"
        :style="iconStyle"
        class="r-empty-state__icon"
      />
    </div>

    <!-- Content -->
    <div class="r-empty-state__content" :style="contentStyle">
      <!-- Title -->
      <RHeading level="4" class="r-empty-state__title">
        {{ title }}
      </RHeading>

      <!-- Description -->
      <RText
        v-if="description"
        color="secondary"
        align="center"
        class="r-empty-state__description"
      >
        {{ description }}
      </RText>

      <!-- Custom Content Slot -->
      <div v-if="$slots.default" class="r-empty-state__custom-content">
        <slot />
      </div>
    </div>

    <!-- Action Button -->
    <div v-if="actionLabel || $slots.action" class="r-empty-state__action">
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

.r-empty-state {
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;

  /* Min height para ocupar espaço razoável */
  min-height: 300px;
}

.r-empty-state--spacious {
  padding: var(--spacing-12) var(--spacing-4);
  min-height: 400px;
}

/* ============================================================================
   ICON WRAPPER
   ============================================================================ */

.r-empty-state__icon-wrapper {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);

  /* Style */
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-full);

  /* Transition */
  transition: transform var(--transition-normal) var(--easing-out),
              background-color var(--transition-normal) var(--easing-out);
}

.r-empty-state:hover .r-empty-state__icon-wrapper {
  transform: scale(1.05);
}

/* ============================================================================
   ICON
   ============================================================================ */

.r-empty-state__icon {
  color: var(--color-text-tertiary);
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-empty-state__content {
  width: 100%;
  margin: 0 auto;
}

.r-empty-state__title {
  margin-bottom: var(--spacing-2);
}

.r-empty-state__description {
  line-height: 1.6;
  margin-top: var(--spacing-2);
}

.r-empty-state__custom-content {
  margin-top: var(--spacing-4);
}

/* ============================================================================
   ACTION
   ============================================================================ */

.r-empty-state__action {
  margin-top: var(--spacing-6);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-empty-state {
    padding: var(--spacing-6) var(--spacing-4);
    min-height: 250px;
  }

  .r-empty-state--spacious {
    padding: var(--spacing-8) var(--spacing-4);
    min-height: 300px;
  }

  .r-empty-state__icon-wrapper {
    width: 64px !important;
    height: 64px !important;
  }
}
</style>