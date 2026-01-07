<script setup>
/**
 * RRadio - Botão de rádio
 */
import { computed } from 'vue' // <--- Linha adicionada

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: null },
  value: { type: [String, Number, Boolean], required: true },
  label: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  name: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isChecked = computed(() => props.modelValue === props.value)
</script>

<template>
  <label class="r-radio">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      class="r-radio__input"
      @change="() => {
        emit('update:modelValue', value)
        emit('change', value)
      }"
    >
    <span class="r-radio__circle">
      <span class="r-radio__dot" />
    </span>
    <span v-if="label" class="r-radio__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.r-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  user-select: none;
}

.r-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.r-radio__circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-dark);
  border-radius: var(--radius-full);
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  flex-shrink: 0;
}

.r-radio__dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background-color: var(--color-white);
  transform: scale(0);
  transition: var(--transition-fast);
}

.r-radio__input:checked + .r-radio__circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.r-radio__input:checked + .r-radio__circle .r-radio__dot {
  transform: scale(1);
}

.r-radio__input:focus-visible + .r-radio__circle {
  box-shadow: var(--shadow-focus);
}

.r-radio__input:disabled + .r-radio__circle {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-radio__label {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}
</style>