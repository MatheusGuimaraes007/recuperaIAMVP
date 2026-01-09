<script setup>
import { ref, computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: null },
  placeholder: { type: String, default: '••••••••' },
  error: { type: [Boolean, String], default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: 'password' }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const showPassword = ref(false)

const inputType = computed(() => showPassword.value ? 'text' : 'password')
const toggleIcon = computed(() => showPassword.value ? 'eye-off' : 'eye')

const toggleVisibility = () => {
  if (!props.disabled) {
    showPassword.value = !showPassword.value
  }
}
</script>

<template>
  <RInput
    :model-value="modelValue"
    :type="inputType"
    :label="label"
    :placeholder="placeholder"
    :error="error"
    :disabled="disabled"
    :required="required"
    :name="name"
    icon-left="lock"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur', $event)"
  >
    <template #icon-right>
      <RIconButton
        :icon="toggleIcon"
        variant="ghost"
        size="sm"
        :disabled="disabled"
        tabindex="-1"
        @click="toggleVisibility"
        aria-label="Alternar visibilidade da senha"
      />
    </template>
  </RInput>
</template>