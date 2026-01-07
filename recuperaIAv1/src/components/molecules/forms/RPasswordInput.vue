<script setup>
/**
 * RPasswordInput - Input de senha com botão show/hide
 */
import { ref } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Senha' },
  placeholder: { type: String, default: '••••••••' },
  error: { type: String, default: null },
  required: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="r-password-input">
    <RInput
      :model-value="modelValue"
      :type="showPassword ? 'text' : 'password'"
      :label="label"
      :placeholder="placeholder"
      :error="error"
      :required="required"
      @update:model-value="handleInput"
    >
      <template #icon-right>
        <button
          type="button"
          class="r-password-input__toggle"
          @click="togglePassword"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </button>
      </template>
    </RInput>
  </div>
</template>

<style scoped>
.r-password-input {
  width: 100%;
}

.r-password-input__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 18px;
  transition: opacity var(--duration-fast);
}

.r-password-input__toggle:hover {
  opacity: 0.7;
}
</style>