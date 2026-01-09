<script setup>
import RIcon from '@components/atoms/icons/RIcon.vue'

const props = defineProps({
  label: { type: String, required: true },
  removable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  icon: { type: String, default: null },
  variant: { type: String, default: 'default', validator: v => ['default', 'outline', 'soft'].includes(v) },
  color: { type: String, default: 'primary' }
})

const emit = defineEmits(['click', 'remove'])
</script>

<template>
  <span
    :class="[
      'r-chip',
      `r-chip--${variant}`,
      `r-chip--color-${color}`,
      { 'r-chip--selected': selected }
    ]"
    @click="$emit('click')"
  >
    <RIcon v-if="icon" :name="icon" size="14" class="r-chip__icon" />

    <span class="r-chip__label">{{ label }}</span>

    <button v-if="removable" class="r-chip__remove" @click.stop="$emit('remove')">
      <RIcon name="x" size="12" />
    </button>
  </span>
</template>

<style scoped>
.r-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 4px 12px;
  border-radius: 9999px; /* Pill shape */
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  border: 1px solid transparent;
}

.r-chip__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 2px;
  border-radius: 50%;
  cursor: pointer;
  color: currentColor;
  opacity: 0.7;
}

.r-chip__remove:hover { opacity: 1; background-color: rgba(0,0,0,0.1); }

/* Variants */
.r-chip--default {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.r-chip--outline {
  background-color: transparent;
  border-color: var(--border-medium);
  color: var(--text-secondary);
}

.r-chip--soft {
  /* Requires CSS variables for colors like --color-primary-light */
  background-color: var(--bg-secondary);
  color: var(--color-primary);
}

/* Selected State */
.r-chip--selected {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}
</style>