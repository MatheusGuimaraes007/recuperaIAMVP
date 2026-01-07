<script setup>
/**
 * RLabel - Label para formulários
 */
const props = defineProps({
  for: { type: String, default: null },
  required: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'base',
    validator: (v) => ['sm', 'base', 'lg'].includes(v)
  }
})
</script>

<template>
  <label
    :for="for"
    :class="['r-label', `r-label--${size}`]"
  >
    <slot />
    <span v-if="required" class="r-label__required">*</span>
  </label>
</template>

<style scoped>
.r-label {
  display: inline-block;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  cursor: pointer;
}

.r-label--sm { font-size: var(--font-size-xs); }
.r-label--base { font-size: var(--font-size-sm); }
.r-label--lg { font-size: var(--font-size-base); }

.r-label__required {
  color: var(--color-error);
  margin-left: 2px;
}
</style>