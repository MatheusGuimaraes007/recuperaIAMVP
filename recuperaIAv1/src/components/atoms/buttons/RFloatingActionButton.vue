<script setup>
/**
 * RFloatingActionButton - FAB (Material Design style)
 */
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  extended: { type: Boolean, default: false },
  ariaLabel: { type: String, required: true }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'r-fab',
      `r-fab--${size}`,
      { 'r-fab--extended': extended }
    ]"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="r-fab__icon">
      <slot name="icon" />
    </span>
    <span v-if="extended" class="r-fab__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.r-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: background-color var(--duration-normal) var(--easing-out),
              box-shadow var(--duration-normal) var(--easing-out),
              transform var(--duration-normal) var(--easing-out); /* NOVO */
}

.r-fab:hover {
  box-shadow: var(--shadow-xl);
  background-color: var(--color-primary-700); /* CORRIGIDO: era primary-dark */
  transform: scale(1.05); /* NOVO: microinteração */
}

/* NOVO: Estado active */
.r-fab:active {
  box-shadow: var(--shadow-lg);
  transform: scale(0.95);
}

.r-fab:focus-visible {
  box-shadow: var(--shadow-focus), var(--shadow-xl);
}

/* Sizes - CORRIGIDO: usar CSS variables */
.r-fab--sm {
  width: var(--spacing-10);  /* 40px */
  height: var(--spacing-10);
  font-size: var(--font-size-lg); /* 18px */
}

.r-fab--md {
  width: var(--spacing-14);  /* 56px */
  height: var(--spacing-14);
  font-size: var(--font-size-2xl); /* 24px */
}

.r-fab--lg {
  width: 72px;  /* Não tem spacing exato, manter fixo */
  height: 72px;
  font-size: var(--font-size-4xl); /* 32px - ajustado de 3xl */
}

/* Extended */
.r-fab--extended {
  width: auto;
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-full);
}
</style>