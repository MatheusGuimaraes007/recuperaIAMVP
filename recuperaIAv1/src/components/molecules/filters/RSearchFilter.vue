<script setup>
/**
 * RSearchFilter - Filtro de Busca com Debounce
 *
 * Componente molecule para busca com debounce automático,
 * botão de limpar e feedback visual.
 *
 * @example
 * <RSearchFilter
 *   v-model="searchQuery"
 *   placeholder="Buscar pacientes..."
 *   :debounce="300"
 *   @search="handleSearch"
 * />
 */

import { ref, watch, computed, onBeforeUnmount } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

// Props
const props = defineProps({
  /**
   * Valor da busca (v-model)
   */
  modelValue: {
    type: String,
    default: ''
  },

  /**
   * Placeholder do input
   */
  placeholder: {
    type: String,
    default: 'Buscar...'
  },

  /**
   * Tempo de debounce em ms
   */
  debounce: {
    type: Number,
    default: 300,
    validator: (value) => value >= 0
  },

  /**
   * Tamanho do input
   * @values sm, md, lg
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },

  /**
   * Se está desabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Se deve auto-focar ao montar
   */
  autofocus: {
    type: Boolean,
    default: false
  },

  /**
   * Ícone de busca customizado
   */
  searchIcon: {
    type: String,
    default: 'search'
  },

  /**
   * Se deve mostrar loading ao buscar
   */
  loading: {
    type: Boolean,
    default: false
  },

  /**
   * Largura mínima
   */
  minWidth: {
    type: String,
    default: '200px'
  },

  /**
   * Largura máxima
   */
  maxWidth: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'search',
  'clear',
  'focus',
  'blur'
])

// State
const internalValue = ref(props.modelValue)
const isFocused = ref(false)
let debounceTimeout = null

// Computed
const containerStyle = computed(() => {
  const style = {
    minWidth: props.minWidth
  }

  if (props.maxWidth) {
    style.maxWidth = props.maxWidth
  }

  return style
})

const hasValue = computed(() => {
  return internalValue.value && internalValue.value.length > 0
})

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal !== internalValue.value) {
    internalValue.value = newVal
  }
})

// Methods
const handleInput = (value) => {
  internalValue.value = value

  // Clear previous timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  // Immediate emit for v-model sync
  emit('update:modelValue', value)

  // Debounced search emit
  if (props.debounce > 0) {
    debounceTimeout = setTimeout(() => {
      emit('search', value)
    }, props.debounce)
  } else {
    emit('search', value)
  }
}

const clear = () => {
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  emit('clear')
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

// Cleanup
onBeforeUnmount(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
})
</script>

<template>
  <div class="r-search-filter" :style="containerStyle">
    <RInput
      :model-value="internalValue"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :autofocus="autofocus"
      :icon-left="searchIcon"
      class="r-search-filter__input"
      @update:model-value="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- Loading Spinner or Clear Button -->
      <template #icon-right>
        <div class="r-search-filter__actions">
          <!-- Loading Spinner -->
          <div v-if="loading" class="r-search-filter__loading">
            <svg
              class="r-search-filter__spinner"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <!-- Clear Button -->
          <RIconButton
            v-else-if="hasValue && !disabled"
            icon="x"
            variant="ghost"
            size="sm"
            tabindex="-1"
            aria-label="Limpar busca"
            @click="clear"
          />
        </div>
      </template>
    </RInput>
  </div>
</template>

<style scoped>
/* ============================================================================
   BASE STYLES
   ============================================================================ */

.r-search-filter {
  width: 100%;
  position: relative;
}

.r-search-filter__input {
  width: 100%;
}

/* ============================================================================
   ACTIONS
   ============================================================================ */

.r-search-filter__actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============================================================================
   LOADING
   ============================================================================ */

.r-search-filter__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-1);
  color: var(--color-primary);
}

.r-search-filter__spinner {
  width: 16px;
  height: 16px;
  animation: r-search-spin 1s linear infinite;
}

@keyframes r-search-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 640px) {
  .r-search-filter {
    min-width: unset;
    max-width: unset;
  }
}
</style>