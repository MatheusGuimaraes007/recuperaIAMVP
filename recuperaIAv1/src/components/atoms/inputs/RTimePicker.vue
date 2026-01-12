<script setup>
/**
 * RTimePicker - Seletor de Hora
 * 
 * Seletor de hora e minuto com dropdowns.
 * 
 * @example
 * <RTimePicker v-model="time" label="Hora do Evento" />
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import RIcon from '../icons/RIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: null
  },
  format: {
    type: String,
    default: '24h',
    validator: (v) => ['12h', '24h'].includes(v)
  },
  minuteStep: {
    type: Number,
    default: 15,
    validator: (v) => [1, 5, 10, 15, 30].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedHour = ref(12)
const selectedMinute = ref(0)
const selectedPeriod = ref('AM')
const pickerRef = ref(null) // NOVO: para click outside

const hours = computed(() => {
  if (props.format === '24h') {
    return Array.from({ length: 24 }, (_, i) => i)
  }
  return Array.from({ length: 12 }, (_, i) => i + 1)
})

const minutes = computed(() => {
  return Array.from({ length: 60 / props.minuteStep }, (_, i) => i * props.minuteStep)
})

const displayValue = computed(() => {
  if (!props.modelValue) return 'Selecione uma hora'
  return props.modelValue
})

const formatTime = () => {
  let hour = selectedHour.value

  if (props.format === '12h') {
    const period = selectedPeriod.value
    const formattedHour = hour.toString().padStart(2, '0')
    const formattedMinute = selectedMinute.value.toString().padStart(2, '0')
    return `${formattedHour}:${formattedMinute} ${period}`
  } else {
    const formattedHour = hour.toString().padStart(2, '0')
    const formattedMinute = selectedMinute.value.toString().padStart(2, '0')
    return `${formattedHour}:${formattedMinute}`
  }
}

const selectTime = () => {
  const timeString = formatTime()
  emit('update:modelValue', timeString)
  isOpen.value = false
}

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

// NOVO: Click outside handler
const handleClickOutside = (event) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="pickerRef" class="r-timepicker-wrapper">
    <label v-if="label" class="r-timepicker-label">{{ label }}</label>

    <div :class="['r-timepicker', { 'r-timepicker--error': error, 'r-timepicker--disabled': disabled }]">
      <div class="r-timepicker__trigger" @click="togglePicker">
        <span class="r-timepicker__value">{{ displayValue }}</span>
        <RIcon name="clock" :size="20" class="r-timepicker__icon" />
      </div>

      <!-- CORRIGIDO: adicionar animation -->
      <div v-if="isOpen" class="r-timepicker__popup">
        <div class="r-timepicker__selectors">
          <!-- Hours -->
          <div class="r-timepicker__selector">
            <div class="r-timepicker__selector-label">Hora</div>
            <div class="r-timepicker__options">
              <button
                v-for="hour in hours"
                :key="hour"
                type="button"
                :class="['r-timepicker__option', { 'r-timepicker__option--selected': selectedHour === hour }]"
                @click="selectedHour = hour"
              >
                {{ format === '24h' ? hour.toString().padStart(2, '0') : hour }}
              </button>
            </div>
          </div>

          <!-- Minutes -->
          <div class="r-timepicker__selector">
            <div class="r-timepicker__selector-label">Minuto</div>
            <div class="r-timepicker__options">
              <button
                v-for="minute in minutes"
                :key="minute"
                type="button"
                :class="['r-timepicker__option', { 'r-timepicker__option--selected': selectedMinute === minute }]"
                @click="selectedMinute = minute"
              >
                {{ minute.toString().padStart(2, '0') }}
              </button>
            </div>
          </div>

          <!-- Period (12h format) -->
          <div v-if="format === '12h'" class="r-timepicker__selector">
            <div class="r-timepicker__selector-label">Período</div>
            <div class="r-timepicker__options">
              <button
                type="button"
                :class="['r-timepicker__option', { 'r-timepicker__option--selected': selectedPeriod === 'AM' }]"
                @click="selectedPeriod = 'AM'"
              >
                AM
              </button>
              <button
                type="button"
                :class="['r-timepicker__option', { 'r-timepicker__option--selected': selectedPeriod === 'PM' }]"
                @click="selectedPeriod = 'PM'"
              >
                PM
              </button>
            </div>
          </div>
        </div>

        <div class="r-timepicker__actions">
          <button type="button" class="r-timepicker__button r-timepicker__button--cancel" @click="isOpen = false">
            Cancelar
          </button>
          <button type="button" class="r-timepicker__button r-timepicker__button--confirm" @click="selectTime">
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <span v-if="errorMessage && error" class="r-timepicker-error">{{ errorMessage }}</span>
  </div>
</template>

<style scoped>
.r-timepicker-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-timepicker-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-timepicker {
  position: relative;
}

.r-timepicker__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background-color: var(--bg-primary);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--duration-normal) var(--easing-out);
}

.r-timepicker__trigger:hover:not(.r-timepicker--disabled *) {
  border-color: var(--color-primary);
}

.r-timepicker--error .r-timepicker__trigger {
  border-color: var(--color-error);
}

.r-timepicker--disabled .r-timepicker__trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-timepicker__value {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.r-timepicker__icon {
  color: var(--text-secondary);
}

.r-timepicker__popup {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  left: 0;
  z-index: var(--z-index-dropdown); /* CORRIGIDO: era 50 */
  background-color: var(--bg-primary);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-4);
  /* NOVO: animation */
  animation: slideDown var(--duration-fast) var(--easing-out);
}

/* NOVO: Keyframe para animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.r-timepicker__selectors {
  display: flex;
  gap: var(--spacing-2);
}

.r-timepicker__selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-timepicker__selector-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-align: center;
}

.r-timepicker__options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  max-height: 200px;
  overflow-y: auto;
  padding: var(--spacing-1);
  /* NOVO: smooth scroll */
  scroll-behavior: smooth;
}

.r-timepicker__option {
  padding: var(--spacing-2) var(--spacing-3);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color var(--duration-normal) var(--easing-out);
  text-align: center;
  font-size: var(--font-size-sm);
}

.r-timepicker__option:hover {
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-secondary */
}

.r-timepicker__option--selected {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-timepicker__actions {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: var(--border-width-default) solid var(--border-light);
}

.r-timepicker__button {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-normal) var(--easing-out);
}

.r-timepicker__button--cancel {
  background-color: var(--color-gray-100); /* CORRIGIDO: era bg-secondary */
  color: var(--text-primary);
}

.r-timepicker__button--cancel:hover {
  background-color: var(--color-gray-200); /* CORRIGIDO: era bg-tertiary */
}

.r-timepicker__button--confirm {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-timepicker__button--confirm:hover {
  background-color: var(--color-primary-700); /* CORRIGIDO: era primary-dark */
}

.r-timepicker-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
}
</style>