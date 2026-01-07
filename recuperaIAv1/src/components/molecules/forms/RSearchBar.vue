<script setup>
/**
 * RSearchBar - Barra de Pesquisa
 * 
 * Combina Input + Botão de busca + Ícone
 */

import { ref, computed } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Pesquisar...'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  showButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const localValue = ref(props.modelValue)

const handleInput = (value) => {
  localValue.value = value
  emit('update:modelValue', value)
}

const handleSearch = () => {
  emit('search', localValue.value)
}

const handleClear = () => {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const showClearButton = computed(() => localValue.value.length > 0)
</script>

<template>
  <div class="r-search-bar">
    <div class="r-search-bar__input-wrapper">
      <RInput
        :model-value="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :size="size"
        icon-left="🔍"
        class="r-search-bar__input"
        @update:model-value="handleInput"
        @keydown.enter="handleSearch"
      >
        <template #icon-left>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </template>
      </RInput>

      <!-- Clear Button -->
      <RIconButton
        v-if="showClearButton"
        variant="ghost"
        :size="size"
        aria-label="Limpar busca"
        class="r-search-bar__clear"
        @click="handleClear"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </RIconButton>
    </div>

    <!-- Search Button -->
    <RButton
      v-if="showButton"
      variant="primary"
      :size="size"
      :loading="loading"
      :disabled="disabled"
      @click="handleSearch"
    >
      Buscar
    </RButton>
  </div>
</template>

<style scoped>
.r-search-bar {
  display: flex;
  gap: var(--spacing-2);
  width: 100%;
}

.r-search-bar__input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.r-search-bar__input {
  flex: 1;
}

.r-search-bar__clear {
  position: absolute;
  right: var(--spacing-2);
  top: 50%;
  transform: translateY(-50%);
}
</style>
