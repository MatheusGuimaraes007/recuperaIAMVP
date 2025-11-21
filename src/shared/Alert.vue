<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  submessage: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['dismiss']);

const alertStyles = computed(() => {
  const styles = {
    success: {
      bg: 'rgba(124, 186, 16, 0.1)',
      border: 'var(--color-text1)',
      text: 'var(--color-text1)'
    },
    error: {
      bg: 'rgba(239, 67, 67, 0.1)',
      border: 'var(--color-text2)',
      text: 'var(--color-text2)'
    },
    warning: {
      bg: 'rgba(251, 191, 36, 0.1)',
      border: '#fbbf24',
      text: '#fbbf24'
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: '#3b82f6',
      text: '#3b82f6'
    }
  };
  return styles[props.type];
});

const icon = computed(() => {
  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  return icons[props.type];
});
</script>

<template>
  <div
      class="p-4 rounded-lg border flex items-start gap-3"
      :style="{
      backgroundColor: alertStyles.bg,
      borderColor: alertStyles.border
    }"
  >
    <svg
        class="w-5 h-5 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        :style="{ color: alertStyles.text }"
    >
      <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="icon"
      />
    </svg>

    <div class="flex-1">
      <p class="text-sm font-medium" :style="{ color: alertStyles.text }">
        {{ message }}
      </p>
      <p v-if="submessage" class="text-xs text-gray-400 mt-1">
        {{ submessage }}
      </p>
    </div>

    <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>