<script setup>
/**
 * RPhoneInput - Input de Telefone com Máscara
 *
 * Componente molecule para entrada de telefone com formatação
 * automática brasileira (XX) XXXXX-XXXX.
 *
 * @example
 * <RPhoneInput
 *   v-model="phone"
 *   label="Telefone"
 *   :required="true"
 * />
 */

import { computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Telefone' },
  placeholder: { type: String, default: '(00) 00000-0000' },
  error: { type: [Boolean, String], default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: 'phone' },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  helpText: { type: String, default: null },
  autofocus: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const formatPhone = (value) => {
  if (!value) return ''
  let numbers = value.replace(/\D/g, '')
  if (numbers.length > 11) numbers = numbers.slice(0, 11)

  if (numbers.length > 10) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else if (numbers.length > 5) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  } else if (numbers.length > 2) {
    return numbers.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
  } else if (numbers.length > 0) {
    return numbers.replace(/^(\d*)/, '($1')
  }
  return ''
}

const handleInput = (value) => {
  const formatted = formatPhone(value)
  emit('update:modelValue', formatted)
}
</script>

<template>
  <RInput
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :error="error"
    :disabled="disabled"
    :required="required"
    :name="name"
    :size="size"
    :help-text="helpText"
    :autofocus="autofocus"
    type="tel"
    icon-left="phone"
    autocomplete="tel"
    @update:model-value="handleInput"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>