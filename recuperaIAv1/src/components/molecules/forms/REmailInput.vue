<script setup>
import { ref, watch } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'E-mail' },
  placeholder: { type: String, default: 'exemplo@empresa.com' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  /**
   * Se true, valida apenas quando o usuário sai do campo (blur)
   */
  validateOnBlur: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'validation'])

const internalError = ref(null)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (val) => {
  if (!val && props.required) {
    internalError.value = 'E-mail é obrigatório.'
    emit('validation', { valid: false, error: internalError.value })
    return
  }

  if (val && !emailRegex.test(val)) {
    internalError.value = 'Formato de e-mail inválido.'
    emit('validation', { valid: false, error: internalError.value })
    return
  }

  internalError.value = null
  emit('validation', { valid: true, error: null })
}

const handleInput = (val) => {
  emit('update:modelValue', val)
  if (!props.validateOnBlur) validate(val)
  else if (internalError.value) validate(val) // Limpa erro enquanto digita se já houver erro
}

const handleBlur = (e) => {
  if (props.validateOnBlur) validate(props.modelValue)
}
</script>

<template>
  <RInput
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :error="internalError"
    :disabled="disabled"
    :required="required"
    type="email"
    icon-left="mail"
    @update:model-value="handleInput"
    @blur="handleBlur"
  />
</template>