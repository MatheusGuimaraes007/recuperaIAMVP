<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  size: { type: Number, default: 120 },
  thickness: { type: Number, default: 8 },
  color: { type: String, default: null },
  showValue: { type: Boolean, default: true }
})

const percent = computed(() => Math.min((props.value / props.max) * 100, 100))
const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value - (percent.value / 100) * circumference.value)
</script>

<template>
  <div class="r-progress-circular" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" class="r-progress-circular__svg">
      <circle class="r-progress-circular__track" :cx="size / 2" :cy="size / 2" :r="radius" :stroke-width="thickness" />
      <circle class="r-progress-circular__fill" :cx="size / 2" :cy="size / 2" :r="radius" :stroke-width="thickness" :stroke-dasharray="circumference" :stroke-dashoffset="offset" :stroke="color || 'var(--color-primary)'" />
    </svg>
    <div v-if="showValue" class="r-progress-circular__value">{{ Math.round(percent) }}%</div>
  </div>
</template>

<style scoped>
.r-progress-circular { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.r-progress-circular__svg { transform: rotate(-90deg); }
.r-progress-circular__track { fill: none; stroke: var(--bg-tertiary); }
.r-progress-circular__fill { fill: none; transition: stroke-dashoffset 0.3s ease; }
.r-progress-circular__value { position: absolute; font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--text-primary); }
</style>