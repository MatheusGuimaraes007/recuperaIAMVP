<script setup>
/**
 * RAvatar - Avatar de usuário
 */
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: '' },
  name: { type: String, default: null },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(v)
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (v) => ['circle', 'square'].includes(v)
  }
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>

<template>
  <div
    :class="[
      'r-avatar',
      `r-avatar--${size}`,
      `r-avatar--${shape}`
    ]"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt || name"
      class="r-avatar__image"
    >
    <span v-else class="r-avatar__initials">
      {{ initials }}
    </span>
  </div>
</template>

<style scoped>
.r-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
  flex-shrink: 0;
  user-select: none;
}

/* Sizes */
.r-avatar--xs {
  width: 24px;
  height: 24px;
  font-size: var(--font-size-xs);
}

.r-avatar--sm {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-sm);
}

.r-avatar--md {
  width: 40px;
  height: 40px;
  font-size: var(--font-size-base);
}

.r-avatar--lg {
  width: 48px;
  height: 48px;
  font-size: var(--font-size-lg);
}

.r-avatar--xl {
  width: 64px;
  height: 64px;
  font-size: var(--font-size-xl);
}

.r-avatar--2xl {
  width: 96px;
  height: 96px;
  font-size: var(--font-size-3xl);
}

/* Shapes */
.r-avatar--circle {
  border-radius: var(--radius-full);
}

.r-avatar--square {
  border-radius: var(--radius-md);
}

/* Elements */
.r-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.r-avatar__initials {
  text-transform: uppercase;
}
</style>