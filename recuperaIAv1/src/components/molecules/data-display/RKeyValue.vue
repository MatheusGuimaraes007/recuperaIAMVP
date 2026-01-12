<script setup>
/**
 * RKeyValue - Par Chave-Valor
 *
 * Componente molecule para exibir pares de informação chave-valor
 * com orientações horizontal e vertical.
 *
 * @example
 * <RKeyValue
 *   label="Nome"
 *   value="João Silva"
 *   orientation="horizontal"
 * />
 */

import { computed } from 'vue'
import RText from '@components/atoms/typography/RText.vue'

// Props
const props = defineProps({
  /**
   * Label/chave do par
   */
  label: {
    type: String,
    required: true
  },

  /**
   * Valor associado
   */
  value: {
    type: [String, Number],
    required: true
  },

  /**
   * Orientação do layout
   * @values horizontal, vertical
   */
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },

  /**
   * Tamanho do texto do label
   * @values xs, sm, base, lg
   */
  labelSize: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'base', 'lg'].includes(value)
  },

  /**
   * Tamanho do texto do value
   * @values xs, sm, base, lg
   */
  valueSize: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'base', 'lg'].includes(value)
  },

  /**
   * Peso da fonte do label
   * @values normal, medium, semibold, bold
   */
  labelWeight: {
    type: String,
    default: 'medium',
    validator: (value) => ['normal', 'medium', 'semibold', 'bold'].includes(value)
  },

  /**
   * Peso da fonte do value
   * @values normal, medium, semibold, bold
   */
  valueWeight: {
    type: String,
    default: 'semibold',
    validator: (value) => ['normal', 'medium', 'semibold', 'bold'].includes(value)
  },

  /**
   * Cor do label
   * @values primary, secondary, tertiary
   */
  labelColor: {
    type: String,
    default: 'secondary',
    validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value)
  },

  /**
   * Cor do value
   * @values primary, secondary, tertiary
   */
  valueColor: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value)
  },

  /**
   * Se deve mostrar dois pontos após o label
   */
  showColon: {
    type: Boolean,
    default: true
  },

  /**
   * Separador customizado (substitui os dois pontos)
   */
  separator: {
    type: String,
    default: null
  },

  /**
   * Largura do label (útil para alinhar múltiplos pares)
   */
  labelWidth: {
    type: String,
    default: null
  }
})

// Classes computadas
const containerClasses = computed(() => {
  return [
    'r-key-value',
    `r-key-value--${props.orientation}`
  ]
})

const labelText = computed(() => {
  if (props.separator) {
    return `${props.label}${props.separator}`
  }
  return props.showColon ? `${props.label}:` : props.label
})

const labelStyle = computed(() => {
  return props.labelWidth ? { width: props.labelWidth } : {}
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Label -->
    <RText
      :size="labelSize"
      :color="labelColor"
      :weight="labelWeight"
      :style="labelStyle"
      class="r-key-value__label"
    >
      {{ labelText }}
    </RText>

    <!-- Value -->
    <RText
      :size="valueSize"
      :color="valueColor"
      :weight="valueWeight"
      class="r-key-value__value"
    >
      <slot name="value">
        {{ value }}
      </slot>
    </RText>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-key-value {
  display: flex;
  gap: var(--spacing-2);
}

/* ============================================================================
   ORIENTATIONS
   ============================================================================ */

.r-key-value--horizontal {
  flex-direction: row;
  align-items: center;
}

.r-key-value--vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-1);
}

/* ============================================================================
   ELEMENTS
   ============================================================================ */

.r-key-value__label {
  flex-shrink: 0;
  line-height: 1.5;
}

.r-key-value__value {
  flex: 1;
  line-height: 1.5;
  word-break: break-word;
}

/* Horizontal - Value grows to fill space */
.r-key-value--horizontal .r-key-value__value {
  text-align: left;
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-key-value--horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
  }
}
</style>