<script setup>
import { ref, watch } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: null },
  error: { type: [Boolean, String], default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const formatPhone = (value) => {
  if (!value) return ''

  // Remove tudo que não é dígito
  let numbers = value.replace(/\D/g, '')

  // Limita a 11 dígitos
  if (numbers.length > 11) numbers = numbers.slice(0, 11)

  // Máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (numbers.length > 10) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else if (numbers.length > 5) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  } else if (numbers.length > 2) {
    return numbers.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
  } else {
    return numbers
  }
}

const handleInput = (val) => {
  const formatted = formatPhone(val)
  emit('update:modelValue', formatted)
}
</script>

<template>
  <RInput
    :model-value="modelValue"
    :label="label"
    :error="error"
    :disabled="disabled"
    :required="required"
    placeholder="(00) 00000-0000"
    icon-left="phone"
    @update:model-value="handleInput"
    maxlength="15"
  />
</template>