<script setup>
import { computed } from 'vue'
import RHeading from '../typography/RHeading.vue' // CORRIGIDO: era @components
import RDivider from './RDivider.vue'             // CORRIGIDO: era @components
import RSkeleton from '../feedback/RSkeleton.vue' // NOVO: para loading

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: true
  },
  loading: { // NOVO
    type: Boolean,
    default: false
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
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}

// NOVO: verificar se tem conteúdo real
const hasHeader = computed(() => {
  return props.title || props.subtitle || !!props.$slots.header
})

const hasBody = computed(() => {
  return !!props.$slots.default
})
</script>

<template>
  <div
    :class="cardClasses"
    @click="handleClick"
  >
    <!-- NOVO: Loading State -->
    <template v-if="loading">
      <RSkeleton variant="rectangular" height="200px" />
    </template>

    <template v-else>
      <!-- Header -->
      <div v-if="hasHeader" class="r-card__header">
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

      <!-- CORRIGIDO: só mostrar divider se há header E body -->
      <RDivider v-if="hasHeader && (hasBody || $slots.footer)" />

      <!-- Body -->
      <div v-if="hasBody" class="r-card__body">
        <slot />
      </div>

      <!-- Footer -->
      <template v-if="$slots.footer">
        <RDivider />
        <div class="r-card__footer">
          <slot name="footer" />
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.r-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--duration-normal) var(--easing-out),
              transform var(--duration-normal) var(--easing-out);
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