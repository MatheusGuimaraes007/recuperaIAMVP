<script setup>
/**
 * RSelectWithLabel - Select com Label Inline
 *
 * Wrapper conveniente do RSelect com label e valor em linha.
 */

import RSelect from '@components/atoms/inputs/RSelect.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  inline: { type: Boolean, default: true },
  labelWidth: { type: String, default: '120px' },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div :class="['r-select-with-label', { 'r-select-with-label--inline': inline }]">
    <RText
      size="sm"
      weight="medium"
      color="secondary"
      class="r-select-with-label__label"
      :style="{ width: inline ? labelWidth : 'auto' }"
    >
      {{ label }}
    </RText>

    <RSelect
      :model-value="modelValue"
      :options="options"
      :size="size"
      class="r-select-with-label__select"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.r-select-with-label {
  display: flex;
  gap: var(--spacing-3);
}

.r-select-with-label--inline {
  align-items: center;
}

.r-select-with-label:not(.r-select-with-label--inline) {
  flex-direction: column;
  gap: var(--spacing-2);
}

.r-select-with-label__select {
  flex: 1;
}
</style>