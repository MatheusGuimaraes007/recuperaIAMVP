<script setup>
import { ref } from 'vue'
import RLabel from '@components/atoms/typography/RLabel.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  modelValue: { type: String, default: '#00C853' },
  label: { type: String, default: 'Cor' },
  /**
   * Paleta predefinida do Design System
   */
  colors: {
    type: Array,
    default: () => [
      '#00C853', // Primary Green
      '#2962FF', // Blue
      '#D50000', // Red
      '#FFD600', // Yellow
      '#AA00FF', // Purple
      '#00B0FF', // Light Blue
      '#FF6D00', // Orange
      '#62757F'  // Grey
    ]
  }
})

const emit = defineEmits(['update:modelValue'])

const selectColor = (color) => {
  emit('update:modelValue', color)
}
</script>

<template>
  <div class="r-color-picker">
    <RLabel v-if="label">{{ label }}</RLabel>

    <div class="r-color-picker__grid">
      <button
        v-for="color in colors"
        :key="color"
        type="button"
        class="r-color-picker__item"
        :class="{ 'r-color-picker__item--selected': modelValue === color }"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
        :aria-label="`Selecionar cor ${color}`"
      >
        <RIcon
          v-if="modelValue === color"
          name="check"
          size="16"
          class="r-color-picker__check"
        />
      </button>

      <label class="r-color-picker__custom">
        <input
          type="color"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        >
        <RIcon name="plus" size="16" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.r-color-picker {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-color-picker__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.r-color-picker__item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.r-color-picker__item:hover {
  transform: scale(1.1);
}

.r-color-picker__item--selected {
  border-color: var(--bg-primary);
  box-shadow: 0 0 0 2px var(--text-primary);
}

.r-color-picker__check {
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.r-color-picker__custom {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px dashed var(--border-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  position: relative;
  overflow: hidden;
}

.r-color-picker__custom input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>