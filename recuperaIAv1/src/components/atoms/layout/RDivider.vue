<script setup>
/**
 * RDivider - Linha divisória
 */
const props = defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (v) => ['horizontal', 'vertical'].includes(v)
  },
  variant: {
    type: String,
    default: 'solid',
    validator: (v) => ['solid', 'dashed', 'dotted'].includes(v)
  }
})
</script>

<template>
  <hr
    :class="[
      'r-divider',
      `r-divider--${orientation}`,
      `r-divider--${variant}`
    ]"
  >
</template>

<style scoped>
.r-divider {
  border: none;
  background-color: var(--border-light);
  margin: 0;
}

.r-divider--horizontal {
  width: 100%;
  height: 1px;
}

.r-divider--vertical {
  width: 1px;
  height: 100%;
  display: inline-block;
}

.r-divider--dashed {
  background: repeating-linear-gradient(
    to right,
    var(--border-light) 0,
    var(--border-light) 4px,
    transparent 4px,
    transparent 8px
  );
}

.r-divider--dotted {
  background: repeating-linear-gradient(
    to right,
    var(--border-light) 0,
    var(--border-light) 2px,
    transparent 2px,
    transparent 6px
  );
}
</style>