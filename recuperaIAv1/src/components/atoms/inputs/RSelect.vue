<script setup>
/**
 * RSelect - Campo de seleção
 */
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  options: { type: Array, required: true }, // [{ value, label }]
  label: { type: String, default: null },
  placeholder: { type: String, default: 'Selecione...' },
  error: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)
</script>

<template>
  <div class="r-select">
    <label v-if="label" :for="selectId" class="r-select__label">
      {{ label }}
      <span v-if="required" class="r-select__required">*</span>
    </label>

    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'r-select__field',
        `r-select__field--${size}`,
        { 'r-select__field--error': error }
      ]"
      @change="($event) => {
        emit('update:modelValue', $event.target.value)
        emit('change', $event)
      }"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="r-select__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.r-select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-select__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-select__required {
  color: var(--color-error);
}

.r-select__field {
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  transition: var(--transition-normal);
  outline: none;
  cursor: pointer;
}

.r-select__field--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  height: var(--input-height-sm);
}

.r-select__field--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  height: var(--input-height-md);
}

.r-select__field--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  height: var(--input-height-lg);
}

.r-select__field:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.r-select__field--error {
  border-color: var(--color-error);
}

.r-select__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.r-select__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin: 0;
}
</style>