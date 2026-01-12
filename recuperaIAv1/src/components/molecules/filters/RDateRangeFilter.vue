<script setup>
/**
 * RDateRangeFilter - Filtro de Intervalo de Datas
 *
 * Componente molecule para seleção de período com dois date pickers
 * conectados (data início e fim) com validação automática.
 *
 * @example
 * <RDateRangeFilter
 *   v-model:startDate="filters.startDate"
 *   v-model:endDate="filters.endDate"
 *   label="Período"
 *   @change="handleDateChange"
 * />
 */

import { ref, watch, computed } from 'vue'
import RDatePicker from '@components/atoms/inputs/RDatePicker.vue'
import RText from '@components/atoms/typography/RText.vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

// Props
const props = defineProps({
  /**
   * Data de início (v-model:startDate)
   */
  startDate: {
    type: [String, Date],
    default: null
  },

  /**
   * Data de fim (v-model:endDate)
   */
  endDate: {
    type: [String, Date],
    default: null
  },

  /**
   * Label do filtro
   */
  label: {
    type: String,
    default: 'Período'
  },

  /**
   * Placeholder para data início
   */
  startPlaceholder: {
    type: String,
    default: 'Data inicial'
  },

  /**
   * Placeholder para data fim
   */
  endPlaceholder: {
    type: String,
    default: 'Data final'
  },

  /**
   * Ícone do separador
   */
  separatorIcon: {
    type: String,
    default: 'arrow-right'
  },

  /**
   * Tamanho dos date pickers
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Se deve mostrar botão de limpar
   */
  clearable: {
    type: Boolean,
    default: true
  },

  /**
   * Se está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Data mínima permitida
   */
  minDate: {
    type: [String, Date],
    default: null
  },

  /**
   * Data máxima permitida
   */
  maxDate: {
    type: [String, Date],
    default: null
  },

  /**
   * Orientação do layout
   * @values horizontal, vertical
   */
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

// Emits
const emit = defineEmits([
  'update:startDate',
  'update:endDate',
  'change',
  'clear'
])

// State
const start = ref(props.startDate)
const end = ref(props.endDate)

// Computed
const hasValue = computed(() => {
  return start.value || end.value
})

const containerClasses = computed(() => {
  const classes = ['r-date-range-filter']
  classes.push(`r-date-range-filter--${props.orientation}`)
  return classes
})

// Watchers
watch(() => props.startDate, (newVal) => {
  start.value = newVal
})

watch(() => props.endDate, (newVal) => {
  end.value = newVal
})

watch(start, (val) => {
  emit('update:startDate', val)
  emitChange()
})

watch(end, (val) => {
  emit('update:endDate', val)
  emitChange()
})

// Methods
const emitChange = () => {
  emit('change', {
    startDate: start.value,
    endDate: end.value
  })
}

const clear = () => {
  start.value = null
  end.value = null
  emit('update:startDate', null)
  emit('update:endDate', null)
  emit('clear')
}
</script>

<template>
  <div :class="containerClasses">
    <!-- Label -->
    <div v-if="label" class="r-date-range-filter__header">
      <RText
        size="sm"
        color="secondary"
        weight="medium"
        class="r-date-range-filter__label"
      >
        {{ label }}
      </RText>

      <!-- Clear Button -->
      <RButton
        v-if="clearable && hasValue && !disabled"
        variant="ghost"
        size="sm"
        @click="clear"
        class="r-date-range-filter__clear"
      >
        Limpar
      </RButton>
    </div>

    <!-- Date Pickers -->
    <div class="r-date-range-filter__inputs">
      <!-- Start Date -->
      <RDatePicker
        v-model="start"
        :placeholder="startPlaceholder"
        :max-date="end || maxDate"
        :min-date="minDate"
        :size="size"
        :disabled="disabled"
        class="r-date-range-filter__picker"
      />

      <!-- Separator -->
      <div class="r-date-range-filter__separator">
        <RIcon :name="separatorIcon" size="14" />
      </div>

      <!-- End Date -->
      <RDatePicker
        v-model="end"
        :placeholder="endPlaceholder"
        :min-date="start || minDate"
        :max-date="maxDate"
        :size="size"
        :disabled="disabled"
        class="r-date-range-filter__picker"
      />
    </div>

    <!-- Custom Footer Slot -->
    <div v-if="$slots.footer" class="r-date-range-filter__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-date-range-filter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

/* ============================================================================
   HEADER
   ============================================================================ */

.r-date-range-filter__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.r-date-range-filter__label {
  flex: 1;
}

.r-date-range-filter__clear {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  padding: var(--spacing-1) var(--spacing-2);
}

.r-date-range-filter__clear:hover {
  background-color: var(--color-error-50);
}

/* ============================================================================
   INPUTS
   ============================================================================ */

.r-date-range-filter__inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.r-date-range-filter--vertical .r-date-range-filter__inputs {
  flex-direction: column;
  align-items: stretch;
}

.r-date-range-filter__picker {
  flex: 1;
  min-width: 140px;
}

.r-date-range-filter--vertical .r-date-range-filter__picker {
  width: 100%;
}

/* ============================================================================
   SEPARATOR
   ============================================================================ */

.r-date-range-filter__separator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.r-date-range-filter--vertical .r-date-range-filter__separator {
  transform: rotate(90deg);
  height: 0;
}

/* ============================================================================
   FOOTER
   ============================================================================ */

.r-date-range-filter__footer {
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--color-border-light);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-date-range-filter__inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .r-date-range-filter__picker {
    width: 100%;
    min-width: unset;
  }

  .r-date-range-filter__separator {
    transform: rotate(90deg);
    height: 0;
  }
}
</style>