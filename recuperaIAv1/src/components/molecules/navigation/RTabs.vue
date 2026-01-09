<script setup>
import { ref } from 'vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  /**
   * Array de objetos: { label: 'Tab 1', value: 'tab1', icon?: 'icon-name' }
   */
  items: { type: Array, required: true },
  modelValue: { type: String, required: true },
  variant: { type: String, default: 'line', validator: v => ['line', 'pill'].includes(v) }
})

const emit = defineEmits(['update:modelValue'])

const selectTab = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="r-tabs">
    <div :class="['r-tabs__header', `r-tabs__header--${variant}`]" role="tablist">
      <button
        v-for="item in items"
        :key="item.value"
        :class="['r-tabs__item', { 'r-tabs__item--active': modelValue === item.value }]"
        role="tab"
        :aria-selected="modelValue === item.value"
        @click="selectTab(item.value)"
      >
        <span v-if="item.icon" class="r-tabs__icon">{{ item.icon }}</span> <span class="r-tabs__label">{{ item.label }}</span>
      </button>
    </div>

    <div class="r-tabs__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.r-tabs__header {
  display: flex;
  gap: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--spacing-4);
}

.r-tabs__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-1);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.r-tabs__item:hover {
  color: var(--color-primary);
}

/* Variant: Line */
.r-tabs__header--line .r-tabs__item--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Variant: Pill */
.r-tabs__header--pill {
  border-bottom: none;
  background-color: var(--bg-secondary);
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  gap: var(--spacing-1);
}

.r-tabs__header--pill .r-tabs__item {
  border-bottom: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-2) var(--spacing-4);
}

.r-tabs__header--pill .r-tabs__item--active {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}
</style>