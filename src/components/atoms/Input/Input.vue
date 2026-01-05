<script setup>
import { computed } from 'vue'
import { Search, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'email', 'number', 'tel', 'url', 'date'].includes(v)
  },
  label: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  required: Boolean,
  icon: String
})

const emit = defineEmits(['update:modelValue'])

const iconComponent = computed(() => {
  if (props.icon === 'search') return Search
  return null
})
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>

    <div class="relative">
      <component
          v-if="iconComponent"
          :is="iconComponent"
          :size="18"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />

      <input
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          @input="emit('update:modelValue', $event.target.value)"
          :class="[
          'w-full px-4 py-2.5 bg-background-base border rounded-xl text-white placeholder-gray-500',
          'focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-700',
          icon ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : ''
        ]"
      />

      <div v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2">
        <slot name="suffix" />
      </div>
    </div>

    <div v-if="error" class="flex items-center gap-1.5 text-red-400 text-sm">
      <AlertCircle :size="14" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>
