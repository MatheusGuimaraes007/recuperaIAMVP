<script setup>
import { computed } from 'vue';

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
});

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus', 'keyup']);

const hasError = computed(() => !!props.error);

const inputClasses = computed(() => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2';
  const errorClasses = hasError.value
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-700 focus:ring-[#7cba10]';
  const iconPadding = props.icon ? 'pl-12' : '';

  return `${baseClasses} ${errorClasses} ${iconPadding}`;
});

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('input', event);
};
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
      <slot name="icon">
        <svg
            v-if="icon"
            class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              v-if="icon === 'search'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
          <path
              v-else-if="icon === 'email'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
          <path
              v-else-if="icon === 'phone'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </slot>

      <input
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxlength"
          :class="inputClasses"
          style="background-color: var(--color-background2); color: white"
          @input="handleInput"
          @blur="$emit('blur', $event)"
          @focus="$emit('focus', $event)"
          @keyup="$emit('keyup', $event)"
      />

      <slot name="suffix"></slot>
    </div>

    <p v-if="hasError" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>