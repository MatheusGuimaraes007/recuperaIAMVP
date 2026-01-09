<script setup>
import RText from '@/components/atoms/typography/RText.vue'

defineProps({
  tabs: { type: Array, required: true }, // [{ label: 'Geral', value: 'general', icon: 'settings' }]
  modelValue: { type: String, required: true }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="border-b border-border-light mb-6 flex gap-6 overflow-x-auto">
    <button
        v-for="tab in tabs"
        :key="tab.value"
        class="pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
        :class="modelValue === tab.value
        ? 'border-primary text-primary'
        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-medium'"
        @click="$emit('update:modelValue', tab.value)"
    >
      <i v-if="tab.icon" :class="`i-lucide-${tab.icon}`"></i> <span class="text-sm font-medium">{{ tab.label }}</span>
    </button>
  </div>
</template>