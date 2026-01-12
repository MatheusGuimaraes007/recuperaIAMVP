<script setup>
/**
 * REmailInput - Input de E-mail com Validação
 *
 * Componente molecule para entrada de e-mail com validação
 * automática de formato.
 *
 * @example
 * <REmailInput
 *   v-model="email"
 *   label="E-mail"
 *   :required="true"
 *   @validation="handleValidation"
 * />
 */

import { ref, watch, computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

// Props
const props = defineProps({
  /**
   * Valor do campo (v-model)
   */
  modelValue: {
    type: String,
    default: ''
  },

  /**
   * Label do campo
   */
  label: {
    type: String,
    default: 'E-mail'
  },

  /**
   * Placeholder
   */
  placeholder: {
    type: String,
    default: 'exemplo@empresa.com'
  },

  /**
   * Se está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Se é obrigatório
   */
  required: {
    type: Boolean,
    default: false
  },

  /**
   * Nome do campo
   */
  name: {
    type: String,
    default: 'email'
  },

  /**
   * Tamanho do input
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Texto de ajuda
   */
  helpText: {
    type: String,
    default: null
  },

  /**
   * Se valida apenas no blur (padrão) ou em tempo real
   */
  validateOnBlur: {
    type: Boolean,
    default: true
  },

  /**
   * Regex customizado de validação
   */
  customValidation: {
    type: RegExp,
    default: null
  },

  /**
   * Se deve auto-focar
   */
  autofocus: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'validation',
  'blur',
  'focus'
])

// State
const internalError = ref(null)

// Computed
const emailRegex = computed(() => {
  return props.customValidation || /^[^\s@]+@[^\s@]+\.[^\s@]+$/
})

// Methods
const validate = (value) => {
  // Se vazio e não obrigatório, é válido
  if (!value && !props.required) {
    internalError.value = null
    emit('validation', { valid: true, error: null })
    return true
  }

  // Se vazio e obrigatório
  if (!value && props.required) {
    internalError.value = 'E-mail é obrigatório.'
    emit('validation', { valid: false, error: internalError.value })
    return false
  }

  // Valida formato
  if (value && !emailRegex.value.test(value)) {
    internalError.value = 'Formato de e-mail inválido.'
    emit('validation', { valid: false, error: internalError.value })
    return false
  }

  // Válido
  internalError.value = null
  emit('validation', { valid: true, error: null })
  return true
}

const handleInput = (value) => {
  emit('update:modelValue', value)

  // Valida em tempo real se não for validateOnBlur
  if (!props.validateOnBlur) {
    validate(value)
  } else if (internalError.value) {
    // Limpa erro enquanto digita se já houver erro
    validate(value)
  }
}

const handleBlur = (event) => {
  if (props.validateOnBlur) {
    validate(props.modelValue)
  }
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

// Watch para validação externa
watch(() => props.modelValue, (newVal) => {
  if (!props.validateOnBlur && newVal !== '') {
    validate(newVal)
  }
})
</script>

<template>
  <RInput
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :error="internalError"
    :disabled="disabled"
    :required="required"
    :name="name"
    :size="size"
    :help-text="helpText"
    :autofocus="autofocus"
    type="email"
    icon-left="mail"
    autocomplete="email"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  >
    <!-- Pass through slots -->
    <template v-if="$slots['icon-right']" #icon-right>
      <slot name="icon-right" />
    </template>
  </RInput>
</template>