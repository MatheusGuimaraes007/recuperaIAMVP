<script setup>
/**
 * RSelectWithLabel - Select com label integrada
 */
import RLabel from '@components/atoms/typography/RLabel.vue'
import RSelect from '@components/atoms/inputs/RSelect.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Selecione...' },
  error: { type: String, default: null },
  required: { type: Boolean, default: false },
  helpText: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <div class="r-select-with-label">
    <RSelect
      :model-value="modelValue"
      :options="options"
      :label="label"
      :placeholder="placeholder"
      :error="error"
      :required="required"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
    />
    <p v-if="helpText && !error" class="r-select-with-label__help">
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
.r-select-with-label {
  width: 100%;
}

.r-select-with-label__help {
  margin: var(--spacing-1) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>