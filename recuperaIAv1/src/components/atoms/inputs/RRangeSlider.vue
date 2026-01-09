<script setup>
/**
 * RRangeSlider - Slider de Intervalo
 * 
 * Slider para selecionar um intervalo de valores.
 * 
 * @example
 * <RRangeSlider v-model="range" :min="0" :max="100" />
 */

import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 100]
  },

  min: {
    type: Number,
    default: 0
  },

  max: {
    type: Number,
    default: 100
  },

  step: {
    type: Number,
    default: 1
  },

  showValue: {
    type: Boolean,
    default: true
  },

  disabled: {
    type: Boolean,
    default: false
  },

  label: {
    type: String,
    default: null
  },

  formatValue: {
    type: Function,
    default: (value) => value.toString()
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const sliderRef = ref(null)
const isDragging = ref(false)
const activeThumb = ref(null)

const minValue = ref(props.modelValue[0] || props.min)
const maxValue = ref(props.modelValue[1] || props.max)

watch(() => props.modelValue, (newValue) => {
  minValue.value = newValue[0]
  maxValue.value = newValue[1]
}, { deep: true })

const minPercent = computed(() => {
  return ((minValue.value - props.min) / (props.max - props.min)) * 100
})

const maxPercent = computed(() => {
  return ((maxValue.value - props.min) / (props.max - props.min)) * 100
})

const rangeStyle = computed(() => {
  return {
    left: `${minPercent.value}%`,
    width: `${maxPercent.value - minPercent.value}%`
  }
})

const updateValue = () => {
  emit('update:modelValue', [minValue.value, maxValue.value])
  emit('change', [minValue.value, maxValue.value])
}

const handleMinChange = (event) => {
  const value = Number(event.target.value)
  minValue.value = Math.min(value, maxValue.value - props.step)
  updateValue()
}

const handleMaxChange = (event) => {
  const value = Number(event.target.value)
  maxValue.value = Math.max(value, minValue.value + props.step)
  updateValue()
}
</script>

<template>
  <div :class="['r-range-slider', { 'r-range-slider--disabled': disabled }]">
    <div v-if="label || showValue" class="r-range-slider__header">
      <span v-if="label" class="r-range-slider__label">{{ label }}</span>
      <span v-if="showValue" class="r-range-slider__values">
        {{ formatValue(minValue) }} - {{ formatValue(maxValue) }}
      </span>
    </div>
    
    <div ref="sliderRef" class="r-range-slider__track-container">
      <div class="r-range-slider__track">
        <div class="r-range-slider__range" :style="rangeStyle"></div>
      </div>
      
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="minValue"
        :disabled="disabled"
        class="r-range-slider__input r-range-slider__input--min"
        :style="{ zIndex: minValue > max - (max - min) / 2 ? 5 : 3 }"
        @input="handleMinChange"
      />
      
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="maxValue"
        :disabled="disabled"
        class="r-range-slider__input r-range-slider__input--max"
        :style="{ zIndex: maxValue > max - (max - min) / 2 ? 3 : 5 }"
        @input="handleMaxChange"
      />
    </div>
  </div>
</template>

<style scoped>
.r-range-slider {
  width: 100%;
}

.r-range-slider__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.r-range-slider__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-range-slider__values {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.r-range-slider__track-container {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.r-range-slider__track {
  position: absolute;
  width: 100%;
  height: 6px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
}

.r-range-slider__range {
  position: absolute;
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.r-range-slider__input {
  position: absolute;
  width: 100%;
  height: 6px;
  appearance: none;
  background: transparent;
  pointer-events: none;
  margin: 0;
}

.r-range-slider__input::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary);
  cursor: pointer;
  pointer-events: all;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.r-range-slider__input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.r-range-slider__input::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.r-range-slider__input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary);
  cursor: pointer;
  pointer-events: all;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.r-range-slider__input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.r-range-slider__input::-moz-range-thumb:active {
  transform: scale(0.95);
}

.r-range-slider--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.r-range-slider--disabled .r-range-slider__input {
  cursor: not-allowed;
}
</style>
