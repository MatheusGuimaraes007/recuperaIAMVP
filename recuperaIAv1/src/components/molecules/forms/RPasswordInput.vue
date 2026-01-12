<script setup>
/**
 * RPasswordInput - Input de Senha com Toggle de Visibilidade
 *
 * Componente molecule para entrada de senha com botão para
 * mostrar/ocultar o texto.
 *
 * @example
 * <RPasswordInput
 *   v-model="password"
 *   label="Senha"
 *   :required="true"
 *   @validation="handleValidation"
 * />
 */

import { ref, computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

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
    default: 'Senha'
  },

  /**
   * Placeholder
   */
  placeholder: {
    type: String,
    default: '••••••••'
  },

  /**
   * Mensagem de erro
   */
  error: {
    type: [Boolean, String],
    default: false
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
    default: 'password'
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
   * Se deve validar força da senha
   */
  validateStrength: {
    type: Boolean,
    default: false
  },

  /**
   * Comprimento mínimo
   */
  minLength: {
    type: Number,
    default: 8
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
  'blur',
  'focus',
  'validation'
])

// State
const showPassword = ref(false)

// Computed
const inputType = computed(() => {
  return showPassword.value ? 'text' : 'password'
})

const toggleIcon = computed(() => {
  return showPassword.value ? 'eye-off' : 'eye'
})

const passwordStrength = computed(() => {
  if (!props.validateStrength || !props.modelValue) {
    return null
  }

  const password = props.modelValue
  let strength = 0

  // Critérios de força
  if (password.length >= props.minLength) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { level: 'weak', label: 'Fraca', color: 'error' }
  if (strength <= 3) return { level: 'medium', label: 'Média', color: 'warning' }
  return { level: 'strong', label: 'Forte', color: 'success' }
})

// Methods
const toggleVisibility = () => {
  if (!props.disabled) {
    showPassword.value = !showPassword.value
  }
}

const handleBlur = (event) => {
  emit('blur', event)

  if (props.validateStrength) {
    emit('validation', {
      valid: passwordStrength.value?.level === 'strong',
      strength: passwordStrength.value
    })
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="r-password-input">
    <RInput
      :model-value="modelValue"
      :type="inputType"
      :label="label"
      :placeholder="placeholder"
      :error="error"
      :disabled="disabled"
      :required="required"
      :name="name"
      :size="size"
      :help-text="helpText"
      :autofocus="autofocus"
      icon-left="lock"
      autocomplete="current-password"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <template #icon-right>
        <RIconButton
          :icon="toggleIcon"
          variant="ghost"
          size="sm"
          :disabled="disabled"
          tabindex="-1"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
          @click="toggleVisibility"
        />
      </template>
    </RInput>

    <!-- Password Strength Indicator -->
    <div
      v-if="validateStrength && modelValue && passwordStrength"
      class="r-password-input__strength"
      :class="`r-password-input__strength--${passwordStrength.color}`"
    >
      <div class="r-password-input__strength-bar">
        <div
          class="r-password-input__strength-fill"
          :style="{ width: passwordStrength.level === 'weak' ? '33%' : passwordStrength.level === 'medium' ? '66%' : '100%' }"
        />
      </div>
      <span class="r-password-input__strength-label">
        Força: {{ passwordStrength.label }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-password-input {
  width: 100%;
}

/* ============================================================================
   STRENGTH INDICATOR
   ============================================================================ */

.r-password-input__strength {
  margin-top: var(--spacing-2);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.r-password-input__strength-bar {
  flex: 1;
  height: 4px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.r-password-input__strength-fill {
  height: 100%;
  transition: width var(--transition-normal) var(--easing-out),
              background-color var(--transition-normal) var(--easing-out);
  border-radius: var(--radius-full);
}

.r-password-input__strength--error .r-password-input__strength-fill {
  background-color: var(--color-error);
}

.r-password-input__strength--warning .r-password-input__strength-fill {
  background-color: var(--color-warning);
}

.r-password-input__strength--success .r-password-input__strength-fill {
  background-color: var(--color-success);
}

.r-password-input__strength-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.r-password-input__strength--error .r-password-input__strength-label {
  color: var(--color-error);
}

.r-password-input__strength--warning .r-password-input__strength-label {
  color: var(--color-warning);
}

.r-password-input__strength--success .r-password-input__strength-label {
  color: var(--color-success);
}
</style>