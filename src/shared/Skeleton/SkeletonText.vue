<script setup>
import SkeletonBase from './SkeletonBase.vue';

defineProps({
  lines: {
    type: Number,
    default: 2
  },
  widths: {
    type: Array,
    default: () => ['w-48', 'w-64']
  },
  heights: {
    type: Array,
    default: () => ['h-6', 'h-4']
  }
});
</script>

<template>
  <div class="space-y-2">
    <SkeletonBase
        v-for="(_, index) in lines"
        :key="index"
        :width="widths[index] || widths[0]"
        :height="heights[index] || heights[0]"
    />
  </div>
</template>