<script setup>
/**
 * RFormField - Campo de Formulário com Validação
 *
 * Componente molecule que integra RInput com Vee-Validate,
 * gerenciando validação, erros e estado automaticamente.
 *
 * @example
 * <RFormField
 *   v-model="form.email"
 *   name="email"
 *   label="E-mail"
 *   type="email"
 *   rules="required|email"
 * />
 */

import { computed } from 'vue'
import { useField } from 'vee-validate'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  name: { type: String, required: true },
  label: { type: String, default: null },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: null },
  helpText: { type: String, default: null },
  required: { type: Boolean, default: false },
  rules: { type: [String, Object, Function], default: null },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  iconLeft: { type: String, default: null },
  iconRight: { type: String, default: null },
  autofocus: { type: Boolean, default: false },
  autocomplete: { type: String, default: null },
  maxlength: { type: Number, default: null },
  minlength: { type: Number, default: null },
  pattern: { type: String, default: null },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'validation'])

const {
  value: inputValue,
  errorMessage,
  handleChange,
  handleBlur: veeBlur,
  meta
} = useField(() => props.name, props.rules, {
  initialValue: props.modelValue,
  validateOnValueUpdate: false
})

const handleInput = (value) => {
  inputValue.value = value
  emit('update:modelValue', value)
  handleChange(value)
}

const handleBlur = (event) => {
  veeBlur(event)
  emit('blur', event)
  emit('validation', {
    valid: !errorMessage.value,
    error: errorMessage.value,
    meta: meta
  })
}

const handleFocus = (event) => {
  emit('focus', event)
}

const hasError = computed(() => !!errorMessage.value)
</script>

<template>
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
    :autofocus="autofocus"
    :autocomplete="autocomplete"
    :maxlength="maxlength"
    :minlength="minlength"
    :pattern="pattern"
    :readonly="readonly"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  >
    <template v-if="$slots['icon-left']" #icon-left>
      <slot name="icon-left" />
    </template>
    <template v-if="$slots['icon-right']" #icon-right>
      <slot name="icon-right" />
    </template>
    <template v-if="$slots.helpText" #helpText>
      <slot name="helpText" />
    </template>
  </RInput>
</template>