<script setup>
/**
 * RTabs - Sistema de Abas
 *
 * Componente molecule para navegação por abas com variantes
 * e suporte a ícones e badges.
 *
 * @example
 * <RTabs
 *   v-model="activeTab"
 *   :items="[
 *     { label: 'Geral', value: 'general', icon: 'user' },
 *     { label: 'Config', value: 'config' }
 *   ]"
 * />
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RBadge from '@components/atoms/feedback/RBadge.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: items => items.every(item => item.label && item.value)
  },
  modelValue: { type: String, required: true },
  variant: {
    type: String,
    default: 'line',
    validator: v => ['line', 'pill', 'underline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  fullWidth: { type: Boolean, default: false },
  align: {
    type: String,
    default: 'left',
    validator: v => ['left', 'center', 'right'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const headerClasses = computed(() => [
  'r-tabs__header',
  `r-tabs__header--${props.variant}`,
  `r-tabs__header--${props.size}`,
  `r-tabs__header--align-${props.align}`,
  { 'r-tabs__header--full-width': props.fullWidth }
])

const selectTab = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="r-tabs">
    <div :class="headerClasses" role="tablist">
      <button
        v-for="item in items"
        :key="item.value"
        :class="[
          'r-tabs__item',
          { 'r-tabs__item--active': modelValue === item.value },
          { 'r-tabs__item--disabled': item.disabled }
        ]"
        role="tab"
        :aria-selected="modelValue === item.value"
        :disabled="item.disabled"
        @click="!item.disabled && selectTab(item.value)"
      >
        <RIcon v-if="item.icon" :name="item.icon" size="16" class="r-tabs__icon" />
        <span class="r-tabs__label">{{ item.label }}</span>
        <RBadge v-if="item.badge" :label="String(item.badge)" size="sm" variant="primary" />
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
  gap: var(--spacing-2);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-4);
}

.r-tabs__header--align-center { justify-content: center; }
.r-tabs__header--align-right { justify-content: flex-end; }
.r-tabs__header--full-width .r-tabs__item { flex: 1; }

.r-tabs__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.r-tabs__item:hover:not(.r-tabs__item--disabled) {
  color: var(--color-primary);
}

.r-tabs__item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.r-tabs__header--sm .r-tabs__item { padding: var(--spacing-2) var(--spacing-1); font-size: var(--font-size-sm); }
.r-tabs__header--md .r-tabs__item { padding: var(--spacing-3) var(--spacing-2); font-size: var(--font-size-base); }
.r-tabs__header--lg .r-tabs__item { padding: var(--spacing-4) var(--spacing-3); font-size: var(--font-size-lg); }

/* Line variant */
.r-tabs__header--line .r-tabs__item--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Pill variant */
.r-tabs__header--pill {
  border-bottom: none;
  background-color: var(--color-bg-secondary);
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
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
}

/* Underline variant */
.r-tabs__header--underline {
  border-bottom: 2px solid var(--color-border-light);
}

.r-tabs__header--underline .r-tabs__item--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  margin-bottom: -1px;
}
</style>