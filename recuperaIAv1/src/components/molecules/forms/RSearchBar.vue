<script setup>
/**
 * RSearchBar - Barra de Busca Avançada
 *
 * Similar ao RSearchFilter mas com mais recursos visuais
 * e opções de exibição.
 */

import { ref, watch, onBeforeUnmount } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar...' },
  loading: { type: Boolean, default: false },
  debounce: { type: Number, default: 300 },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  showButton: { type: Boolean, default: false },
  buttonLabel: { type: String, default: 'Buscar' }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const internalValue = ref(props.modelValue)
let timeout = null

const handleInput = (val) => {
  internalValue.value = val
  if (timeout) clearTimeout(timeout)

  timeout = setTimeout(() => {
    emit('update:modelValue', val)
    emit('search', val)
  }, props.debounce)
}

const handleSearch = () => {
  emit('update:modelValue', internalValue.value)
  emit('search', internalValue.value)
}

const clear = () => {
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== internalValue.value) {
    internalValue.value = newVal
  }
})

onBeforeUnmount(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <div class="r-search-bar">
    <RInput
      :model-value="internalValue"
      :placeholder="placeholder"
      :size="size"
      icon-left="search"
      class="r-search-bar__input"
      @update:model-value="handleInput"
      @keydown.enter="handleSearch"
    >
      <template #icon-right>
        <div v-if="loading" class="r-search-bar__loading">
          <svg class="r-search-bar__spinner" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <RIconButton
          v-else-if="internalValue"
          icon="x"
          variant="ghost"
          :size="size"
          @click="clear"
        />
      </template>
    </RInput>

    <RButton
      v-if="showButton"
      :size="size"
      variant="primary"
      @click="handleSearch"
    >
      {{ buttonLabel }}
    </RButton>
  </div>
</template>

<style scoped>
.r-search-bar {
  display: flex;
  gap: var(--spacing-2);
  width: 100%;
}

.r-search-bar__input {
  flex: 1;
}

.r-search-bar__loading {
  display: flex;
  align-items: center;
  padding: var(--spacing-1);
  color: var(--color-primary);
}

.r-search-bar__spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>