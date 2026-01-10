<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  error: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <label
      :class="[
      'r-checkbox',
      { 'r-checkbox--disabled': disabled },
      { 'r-checkbox--error': error }
    ]"
  >
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
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-5);
  height: var(--spacing-5);
  border: var(--border-width-2) solid var(--border-dark);
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  transition: all var(--duration-normal) var(--easing-out);
  flex-shrink: 0;
}

.r-checkbox__icon {
  width: 1em;
  height: 1em;
  color: transparent;
  transition: color var(--duration-fast) var(--easing-out);
}

/* Estados */
.r-checkbox__input:checked + .r-checkbox__box {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.r-checkbox__input:checked + .r-checkbox__box .r-checkbox__icon {
  color: var(--color-white);
}

.r-checkbox__input:indeterminate + .r-checkbox__box {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.r-checkbox__input:indeterminate + .r-checkbox__box .r-checkbox__icon {
  color: var(--color-white);
}

.r-checkbox__input:focus-visible + .r-checkbox__box {
  box-shadow: var(--shadow-focus);
  outline: 2px solid transparent;
}

.r-checkbox:hover .r-checkbox__box {
  border-color: var(--color-primary-600);
}

.r-checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-checkbox--error .r-checkbox__box {
  border-color: var(--color-error-500);
}

.r-checkbox--error .r-checkbox__input:focus-visible + .r-checkbox__box {
  box-shadow: var(--shadow-focus-error);
}

.r-checkbox__label {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  line-height: var(--line-height-normal);
}
</style>