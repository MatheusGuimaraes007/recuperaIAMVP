<script setup>
/**
 * RSwitch - Toggle switch
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <label :class="['r-switch', `r-switch--${size}`]">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="r-switch__input"
      @change="($event) => {
        emit('update:modelValue', $event.target.checked)
        emit('change', $event)
      }"
    >
    <span :class="['r-switch__track', { 'r-switch__track--checked': modelValue }]">
      <span class="r-switch__thumb" />
    </span>
    <span v-if="label" class="r-switch__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.r-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  user-select: none;
}

.r-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.r-switch__track {
  position: relative;
  background-color: var(--border-dark);
  border-radius: var(--radius-full);
  transition: var(--transition-normal);
  flex-shrink: 0;
}

.r-switch--sm .r-switch__track { width: 36px; height: 20px; }
.r-switch--md .r-switch__track { width: 44px; height: 24px; }
.r-switch--lg .r-switch__track { width: 52px; height: 28px; }

.r-switch__track--checked {
  background-color: var(--color-primary);
}

.r-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: var(--color-white);
  border-radius: var(--radius-full);
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.r-switch--sm .r-switch__thumb {
  width: 16px;
  height: 16px;
}

.r-switch--md .r-switch__thumb {
  width: 20px;
  height: 20px;
}

.r-switch--lg .r-switch__thumb {
  width: 24px;
  height: 24px;
}

.r-switch__input:checked + .r-switch__track .r-switch__thumb {
  transform: translateX(calc(100% + 2px));
}

.r-switch--sm .r-switch__input:checked + .r-switch__track .r-switch__thumb {
  transform: translateX(16px);
}

.r-switch--md .r-switch__input:checked + .r-switch__track .r-switch__thumb {
  transform: translateX(20px);
}

.r-switch--lg .r-switch__input:checked + .r-switch__track .r-switch__thumb {
  transform: translateX(24px);
}

.r-switch__input:focus-visible + .r-switch__track {
  box-shadow: var(--shadow-focus);
}

.r-switch__input:disabled + .r-switch__track {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-switch__label {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}
</style>