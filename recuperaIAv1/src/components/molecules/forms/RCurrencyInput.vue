<script setup>
import { computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: [Number, String], default: 0 },
  label: { type: String, default: null },
  error: { type: [Boolean, String], default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

// Formata para exibição visual (R$ 1.200,50)
const displayValue = computed(() => {
  if (props.modelValue === '' || props.modelValue === null) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(props.modelValue / 100) // Assume que o valor vem em centavos ou ajusta
})

const handleInput = (val) => {
  // Remove tudo que não é número
  const numericVal = val.replace(/\D/g, '')
  // Emite o valor "cru" (ex: 120050 para R$ 1.200,50) ou converte para float
  // Aqui estou emitindo como float para facilitar
  const floatVal = parseFloat(numericVal)
  emit('update:modelValue', floatVal)
}
</script>

<template>
  <RInput
    :model-value="displayValue"
    :label="label"
    :error="error"
    :disabled="disabled"
    placeholder="R$ 0,00"
    @update:model-value="handleInput"
  />
</template>