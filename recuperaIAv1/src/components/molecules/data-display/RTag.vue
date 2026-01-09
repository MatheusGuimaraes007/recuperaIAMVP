<script setup>
const props = defineProps({
  label: { type: String, required: true },
  /**
   * Cores semânticas ou hex
   */
  color: { type: String, default: 'neutral' },
  variant: { type: String, default: 'solid' }, // solid, outline, soft
  size: { type: String, default: 'md' } // sm, md
})
</script>

<template>
  <span
    class="r-tag"
    :class="[
      `r-tag--${variant}`,
      `r-tag--size-${size}`,
      `r-tag--color-${color}`
    ]"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.r-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
  line-height: 1;
}

/* Sizes */
.r-tag--size-sm {
  font-size: 0.75rem; /* 12px */
  padding: 2px 6px;
}

.r-tag--size-md {
  font-size: 0.875rem; /* 14px */
  padding: 4px 8px;
}

/* Variants & Colors Logic (Exemplo simplificado) */
/* Soft (Padrão moderno: fundo claro, texto escuro) */
.r-tag--soft.r-tag--color-neutral { background: var(--color-gray-100); color: var(--color-gray-700); }
.r-tag--soft.r-tag--color-primary { background: var(--color-primary-50); color: var(--color-primary-700); }
.r-tag--soft.r-tag--color-success { background: var(--color-success-50); color: var(--color-success-700); }
.r-tag--soft.r-tag--color-warning { background: var(--color-warning-50); color: var(--color-warning-700); }
.r-tag--soft.r-tag--color-error   { background: var(--color-error-50); color: var(--color-error-700); }

/* Solid */
.r-tag--solid.r-tag--color-primary { background: var(--color-primary); color: white; }
/* ...outras cores solidas... */

/* Outline */
.r-tag--outline {
  background: transparent;
  border: 1px solid currentColor;
}
.r-tag--outline.r-tag--color-primary { color: var(--color-primary); }
</style>