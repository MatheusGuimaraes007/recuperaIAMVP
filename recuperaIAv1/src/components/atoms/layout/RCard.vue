<script setup>
/**
 * RCard - Card Genérico
 * 
 * Container de conteúdo com header, body e footer
 */

import { computed } from 'vue'
import RHeading from '@components/atoms/typography/RHeading.vue'
import RDivider from '@components/atoms/layout/RDivider.vue'

const props = defineProps({
  /**
   * Título do card
   */
  title: {
    type: String,
    default: null
  },

  /**
   * Subtítulo
   */
  subtitle: {
    type: String,
    default: null
  },

  /**
   * Padding do card
   */
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  },

  /**
   * Se tem hover effect
   */
  hoverable: {
    type: Boolean,
    default: false
  },

  /**
   * Se é clicável
   */
  clickable: {
    type: Boolean,
    default: false
  },

  /**
   * Se tem borda
   */
  bordered: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  const classes = ['r-card']
  
  classes.push(`r-card--padding-${props.padding}`)
  
  if (props.hoverable) classes.push('r-card--hoverable')
  if (props.clickable) classes.push('r-card--clickable')
  if (props.bordered) classes.push('r-card--bordered')
  
  return classes
})

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<template>
  <div
    :class="cardClasses"
    @click="handleClick"
  >
    <!-- Header -->
    <div v-if="title || subtitle || $slots.header" class="r-card__header">
      <slot name="header">
        <div v-if="title || subtitle" class="r-card__header-content">
          <RHeading v-if="title" level="4" class="r-card__title">
            {{ title }}
          </RHeading>
          <p v-if="subtitle" class="r-card__subtitle">
            {{ subtitle }}
          </p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="r-card__actions">
        <slot name="actions" />
      </div>
    </div>

    <RDivider v-if="(title || subtitle || $slots.header) && ($slots.default || $slots.footer)" />

    <!-- Body -->
    <div v-if="$slots.default" class="r-card__body">
      <slot />
    </div>

    <!-- Footer -->
    <template v-if="$slots.footer">
      <RDivider />
      <div class="r-card__footer">
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.r-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
}

/* Padding variants */
.r-card--padding-none {
  padding: 0;
}

.r-card--padding-sm {
  padding: var(--spacing-4);
}

.r-card--padding-md {
  padding: var(--spacing-6);
}

.r-card--padding-lg {
  padding: var(--spacing-8);
}

/* Bordered */
.r-card--bordered {
  border: 1px solid var(--border-light);
}

/* Hoverable */
.r-card--hoverable:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Clickable */
.r-card--clickable {
  cursor: pointer;
}

.r-card--clickable:active {
  transform: scale(0.98);
}

/* Header */
.r-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.r-card__header-content {
  flex: 1;
}

.r-card__title {
  margin: 0;
}

.r-card__subtitle {
  margin: var(--spacing-1) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.r-card__actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Body */
.r-card__body {
  flex: 1;
}

/* Footer */
.r-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-2);
}
</style>
