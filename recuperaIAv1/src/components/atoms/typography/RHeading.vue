<script setup>
/**
 * RHeading - Componente de Título
 * 
 * Títulos com níveis semânticos e estilos visuais desacoplados.
 * 
 * @example
 * <RHeading level="1" as="h1">
 *   Título Principal
 * </RHeading>
 */

import { computed } from 'vue'

// Props
const props = defineProps({
  /**
   * Nível semântico do heading (h1-h6)
   * @values 1, 2, 3, 4, 5, 6
   */
  level: {
    type: [String, Number],
    default: 2,
    validator: (value) => [1, 2, 3, 4, 5, 6, '1', '2', '3', '4', '5', '6'].includes(value)
  },

  /**
   * Tag HTML real (permite desacoplar semântica de visual)
   * @values h1, h2, h3, h4, h5, h6
   */
  as: {
    type: String,
    default: null,
    validator: (value) => !value || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
  },

  /**
   * Cor do texto
   * @values primary, secondary, tertiary, inverse, success, warning, error, info
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
   * Alinhamento do texto
   * @values left, center, right, justify
   */
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right', 'justify'].includes(value)
  },

  /**
   * Se o texto deve ser truncado com reticências
   */
  truncate: {
    type: Boolean,
    default: false
  }
})

// Computed
const tag = computed(() => props.as || `h${props.level}`)

const headingClasses = computed(() => {
  const classes = ['r-heading']
  
  classes.push(`r-heading--level-${props.level}`)
  classes.push(`r-heading--color-${props.color}`)
  classes.push(`r-heading--align-${props.align}`)
  
  if (props.truncate) classes.push('r-heading--truncate')
  
  return classes
})
</script>

<template>
  <component :is="tag" :class="headingClasses">
    <slot />
  </component>
</template>

<style scoped>
/* Base */
.r-heading {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

/* Levels */
.r-heading--level-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
}

.r-heading--level-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}

.r-heading--level-3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.r-heading--level-4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
}

.r-heading--level-5 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.r-heading--level-6 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

/* Colors */
.r-heading--color-primary {
  color: var(--text-primary);
}

.r-heading--color-secondary {
  color: var(--text-secondary);
}

.r-heading--color-tertiary {
  color: var(--text-tertiary);
}

.r-heading--color-inverse {
  color: var(--text-inverse);
}

.r-heading--color-success {
  color: var(--color-success);
}

.r-heading--color-warning {
  color: var(--color-warning);
}

.r-heading--color-error {
  color: var(--color-error);
}

.r-heading--color-info {
  color: var(--color-info);
}

/* Alignment */
.r-heading--align-left {
  text-align: left;
}

.r-heading--align-center {
  text-align: center;
}

.r-heading--align-right {
  text-align: right;
}

.r-heading--align-justify {
  text-align: justify;
}

/* Truncate */
.r-heading--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
