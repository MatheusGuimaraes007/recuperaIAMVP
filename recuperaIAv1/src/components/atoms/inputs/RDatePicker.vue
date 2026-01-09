<script setup>
/**
 * RDatePicker - Seletor de Data
 *
 * Campo de seleção de data com calendário popup.
 *
 * @example
 * <RDatePicker v-model="date" label="Data de Nascimento" />
 */

import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import RIcon from '../icons/RIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },

  label: {
    type: String,
    default: null
  },

  format: {
    type: String,
    default: 'DD/MM/YYYY'
  },

  minDate: {
    type: [String, Date],
    default: null
  },

  maxDate: {
    type: [String, Date],
    default: null
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
const currentMonth = ref(dayjs())

const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  return dayjs(props.modelValue).format(props.format)
})

const daysInMonth = computed(() => {
  const start = currentMonth.value.startOf('month')
  const end = currentMonth.value.endOf('month')
  const days = []

  // Dias do mês anterior para preencher semana
  const startDay = start.day()
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: start.subtract(i + 1, 'day'),
      isCurrentMonth: false
    })
  }

  // Dias do mês atual
  for (let i = 0; i < end.date(); i++) {
    days.push({
      date: start.add(i, 'day'),
      isCurrentMonth: true
    })
  }

  // Dias do próximo mês para completar semana
  const remaining = 42 - days.length // 6 semanas x 7 dias
  for (let i = 0; i < remaining; i++) {
    days.push({
      date: end.add(i + 1, 'day'),
      isCurrentMonth: false
    })
  }

  return days
})

const selectDate = (date) => {
  if (isDateDisabled(date)) return

  emit('update:modelValue', date.toDate())
  isOpen.value = false
}

const isDateDisabled = (date) => {
  if (props.minDate && date.isBefore(dayjs(props.minDate), 'day')) return true
  if (props.maxDate && date.isAfter(dayjs(props.maxDate), 'day')) return true
  return false
}

const isToday = (date) => {
  return date.isSame(dayjs(), 'day')
}

const isSelected = (date) => {
  if (!props.modelValue) return false
  return date.isSame(dayjs(props.modelValue), 'day')
}

const previousMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div class="r-datepicker-wrapper">
    <label v-if="label" class="r-datepicker-label">{{ label }}</label>

    <div :class="['r-datepicker', { 'r-datepicker--error': error, 'r-datepicker--disabled': disabled }]">
      <div class="r-datepicker__trigger" @click="togglePicker">
        <span class="r-datepicker__value">
          {{ formattedValue || 'Selecione uma data' }}
        </span>
        <RIcon name="calendar" :size="20" class="r-datepicker__icon" />
      </div>

      <div v-if="isOpen" class="r-datepicker__popup">
        <div class="r-datepicker__header">
          <button type="button" @click="previousMonth" class="r-datepicker__nav">
            <RIcon name="chevron-left" :size="20" />
          </button>

          <span class="r-datepicker__month">
            {{ currentMonth.format('MMMM YYYY') }}
          </span>

          <button type="button" @click="nextMonth" class="r-datepicker__nav">
            <RIcon name="chevron-right" :size="20" />
          </button>
        </div>

        <div class="r-datepicker__weekdays">
          <div class="r-datepicker__weekday">Dom</div>
          <div class="r-datepicker__weekday">Seg</div>
          <div class="r-datepicker__weekday">Ter</div>
          <div class="r-datepicker__weekday">Qua</div>
          <div class="r-datepicker__weekday">Qui</div>
          <div class="r-datepicker__weekday">Sex</div>
          <div class="r-datepicker__weekday">Sáb</div>
        </div>

        <div class="r-datepicker__days">
          <button
            v-for="day in daysInMonth"
            :key="day.date.format('YYYY-MM-DD')"
            type="button"
            :class="[
              'r-datepicker__day',
              {
                'r-datepicker__day--other-month': !day.isCurrentMonth,
                'r-datepicker__day--today': isToday(day.date),
                'r-datepicker__day--selected': isSelected(day.date),
                'r-datepicker__day--disabled': isDateDisabled(day.date)
              }
            ]"
            @click="selectDate(day.date)"
          >
            {{ day.date.date() }}
          </button>
        </div>
      </div>
    </div>

    <span v-if="errorMessage && error" class="r-datepicker-error">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped>
.r-datepicker-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-datepicker-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.r-datepicker {
  position: relative;
}

.r-datepicker__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background-color: var(--bg-primary);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);
}

.r-datepicker__trigger:hover:not(.r-datepicker--disabled *) {
  border-color: var(--color-primary);
}

.r-datepicker--error .r-datepicker__trigger {
  border-color: var(--color-error);
}

.r-datepicker--disabled .r-datepicker__trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-datepicker__value {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.r-datepicker__icon {
  color: var(--text-secondary);
}

.r-datepicker__popup {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  left: 0;
  z-index: 50;
  background-color: var(--bg-primary);
  border: var(--border-width-default) solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-4);
  min-width: 320px;
}

.r-datepicker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.r-datepicker__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s;
}

.r-datepicker__nav:hover {
  background-color: var(--bg-secondary);
}

.r-datepicker__month {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  text-transform: capitalize;
}

.r-datepicker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-2);
}

.r-datepicker__weekday {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  padding: var(--spacing-2);
}

.r-datepicker__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-1);
}

.r-datepicker__day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-normal);
  font-size: var(--font-size-sm);
}

.r-datepicker__day:hover:not(.r-datepicker__day--disabled) {
  background-color: var(--bg-secondary);
}

.r-datepicker__day--other-month {
  color: var(--text-tertiary);
}

.r-datepicker__day--today {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.r-datepicker__day--selected {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.r-datepicker__day--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.r-datepicker-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
}
</style>