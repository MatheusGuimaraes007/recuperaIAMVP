<script setup>
import { ref, computed } from 'vue'
import Input from './Input.vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Senha'
  },
  placeholder: {
    type: String,
    default: 'Digite sua senha'
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  showStrengthMeter: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)
const inputType = computed(() => showPassword.value ? 'text' : 'password')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const passwordStrength = computed(() => {
  const password = props.modelValue
  if (!password) return { level: 0, label: '', color: '' }

  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  const levels = [
    { level: 0, label: '', color: '' },
    { level: 1, label: 'Muito fraca', color: 'bg-red-500' },
    { level: 2, label: 'Fraca', color: 'bg-orange-500' },
    { level: 3, label: 'Média', color: 'bg-yellow-500' },
    { level: 4, label: 'Boa', color: 'bg-green-500' },
    { level: 5, label: 'Forte', color: 'bg-green-600' },
    { level: 6, label: 'Muito forte', color: 'bg-green-700' }
  ]

  return levels[Math.min(strength, 6)]
})
</script>

<template>
  <div class="space-y-2">
    <Input
        :model-value="modelValue"
        :type="inputType"
        :label="label"
        :placeholder="placeholder"
        :error="error"
        :disabled="disabled"
        :required="required"
        @update:model-value="emit('update:modelValue', $event)"
    >
      <template #suffix>
        <button
            type="button"
            @click="togglePasswordVisibility"
            class="p-1 rounded hover:bg-white/10 transition-colors"
            :disabled="disabled"
            tabindex="-1"
        >
          <component
              :is="showPassword ? EyeOff : Eye"
              :size="18"
              class="text-gray-400 hover:text-white transition-colors"
          />
        </button>
      </template>
    </Input>

    <div v-if="showStrengthMeter && modelValue" class="space-y-2">
      <div class="flex gap-1">
        <div
            v-for="i in 6"
            :key="i"
            class="h-1 flex-1 rounded-full transition-all"
            :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-700'"
        />
      </div>
      <p
          v-if="passwordStrength.label"
          class="text-xs font-medium"
          :class="[
          passwordStrength.level <= 2 ? 'text-red-400' :
          passwordStrength.level <= 3 ? 'text-yellow-400' :
          'text-green-400'
        ]"
      >
        Senha {{ passwordStrength.label }}
      </p>
    </div>
  </div>
</template>
