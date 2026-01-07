<script setup>
/**
 * RFormField - Molecule de Campo de Formulário
 * 
 * Combina RLabel + RInput + mensagem de erro em um único componente.
 * Integrado com Vee-Validate.
 * 
 * @example
 * <RFormField
 *   v-model="form.email"
 *   name="email"
 *   label="E-mail"
 *   type="email"
 *   placeholder="seu@email.com"
 *   rules="required|email"
 * />
 */

import { computed } from 'vue'
import { useField } from 'vee-validate'
import RLabel from '@components/atoms/typography/RLabel.vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  /**
   * Valor do campo (v-model)
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },

  /**
   * Nome do campo (para Vee-Validate)
   */
  name: {
    type: String,
    required: true
  },

  /**
   * Label do campo
   */
  label: {
    type: String,
    default: null
  },

  /**
   * Tipo do input
   */
  type: {
    type: String,
    default: 'text'
  },

  /**
   * Placeholder
   */
  placeholder: {
    type: String,
    default: null
  },

  /**
   * Texto de ajuda
   */
  helpText: {
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
   * Regras de validação (Vee-Validate)
   * Exemplos: 'required', 'email', 'min:8', 'required|email'
   */
  rules: {
    type: [String, Object, Function],
    default: null
  },

  /**
   * Disabled
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Tamanho
   */
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },

  /**
   * Ícone à esquerda
   */
  iconLeft: {
    type: String,
    default: null
  },

  /**
   * Ícone à direita
   */
  iconRight: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

// Vee-Validate integration
const {
  value: inputValue,
  errorMessage,
  handleChange,
  handleBlur
} = useField(() => props.name, props.rules, {
  initialValue: props.modelValue,
  validateOnValueUpdate: false
})

// Sync with v-model
const handleInput = (value) => {
  inputValue.value = value
  emit('update:modelValue', value)
  handleChange(value)
}

// Computed
const hasError = computed(() => !!errorMessage.value)
</script>

<template>
  <div class="r-form-field">
    <RInput
      :model-value="inputValue"
      :type="type"
      :label="label"
      :placeholder="placeholder"
      :help-text="helpText"
      :error="errorMessage"
      :required="required"
      :disabled="disabled"
      :size="size"
      :icon-left="iconLeft"
      :icon-right="iconRight"
      :name="name"
      @update:model-value="handleInput"
      @blur="handleBlur"
    >
      <!-- Pass through slots -->
      <template v-if="$slots['icon-left']" #icon-left>
        <slot name="icon-left" />
      </template>
      <template v-if="$slots['icon-right']" #icon-right>
        <slot name="icon-right" />
      </template>
    </RInput>
  </div>
</template>

<style scoped>
.r-form-field {
  width: 100%;
}
</style>
