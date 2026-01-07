<script setup>
/**
 * RText - Componente de Texto
 * 
 * Texto de corpo com variantes de tamanho e estilo.
 */

import { computed } from 'vue'

const props = defineProps({
  /**
   * Tamanho do texto
   * @values xs, sm, base, lg
   */
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['xs', 'sm', 'base', 'lg'].includes(value)
  },

  /**
   * Peso da fonte
   * @values light, regular, medium, semibold, bold
   */
  weight: {
    type: String,
    default: 'regular',
    validator: (value) => ['light', 'regular', 'medium', 'semibold', 'bold'].includes(value)
  },

  /**
   * Cor do texto
   */
  color: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'tertiary', 'inverse', 
      'success', 'warning', 'error', 'info'
    ].includes(value)
  },

  /**
   * Alinhamento
   */
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right', 'justify'].includes(value)
  },

  /**
   * Tag HTML
   */
  as: {
    type: String,
    default: 'p'
  },

  /**
   * Truncar com ellipsis
   */
  truncate: {
    type: Boolean,
    default: false
  }
})

const textClasses = computed(() => {
  const classes = ['r-text']
  
  classes.push(`r-text--size-${props.size}`)
  classes.push(`r-text--weight-${props.weight}`)
  classes.push(`r-text--color-${props.color}`)
  classes.push(`r-text--align-${props.align}`)
  
  if (props.truncate) classes.push('r-text--truncate')
  
  return classes
})
</script>

<template>
  <component :is="as" :class="textClasses">
    <slot />
  </component>
</template>

<style scoped>
.r-text {
  margin: 0;
  font-family: var(--font-sans);
  line-height: var(--line-height-relaxed);
}

/* Sizes */
.r-text--size-xs { font-size: var(--font-size-xs); }
.r-text--size-sm { font-size: var(--font-size-sm); }
.r-text--size-base { font-size: var(--font-size-base); }
.r-text--size-lg { font-size: var(--font-size-lg); }

/* Weights */
.r-text--weight-light { font-weight: var(--font-weight-light); }
.r-text--weight-regular { font-weight: var(--font-weight-regular); }
.r-text--weight-medium { font-weight: var(--font-weight-medium); }
.r-text--weight-semibold { font-weight: var(--font-weight-semibold); }
.r-text--weight-bold { font-weight: var(--font-weight-bold); }

/* Colors */
.r-text--color-primary { color: var(--text-primary); }
.r-text--color-secondary { color: var(--text-secondary); }
.r-text--color-tertiary { color: var(--text-tertiary); }
.r-text--color-inverse { color: var(--text-inverse); }
.r-text--color-success { color: var(--color-success); }
.r-text--color-warning { color: var(--color-warning); }
.r-text--color-error { color: var(--color-error); }
.r-text--color-info { color: var(--color-info); }

/* Alignment */
.r-text--align-left { text-align: left; }
.r-text--align-center { text-align: center; }
.r-text--align-right { text-align: right; }
.r-text--align-justify { text-align: justify; }

/* Truncate */
.r-text--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
