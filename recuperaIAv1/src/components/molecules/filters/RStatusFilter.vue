<script setup>
import RSelect from '@components/atoms/inputs/RSelect.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  options: { type: Array, required: true }, // [{ label: 'Ativo', value: 'active' }]
  label: { type: String, default: 'Status' },
  allLabel: { type: String, default: 'Todos' }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="r-status-filter">
    <RSelect
      :model-value="modelValue"
      :options="[{ label: allLabel, value: null }, ...options]"
      :label="label"
      @update:model-value="handleChange"
    />
  </div>
</template>

<style scoped>
.r-status-filter { min-width: 150px; }
</style>