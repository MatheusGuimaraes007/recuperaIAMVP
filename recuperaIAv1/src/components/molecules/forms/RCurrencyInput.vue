<script setup>
/**
 * RCurrencyInput - Input de Moeda com Formatação
 *
 * Componente molecule para entrada de valores monetários
 * com formatação automática em Real (R$).
 *
 * @example
 * <RCurrencyInput
 *   v-model="price"
 *   label="Preço"
 *   :required="true"
 * />
 */

import { computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: [Number, String], default: 0 },
  label: { type: String, default: 'Valor' },
  placeholder: { type: String, default: 'R$ 0,00' },
  error: { type: [Boolean, String], default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: 'currency' },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  helpText: { type: String, default: null },
  autofocus: { type: Boolean, default: false },
  prefix: { type: String, default: 'R$ ' },
  allowNegative: { type: Boolean, default: false },
  maxValue: { type: Number, default: null }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const formatCurrency = (value) => {
  if (!value && value !== 0) return ''

  let numValue = typeof value === 'string' ? value.replace(/\D/g, '') : String(value).replace(/\D/g, '')
  if (!numValue) return ''

  numValue = Number(numValue) / 100

  if (props.maxValue && numValue > props.maxValue) {
    numValue = props.maxValue
  }

  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const displayValue = computed(() => {
  const formatted = formatCurrency(props.modelValue)
  return formatted ? `${props.prefix}${formatted}` : ''
})

const handleInput = (value) => {
  const numbers = value.replace(/\D/g, '')
  const numValue = Number(numbers) / 100
  emit('update:modelValue', numValue)
}
</script>

<template>
  <RInput
    :model-value="displayValue"
    :label="label"
    :placeholder="placeholder"
    :error="error"
    :disabled="disabled"
    :required="required"
    :name="name"
    :size="size"
    :help-text="helpText"
    :autofocus="autofocus"
    type="text"
    inputmode="numeric"
    icon-left="dollar-sign"
    @update:model-value="handleInput"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>