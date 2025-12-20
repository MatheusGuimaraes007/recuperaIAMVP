<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0
  },
  label: {
    type: String,
    required: true
  },
  sublabel: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    required: true
  }
});

const radius = 45;
const strokeWidth = 8;
const circumference = computed(() => 2 * Math.PI * radius);

const offset = computed(() => {
  const progress = Math.min(Math.max(props.value, 0), 100);
  return circumference.value - (progress / 100) * circumference.value;
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative" style="width: 128px; height: 128px;">
      <svg
          class="w-full h-full transform -rotate-90"
          viewBox="0 0 128 128"
      >
        <!-- Background Circle -->
        <circle
            cx="64"
            cy="64"
            :r="radius"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            :stroke-width="strokeWidth"
        />

        <!-- Progress Circle -->
        <circle
            cx="64"
            cy="64"
            :r="radius"
            fill="none"
            :stroke="color"
            :stroke-width="strokeWidth"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="offset"
            stroke-linecap="round"
            class="transition-all duration-1000 ease-out"
        />

        <!-- Center Text -->
        <text
            x="64"
            y="64"
            text-anchor="middle"
            dy="0.35em"
            fill="white"
            font-size="20"
            font-weight="bold"
            transform="rotate(90 64 64)"
        >
          {{ Math.round(value) }}%
        </text>
      </svg>
    </div>

    <div class="mt-3 text-center">
      <p class="font-semibold text-sm" :style="`color: ${color}`">
        {{ label }}
      </p>
      <p v-if="sublabel" class="text-gray-500 text-xs mt-0.5">{{ sublabel }}</p>
    </div>
  </div>
</template>