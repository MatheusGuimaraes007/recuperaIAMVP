<script setup>
import { useRouter } from 'vue-router';
import Card from "../../shared/Card.vue";

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: false
  },
  backRoute: {
    type: String,
    default: '/dashboard'
  }
});

const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8"
       style="background-color: var(--color-background3)">
    <div class="w-full max-w-md">

      <div class="flex items-center justify-between mb-8">
        <button
            v-if="showBackButton"
            @click="router.push(backRoute)"
            class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div v-else class="w-6"></div>

        <h1 class="text-2xl font-bold">
          <span class="text-white">recupera</span><span style="color: var(--color-text1)">.ia</span>
        </h1>

        <div class="w-6"></div>
      </div>

      <Card padding="lg">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">{{ title }}</h2>
          <p v-if="subtitle" class="text-gray-400 text-sm">{{ subtitle }}</p>
        </div>

        <slot></slot>
      </Card>

      <div v-if="$slots.footer" class="mt-6">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>