<script setup>
import { ref, computed } from 'vue'
import { Search, Mail, Phone, Eye, EyeOff, User, Lock } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [String, Number],
    default: null
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus', 'keyup'])

const showPassword = ref(false)

const ICON_MAP = {
  'search': Search,
  'email': Mail,
  'phone': Phone,
  'user': User,
  'lock': Lock
}

const hasError = computed(() => !!props.error)

const inputClasses = computed(() => {
  const classes = ['input-base']

  if (hasError.value) {
    classes.push('border-status-error', 'focus:border-status-error', 'focus:ring-status-error')
  } else {
    classes.push('focus:border-primary', 'focus:ring-primary')
  }

  if (props.icon) {
    classes.push('pl-12')
  }

  if (props.type === 'password') {
    classes.push('pr-12')
  }

  return classes.join(' ')
})

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const iconComponent = computed(() => {
  return ICON_MAP[props.icon] || null
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="w-full">
    <label
        v-if="label"
        class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
    </label>

    <div class="relative">
      <!-- Ícone à esquerda -->
      <div
          v-if="icon && iconComponent"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      >
        <component :is="iconComponent" :size="18" />
      </div>

      <!-- Slot customizável para ícone -->
      <slot name="icon"></slot>

      <!-- Input -->
      <input
          :type="computedType"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxlength"
          :class="inputClasses"
          @input="handleInput"
          @blur="$emit('blur', $event)"
          @focus="$emit('focus', $event)"
          @keyup="$emit('keyup', $event)"
      />

      <!-- Toggle de Senha -->
      <button
          v-if="type === 'password'"
          type="button"
          @click="togglePassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
      >
        <EyeOff v-if="showPassword" :size="18" />
        <Eye v-else :size="18" />
      </button>

      <!-- Slot para sufixo customizável -->
      <slot name="suffix"></slot>
    </div>

    <!-- Mensagem de erro -->
    <p v-if="hasError" class="mt-1 text-sm text-status-error flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>