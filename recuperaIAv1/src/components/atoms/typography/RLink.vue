<script setup>
/**
 * RLink - Link com estilos
 */
import { computed } from 'vue'

const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  external: { type: Boolean, default: false },
  underline: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    return {
      href: props.href,
      target: props.external ? '_blank' : undefined,
      rel: props.external ? 'noopener noreferrer' : undefined
    }
  }
  return {}
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    :class="[
      'r-link',
      { 'r-link--underline': underline },
      { 'r-link--disabled': disabled }
    ]"
    @click="!disabled && emit('click', $event)"
  >
    <slot />
  </component>
</template>

<style scoped>
.r-link {
  color: var(--color-primary);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
  background: none;
  border: none;
  padding: 0;
  font: inherit;
}

.r-link:hover:not(.r-link--disabled) {
  color: var(--color-primary-700); /* CORRIGIDO: era primary-dark */
}

.r-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.r-link--underline {
  text-decoration: underline;
}

.r-link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>