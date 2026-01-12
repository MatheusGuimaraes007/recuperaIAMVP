<script setup>
/**
 * RStatusFilter - Filtro de Status com Select
 *
 * Componente molecule para filtrar por status usando um select
 * com opção "Todos" automática.
 *
 * @example
 * <RStatusFilter
 *   v-model="statusFilter"
 *   :options="statusOptions"
 *   label="Status"
 *   @change="handleStatusChange"
 * />
 */

import { computed } from 'vue'
import RSelect from '@components/atoms/inputs/RSelect.vue'

// Props
const props = defineProps({
  /**
   * Valor selecionado (v-model)
   */
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },

  /**
   * Opções de status
   * Formato: [{ label: 'Ativo', value: 'active' }]
   */
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option =>
        typeof option === 'object' &&
        'label' in option &&
        'value' in option
      )
    }
  },

  /**
   * Label do select
   */
  label: {
    type: String,
    default: 'Status'
  },

  /**
   * Label da opção "Todos"
   */
  allLabel: {
    type: String,
    default: 'Todos'
  },

  /**
   * Valor para a opção "Todos"
   */
  allValue: {
    type: [String, Number, Boolean],
    default: null
  },

  /**
   * Se deve incluir opção "Todos"
   */
  includeAll: {
    type: Boolean,
    default: true
  },

  /**
   * Tamanho do select
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Se está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Placeholder quando nada selecionado
   */
  placeholder: {
    type: String,
    default: null
  },

  /**
   * Se é obrigatório
   */
  required: {
    type: Boolean,
    default: false
  },

  /**
   * Texto de ajuda
   */
  helpText: {
    type: String,
    default: null
  },

  /**
   * Se deve mostrar ícone de status nas opções
   */
  showStatusIcons: {
    type: Boolean,
    default: false
  },

  /**
   * Largura mínima
   */
  minWidth: {
    type: String,
    default: '150px'
  },

  /**
   * Largura máxima
   */
  maxWidth: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'change'
])

// Computed
const allOptions = computed(() => {
  const opts = [...props.options]

  if (props.includeAll) {
    opts.unshift({
      label: props.allLabel,
      value: props.allValue
    })
  }

  return opts
})

const containerStyle = computed(() => {
  const style = {
    minWidth: props.minWidth
  }

  if (props.maxWidth) {
    style.maxWidth = props.maxWidth
  }

  return style
})

// Methods
const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="r-status-filter" :style="containerStyle">
    <RSelect
      :model-value="modelValue"
      :options="allOptions"
      :label="label"
      :size="size"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      :help-text="helpText"
      @update:model-value="handleChange"
    >
      <!-- Pass through slots -->
      <template v-if="$slots.label" #label>
        <slot name="label" />
      </template>

      <template v-if="$slots.option" #option="{ option }">
        <slot name="option" :option="option" />
      </template>

      <template v-if="$slots.helpText" #helpText>
        <slot name="helpText" />
      </template>
    </RSelect>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-status-filter {
  width: 100%;
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-status-filter {
    min-width: unset;
    max-width: unset;
  }
}
</style>