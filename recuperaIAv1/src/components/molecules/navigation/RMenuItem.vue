<script setup>
/**
 * RMenuItem - Item de Menu
 *
 * Componente para itens de menu com ícone, label e badge.
 */

import { computed } from 'vue'
import RIcon from '@components/atoms/icons/RIcon.vue'
import RBadge from '@components/atoms/feedback/RBadge.vue'

const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: null },
  badge: { type: [String, Number], default: null },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  to: { type: [String, Object], default: null }
})

const emit = defineEmits(['click'])

const classes = computed(() => [
  'r-menu-item',
  { 'r-menu-item--active': props.active },
  { 'r-menu-item--disabled': props.disabled }
])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :class="classes"
    :disabled="disabled"
    @click="handleClick"
  >
    <RIcon v-if="icon" :name="icon" size="18" class="r-menu-item__icon" />
    <span class="r-menu-item__label">{{ label }}</span>
    <RBadge v-if="badge" :label="String(badge)" size="sm" class="r-menu-item__badge" />
  </component>
</template>

<style scoped>
.r-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
}

.r-menu-item:hover:not(.r-menu-item--disabled) {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.r-menu-item--active {
  background-color: var(--color-primary-50);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.r-menu-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-menu-item__label {
  flex: 1;
}

.r-menu-item__badge {
  margin-left: auto;
}
</style>