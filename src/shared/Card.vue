<!-- Card.vue - Versão Melhorada (sem alterações na lógica) -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  border: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: false
  }
});

const paddingClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  return paddings[props.padding];
});

const cardClasses = computed(() => {
  const classes = ['rounded-xl', 'transition-all', 'duration-200'];

  if (props.border) {
    classes.push('border border-[#7cba10]/20');
  }

  if (props.hoverable) {
    classes.push('hover:border-[#7cba10]/40 hover:shadow-lg hover:shadow-[#7cba10]/5 cursor-pointer');
  }

  return classes.join(' ');
});
</script>

<template>
  <div
    :class="[cardClasses, paddingClasses]"
    style="background-color: var(--color-background4)"
  >
    <div v-if="title || subtitle || $slots.header" class="mb-4">
      <slot name="header">
        <h3 v-if="title" class="text-xl font-bold text-white mb-1">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-400">
          {{ subtitle }}
        </p>
      </slot>
    </div>

    <div>
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-700">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
