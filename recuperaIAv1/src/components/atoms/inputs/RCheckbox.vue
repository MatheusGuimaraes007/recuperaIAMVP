<script setup>
/**
 * RCheckbox - Caixa de seleção
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <label class="r-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :indeterminate="indeterminate"
      class="r-checkbox__input"
      @change="($event) => {
        emit('update:modelValue', $event.target.checked)
        emit('change', $event)
      }"
    >
    <span class="r-checkbox__box">
      <svg class="r-checkbox__icon" viewBox="0 0 24 24" fill="none">
        <path
          v-if="!indeterminate"
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-else
          d="M6 12h12"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </span>
    <span v-if="label" class="r-checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.r-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  user-select: none;
}

.r-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.r-checkbox__box {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-dark);
  border-radius: var(--radius-sm);
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  flex-shrink: 0;
}

.r-checkbox__icon {
  width: 14px;
  height: 14px;
  color: var(--color-white);
  opacity: 0;
  transform: scale(0.8);
  transition: var(--transition-fast);
}

.r-checkbox__input:checked + .r-checkbox__box {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.r-checkbox__input:checked + .r-checkbox__box .r-checkbox__icon {
  opacity: 1;
  transform: scale(1);
}

.r-checkbox__input:focus-visible + .r-checkbox__box {
  box-shadow: var(--shadow-focus);
}

.r-checkbox__input:disabled + .r-checkbox__box {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-checkbox__label {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}
</style>