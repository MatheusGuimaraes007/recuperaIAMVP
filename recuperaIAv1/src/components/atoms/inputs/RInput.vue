<script setup>
/**
 * RInput - Componente de Input
 * 
 * Campo de entrada de texto com validação, ícones e estados.
 * 
 * @example
 * <RInput
 *   v-model="email"
 *   type="email"
 *   label="E-mail"
 *   placeholder="seu@email.com"
 *   :error="errors.email"
 * />
 */

import { computed, ref } from 'vue'

// Props
const props = defineProps({
  /**
   * Valor do input (v-model)
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },

  /**
   * Tipo do input
   */
  type: {
    type: String,
    default: 'text'
  },

  /**
   * Label do input
   */
  label: {
    type: String,
    default: null
  },

  /**
   * Placeholder
   */
  placeholder: {
    type: String,
    default: null
  },

  /**
   * Texto de ajuda abaixo do input
   */
  helpText: {
    type: String,
    default: null
  },

  /**
   * Mensagem de erro
   */
  error: {
    type: String,
    default: null
  },

  /**
   * Se o input está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Se o input é obrigatório
   */
  required: {
    type: Boolean,
    default: false
  },

  /**
   * Se o input é readonly
   */
  readonly: {
    type: Boolean,
    default: false
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
  },

  /**
   * Máximo de caracteres
   */
  maxlength: {
    type: [String, Number],
    default: null
  },

  /**
   * Autocomplete
   */
  autocomplete: {
    type: String,
    default: null
  },

  /**
   * ID do input
   */
  id: {
    type: String,
    default: null
  },

  /**
   * Name do input
   */
  name: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input', 'change', 'keypress', 'keydown', 'keyup'])

// State
const inputRef = ref(null)
const isFocused = ref(false)

// Computed
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const classes = ['r-input__field']
  
  classes.push(`r-input__field--${props.size}`)
  
  if (props.error) classes.push('r-input__field--error')
  if (props.disabled) classes.push('r-input__field--disabled')
  if (props.iconLeft) classes.push('r-input__field--with-icon-left')
  if (props.iconRight) classes.push('r-input__field--with-icon-right')
  
  return classes
})

// Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

const handleChange = (event) => {
  emit('change', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur
})
</script>

<template>
  <div class="r-input">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="r-input__label"
    >
      {{ label }}
      <span v-if="required" class="r-input__required">*</span>
    </label>

    <!-- Input Container -->
    <div class="r-input__container">
      <!-- Icon Left -->
      <span v-if="iconLeft" class="r-input__icon r-input__icon--left">
        <slot name="icon-left">
          {{ iconLeft }}
        </slot>
      </span>

      <!-- Input Field -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :class="inputClasses"
        :aria-label="label"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : helpText ? `${inputId}-help` : null"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keypress="(e) => emit('keypress', e)"
        @keydown="(e) => emit('keydown', e)"
        @keyup="(e) => emit('keyup', e)"
      >

      <!-- Icon Right -->
      <span v-if="iconRight" class="r-input__icon r-input__icon--right">
        <slot name="icon-right">
          {{ iconRight }}
        </slot>
      </span>
    </div>

    <!-- Error Message -->
    <p 
      v-if="error" 
      :id="`${inputId}-error`" 
      class="r-input__error"
      role="alert"
    >
      {{ error }}
    </p>

    <!-- Help Text -->
    <p 
      v-else-if="helpText" 
      :id="`${inputId}-help`" 
      class="r-input__help"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
/* Container */
.r-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* Label */
.r-input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  cursor: pointer;
}

.r-input__required {
  color: var(--color-error);
  margin-left: 2px;
}

/* Input Container */
.r-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Input Field */
.r-input__field {
  /* Reset */
  appearance: none;
  
  /* Layout */
  width: 100%;
  
  /* Typography */
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  
  /* Spacing */
  padding: var(--spacing-3) var(--spacing-4);
  
  /* Border */
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  
  /* Background */
  background-color: var(--bg-primary);
  
  /* Transition */
  transition: var(--transition-normal);
  
  /* Outline */
  outline: none;
}

/* Placeholder */
.r-input__field::placeholder {
  color: var(--text-tertiary);
}

/* Focus */
.r-input__field:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

/* Hover */
.r-input__field:hover:not(:disabled):not(.r-input__field--error) {
  border-color: var(--border-dark);
}

/* Sizes */
.r-input__field--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  height: var(--input-height-sm);
}

.r-input__field--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  height: var(--input-height-md);
}

.r-input__field--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  height: var(--input-height-lg);
}

/* With Icons */
.r-input__field--with-icon-left {
  padding-left: var(--spacing-10);
}

.r-input__field--with-icon-right {
  padding-right: var(--spacing-10);
}

/* Error State */
.r-input__field--error {
  border-color: var(--color-error);
}

.r-input__field--error:focus {
  border-color: var(--color-error);
  box-shadow: var(--shadow-focus-error);
}

/* Disabled State */
.r-input__field--disabled,
.r-input__field:disabled {
  background-color: var(--bg-tertiary);
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Icons */
.r-input__icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  pointer-events: none;
}

.r-input__icon--left {
  left: var(--spacing-3);
}

.r-input__icon--right {
  right: var(--spacing-3);
}

/* Error Message */
.r-input__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin: 0;
}

/* Help Text */
.r-input__help {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}
</style>
