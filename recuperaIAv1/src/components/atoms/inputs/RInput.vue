<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: null },
  placeholder: { type: String, default: null },
  helpText: { type: String, default: null },
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  iconLeft: { type: String, default: null },
  iconRight: { type: String, default: null },
  maxlength: { type: [String, Number], default: null },
  autocomplete: { type: String, default: null },
  id: { type: String, default: null },
  name: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'input', 'change'])

const inputRef = ref(null)
const isFocused = ref(false)

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const classes = ['r-input__field']
  classes.push(`r-input__field--${props.size}`)
  if (props.error) classes.push('r-input__field--error')
  if (props.disabled) classes.push('r-input__field--disabled')
  if (props.iconLeft) classes.push('r-input__field--has-icon-left')
  if (props.iconRight) classes.push('r-input__field--has-icon-right')
  return classes
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleChange = (event) => {
  emit('change', event)
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="r-input">
    <label
        v-if="label"
        :for="inputId"
        class="r-input__label"
    >
      {{ label }}
      <span v-if="required" class="r-input__required">*</span>
    </label>

    <div
        :class="[
        'r-input__container',
        { 'r-input__container--focused': isFocused },
        { 'r-input__container--error': error },
        { 'r-input__container--disabled': disabled }
      ]"
    >
      <span v-if="iconLeft" class="r-input__icon r-input__icon--left">
        <slot name="icon-left">{{ iconLeft }}</slot>
      </span>

      <input
          :id="inputId"
          ref="inputRef"
          :type="type"
          :value="modelValue"
          :class="inputClasses"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :maxlength="maxlength"
          :autocomplete="autocomplete"
          :name="name"
          :aria-invalid="!!error"
          :aria-describedby="error ? `${inputId}-error` : helpText ? `${inputId}-help` : null"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
      >

      <span v-if="iconRight" class="r-input__icon r-input__icon--right">
        <slot name="icon-right">{{ iconRight }}</slot>
      </span>
    </div>

    <p
        v-if="helpText && !error"
        :id="`${inputId}-help`"
        class="r-input__help"
    >
      {{ helpText }}
    </p>

    <p
        v-if="error"
        :id="`${inputId}-error`"
        class="r-input__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.r-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1-5);
  width: 100%;
}

.r-input__label {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}

.r-input__required {
  color: var(--color-error-500);
  margin-left: var(--spacing-0-5);
}

.r-input__container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-white);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--easing-out);
}

.r-input__container:hover:not(.r-input__container--disabled) {
  border-color: var(--border-dark);
}

.r-input__container--focused {
  border-color: var(--color-primary-600);
  box-shadow: var(--shadow-focus);
}

.r-input__container--error {
  border-color: var(--color-error-500);
}

.r-input__container--error.r-input__container--focused {
  box-shadow: var(--shadow-focus-error);
}

.r-input__container--disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
}

.r-input__field {
  flex: 1;
  width: 100%;
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  line-height: var(--line-height-normal);
}

.r-input__field::placeholder {
  color: var(--text-tertiary);
}

.r-input__field:disabled {
  cursor: not-allowed;
}

.r-input__field--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  min-height: 32px;
}

.r-input__field--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  min-height: 40px;
}

.r-input__field--lg {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-lg);
  min-height: 48px;
}

.r-input__field--has-icon-left {
  padding-left: var(--spacing-10);
}

.r-input__field--has-icon-right {
  padding-right: var(--spacing-10);
}

.r-input__icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  pointer-events: none;
}

.r-input__icon--left {
  left: var(--spacing-3);
}

.r-input__icon--right {
  right: var(--spacing-3);
}

.r-input__help {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--line-height-tight);
}

.r-input__error {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
  margin: 0;
  line-height: var(--line-height-tight);
}
</style>