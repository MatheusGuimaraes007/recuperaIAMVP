<script setup>
/**
 * RTabItem - Item de aba
 */
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'r-tab-item',
      { 'r-tab-item--active': active },
      { 'r-tab-item--disabled': disabled }
    ]"
    :disabled="disabled"
    :aria-selected="active"
    role="tab"
    @click="!disabled && emit('click', value)"
  >
    <RText
      size="sm"
      weight="semibold"
      :color="active ? 'primary' : 'secondary'"
    >
      {{ label }}
    </RText>
  </button>
</template>

<style scoped>
.r-tab-item {
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

.r-tab-item:hover:not(.r-tab-item--disabled) {
  background-color: var(--bg-tertiary);
}

.r-tab-item--active {
  border-bottom-color: var(--color-primary);
}

.r-tab-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>