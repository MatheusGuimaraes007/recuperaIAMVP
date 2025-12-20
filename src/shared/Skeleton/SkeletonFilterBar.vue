<script setup>
import SkeletonBase from './SkeletonBase.vue';

defineProps({
  buttonCount: {
    type: Number,
    default: 5
  }
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1 space-y-2">
        <SkeletonBase width="w-32" height="h-5" />
        <SkeletonBase width="w-48" height="h-4" />
      </div>
      <SkeletonBase width="w-24" height="h-8" rounded="rounded-lg" />
    </div>

    <!-- Buttons -->
    <div class="flex flex-wrap gap-3">
      <SkeletonBase
          v-for="i in buttonCount"
          :key="i"
          width="w-24"
          height="h-9"
          rounded="rounded-lg"
      />
    </div>
  </div>
</template>
