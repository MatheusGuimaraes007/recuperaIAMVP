<script setup>
/**
 * RKeyValue - Par chave-valor
 */
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (v) => ['horizontal', 'vertical'].includes(v)
  }
})
</script>

<template>
  <div :class="['r-key-value', `r-key-value--${orientation}`]">
    <RText size="sm" color="secondary" weight="medium" class="r-key-value__label">
      {{ label }}:
    </RText>
    <RText size="sm" weight="semibold" class="r-key-value__value">
      {{ value }}
    </RText>
  </div>
</template>

<style scoped>
.r-key-value {
  display: flex;
  gap: var(--spacing-2);
}

.r-key-value--horizontal {
  flex-direction: row;
  align-items: center;
}

.r-key-value--vertical {
  flex-direction: column;
  align-items: flex-start;
}
</style>