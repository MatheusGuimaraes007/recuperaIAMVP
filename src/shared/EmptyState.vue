<script setup>
import Button from './Button.vue';
import Card from './Card.vue';

defineProps({
  title: {
    type: String,
    default: 'Nenhum resultado encontrado'
  },
  message: {
    type: String,
    default: 'Tente ajustar os filtros ou a busca'
  },
  icon: {
    type: String,
    default: 'box',
    validator: (value) => ['box', 'search', 'folder'].includes(value)
  },
  actionLabel: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['action']);
</script>

<template>
  <Card padding="lg">
    <div class="text-center">
      <svg
          class="w-16 h-16 mx-auto mb-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
      >
        <path
            v-if="icon === 'box'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />

        <path
            v-else-if="icon === 'search'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />

        <path
            v-else-if="icon === 'folder'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>

      <h3 class="text-xl font-semibold text-white mb-2">
        {{ title }}
      </h3>

      <p class="text-gray-400 mb-4">
        {{ message }}
      </p>

      <Button
          v-if="actionLabel"
          variant="primary"
          @click="$emit('action')"
      >
        {{ actionLabel }}
      </Button>
    </div>
  </Card>
</template>