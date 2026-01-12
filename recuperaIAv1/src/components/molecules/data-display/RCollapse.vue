<script setup>
/**
 * RCollapse - Painel Colapsável
 *
 * Componente molecule para criar painéis expansíveis/colapsáveis,
 * ideal para FAQs, acordeões e seções de conteúdo expansível.
 *
 * @example
 * <RCollapse
 *   title="Detalhes do Paciente"
 *   :defaultOpen="false"
 * >
 *   <p>Conteúdo do painel...</p>
 * </RCollapse>
 */

import { ref, computed, watch } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RText from '@components/atoms/typography/RText.vue'

// Props
const props = defineProps({
  /**
   * Título do painel
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Se inicia aberto
   */
  defaultOpen: {
    type: Boolean,
    default: false
  },

  /**
   * Controle externo do estado (v-model)
   */
  modelValue: {
    type: Boolean,
    default: null
  },

  /**
   * Ícone do indicador de expansão
   */
  expandIcon: {
    type: String,
    default: 'chevron-down'
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
  },

  /**
   * Se desabilita o painel
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Variante visual
   * @values default, card
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'card'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'toggle', 'open', 'close'])

// State
const isOpen = ref(props.modelValue !== null ? props.modelValue : props.defaultOpen)

// Watch modelValue para controle externo
watch(() => props.modelValue, (newVal) => {
  if (newVal !== null) {
    isOpen.value = newVal
  }
})

// Classes computadas
const collapseClasses = computed(() => {
  const classes = ['r-collapse', `r-collapse--${props.variant}`]

  if (isOpen.value) {
    classes.push('r-collapse--open')
  }

  if (props.bordered) {
    classes.push('r-collapse--bordered')
  }

  if (props.disabled) {
    classes.push('r-collapse--disabled')
  }

  return classes
})

const iconClasses = computed(() => {
  return [
    'r-collapse__icon',
    { 'r-collapse__icon--rotated': isOpen.value }
  ]
})

// Methods
const toggle = () => {
  if (props.disabled) return

  isOpen.value = !isOpen.value

  emit('update:modelValue', isOpen.value)
  emit('toggle', isOpen.value)

  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }
}
</script>

<template>
  <div :class="collapseClasses">
    <!-- Header -->
    <button
      class="r-collapse__header"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-disabled="disabled"
      @click="toggle"
    >
      <div class="r-collapse__header-content">
        <!-- Title Slot -->
        <slot name="title">
          <RText weight="medium" class="r-collapse__title">
            {{ title }}
          </RText>
        </slot>

        <!-- Custom Header Actions -->
        <slot name="header-actions" />
      </div>

      <!-- Expand Icon -->
      <RIcon
        :name="expandIcon"
        :size="iconSize"
        :class="iconClasses"
      />
    </button>

    <!-- Content -->
    <transition
      name="r-collapse-content"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div v-show="isOpen" class="r-collapse__content-wrapper">
        <div class="r-collapse__content">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// Transition hooks para animação suave de altura
export default {
  methods: {
    onEnter(el) {
      el.style.height = '0'
      el.offsetHeight // Force reflow
      el.style.height = el.scrollHeight + 'px'
    },
    onAfterEnter(el) {
      el.style.height = 'auto'
    },
    onLeave(el) {
      el.style.height = el.scrollHeight + 'px'
      el.offsetHeight // Force reflow
      el.style.height = '0'
    }
  }
}
</script>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-collapse {
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-primary);

  /* Transition */
  transition: box-shadow var(--transition-normal) var(--easing-out);
}

/* ============================================================================
   VARIANTS
   ============================================================================ */

.r-collapse--bordered {
  border: 1px solid var(--color-border-light);
}

.r-collapse--card {
  box-shadow: var(--shadow-sm);
}

.r-collapse--card:hover:not(.r-collapse--disabled) {
  box-shadow: var(--shadow-md);
}

/* ============================================================================
   HEADER
   ============================================================================ */

.r-collapse__header {
  /* Layout */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);

  /* Style */
  background-color: transparent;
  border: none;

  /* Interaction */
  cursor: pointer;
  text-align: left;

  /* Transition */
  transition: background-color var(--transition-fast) var(--easing-out);
}

.r-collapse__header:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
}

.r-collapse__header:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.r-collapse__header:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.r-collapse__header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex: 1;
  min-width: 0;
}

.r-collapse__title {
  flex: 1;
  min-width: 0;
}

/* ============================================================================
   ICON
   ============================================================================ */

.r-collapse__icon {
  flex-shrink: 0;
  color: var(--color-text-secondary);

  /* Transition */
  transition: transform var(--transition-normal) var(--easing-out),
              color var(--transition-fast) var(--easing-out);
}

.r-collapse__icon--rotated {
  transform: rotate(180deg);
}

.r-collapse__header:hover:not(:disabled) .r-collapse__icon {
  color: var(--color-text-primary);
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.r-collapse__content-wrapper {
  overflow: hidden;

  /* Transition for height animation */
  transition: height var(--transition-normal) var(--easing-out);
}

.r-collapse__content {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border-light);
  background-color: var(--color-bg-primary);
}

/* Remove border quando não tem borda externa */
.r-collapse:not(.r-collapse--bordered) .r-collapse__content {
  border-top-color: var(--color-border-light);
}

/* ============================================================================
   TRANSITION CLASSES
   ============================================================================ */

.r-collapse-content-enter-active,
.r-collapse-content-leave-active {
  transition: height var(--transition-normal) var(--easing-out),
              opacity var(--transition-normal) var(--easing-out);
}

.r-collapse-content-enter-from,
.r-collapse-content-leave-to {
  opacity: 0;
}

/* ============================================================================
   DISABLED STATE
   ============================================================================ */

.r-collapse--disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* ============================================================================
   OPEN STATE
   ============================================================================ */

.r-collapse--open .r-collapse__header {
  background-color: var(--color-bg-secondary);
}
</style>