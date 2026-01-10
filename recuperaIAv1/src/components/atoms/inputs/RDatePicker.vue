<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Date], default: null },
  label: { type: String, default: null },
  format: { type: String, default: 'DD/MM/YYYY' },
  minDate: { type: [String, Date], default: null },
  maxDate: { type: [String, Date], default: null },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null },
  placeholder: { type: String, default: 'Selecione uma data' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const selectedDate = ref(props.modelValue)
const displayValue = ref('')

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue
  displayValue.value = formatDate(newValue)
}, { immediate: true })

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectDate = (date) => {
  selectedDate.value = date
  displayValue.value = formatDate(date)
  emit('update:modelValue', date)
  emit('change', date)
  isOpen.value = false
}

const handleInputChange = (event) => {
  const value = event.target.value
  displayValue.value = value

  const parts = value.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const date = new Date(year, month, day)

    if (!isNaN(date.getTime())) {
      selectDate(date)
    }
  }
}
</script>

<template>
  <div class="r-date-picker">
    <label v-if="label" class="r-date-picker__label">
      {{ label }}
    </label>

    <div class="r-date-picker__container">
      <div
          :class="[
          'r-date-picker__input-wrapper',
          { 'r-date-picker__input-wrapper--error': error },
          { 'r-date-picker__input-wrapper--disabled': disabled }
        ]"
          @click="togglePicker"
      >
        <input
            :value="displayValue"
            :placeholder="placeholder"
            :disabled="disabled"
            class="r-date-picker__input"
            @input="handleInputChange"
            @blur="isOpen = false"
        >
        <svg
            class="r-date-picker__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
        </svg>
      </div>

      <div v-if="isOpen" class="r-date-picker__dropdown">
        <p class="r-date-picker__hint">
          Digite a data no formato DD/MM/AAAA ou use os botões rápidos:
        </p>
        <div class="r-date-picker__quick-actions">
          <button
              type="button"
              class="r-date-picker__quick-btn"
              @click="selectDate(new Date())"
          >
            Hoje
          </button>
          <button
              type="button"
              class="r-date-picker__quick-btn"
              @click="selectDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))"
          >
            Há 7 dias
          </button>
          <button
              type="button"
              class="r-date-picker__quick-btn"
              @click="selectDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))"
          >
            Há 30 dias
          </button>
        </div>
      </div>
    </div>

    <p v-if="error" class="r-date-picker__error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.r-date-picker {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1-5);
  width: 100%;
}

.r-date-picker__label {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-date-picker__container {
  position: relative;
}

.r-date-picker__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-white);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing-out);
}

.r-date-picker__input-wrapper:hover:not(.r-date-picker__input-wrapper--disabled) {
  border-color: var(--border-dark);
}

.r-date-picker__input-wrapper--error {
  border-color: var(--color-error-500);
}

.r-date-picker__input-wrapper--disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
  opacity: 0.5;
}

.r-date-picker__input {
  flex: 1;
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.r-date-picker__input::placeholder {
  color: var(--text-tertiary);
}

.r-date-picker__input:disabled {
  cursor: not-allowed;
}

.r-date-picker__icon {
  width: var(--spacing-5);
  height: var(--spacing-5);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.r-date-picker__dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-1));
  left: 0;
  right: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-white);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-4);
}

.r-date-picker__hint {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-3) 0;
}

.r-date-picker__quick-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.r-date-picker__quick-btn {
  padding: var(--spacing-2) var(--spacing-3);
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
  background-color: var(--color-primary-50);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-out);
}

.r-date-picker__quick-btn:hover {
  background-color: var(--color-primary-100);
}

.r-date-picker__error {
  font-family: var(--font-sans),sans-serif;
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
  margin: 0;
}
</style>