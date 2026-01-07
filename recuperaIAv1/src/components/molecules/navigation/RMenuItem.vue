<script setup>
/**
 * RMenuItem - Item de menu
 */
import RText from '@components/atoms/typography/RText.vue'
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
</script>

<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :class="[
      'r-menu-item',
      { 'r-menu-item--active': active },
      { 'r-menu-item--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="!disabled && emit('click')"
  >
    <span v-if="icon" class="r-menu-item__icon">{{ icon }}</span>
    <RText size="sm" weight="medium" class="r-menu-item__label">
      {{ label }}
    </RText>
    <RBadge v-if="badge" size="sm" variant="primary" class="r-menu-item__badge">
      {{ badge }}
    </RBadge>
  </component>
</template>

<style scoped>
.r-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.r-menu-item:hover:not(.r-menu-item--disabled) {
  background-color: var(--bg-tertiary);
}

.r-menu-item--active {
  background-color: var(--color-primary-50);
  color: var(--color-primary);
}

.r-menu-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.r-menu-item__icon {
  font-size: 20px;
  flex-shrink: 0;
}

.r-menu-item__label {
  flex: 1;
  text-align: left;
}

.r-menu-item__badge {
  margin-left: auto;
}
</style>