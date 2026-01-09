<script setup>
import { ref, watch } from 'vue'
import RInput from '@components/atoms/inputs/RInput.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar...' },
  debounce: { type: Number, default: 300 }
})

const emit = defineEmits(['update:modelValue', 'search'])

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

const clear = () => {
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== internalValue.value) internalValue.value = newVal
})
</script>

<template>
  <div class="r-search-filter">
    <RInput
      :model-value="internalValue"
      :placeholder="placeholder"
      icon-left="search"
      class="r-search-filter__input"
      @update:model-value="handleInput"
    >
      <template #icon-right>
        <RIconButton
          v-if="internalValue"
          icon="x"
          variant="ghost"
          size="sm"
          @click="clear"
          aria-label=""/>
      </template>
    </RInput>
  </div>
</template>

<style scoped>
.r-search-filter { width: 100%; min-width: 200px; }
</style>