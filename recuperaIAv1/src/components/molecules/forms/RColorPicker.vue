<script setup>
/**
 * RColorPicker - Seletor de Cor
 *
 * Componente molecule para seleção de cores com input nativo
 * e preview visual.
 *
 * @example
 * <RColorPicker
 *   v-model="color"
 *   label="Cor do tema"
 * />
 */

import { ref, computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '#00C853' },
  label: { type: String, default: 'Cor' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: 'color' },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  helpText: { type: String, default: null },
  presetColors: { type: Array, default: () => ['#00C853', '#2196F3', '#FF9800', '#F44336', '#9C27B0'] }
})

const emit = defineEmits(['update:modelValue', 'change'])

const inputRef = ref(null)

const handleInput = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const selectPreset = (color) => {
  if (!props.disabled) {
    emit('update:modelValue', color)
    emit('change', color)
  }
}
</script>

<template>
  <div class="r-color-picker">
    <RInput
      ref="inputRef"
      :model-value="modelValue"
      :label="label"
      :disabled="disabled"
      :required="required"
      :name="name"
      :size="size"
      :help-text="helpText"
      type="text"
      placeholder="#000000"
      @update:model-value="handleInput"
    >
      <template #icon-left>
        <div
          class="r-color-picker__preview"
          :style="{ backgroundColor: modelValue }"
          @click="() => !disabled && $refs.colorInput?.click()"
        />
      </template>
    </RInput>

    <input
      ref="colorInput"
      type="color"
      :value="modelValue"
      :disabled="disabled"
      style="position: absolute; opacity: 0; pointer-events: none;"
      @input="handleInput($event.target.value)"
    />

    <div v-if="presetColors.length" class="r-color-picker__presets">
      <button
        v-for="color in presetColors"
        :key="color"
        type="button"
        class="r-color-picker__preset"
        :class="{ 'r-color-picker__preset--active': modelValue === color }"
        :style="{ backgroundColor: color }"
        :disabled="disabled"
        @click="selectPreset(color)"
      />
    </div>
  </div>
</template>

<style scoped>
.r-color-picker { width: 100%; }

.r-color-picker__preview {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-border-medium);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.r-color-picker__preview:hover { transform: scale(1.1); }

.r-color-picker__presets {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  flex-wrap: wrap;
}

.r-color-picker__preset {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.r-color-picker__preset:hover:not(:disabled) {
  transform: scale(1.1);
  border-color: var(--color-border-dark);
}

.r-color-picker__preset--active {
  border-color: var(--color-primary);
  border-width: 3px;
}

.r-color-picker__preset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>