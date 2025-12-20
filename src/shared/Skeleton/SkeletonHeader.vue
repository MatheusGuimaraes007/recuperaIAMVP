<script setup>
import SkeletonBase from './SkeletonBase.vue';
</script>

<template>
  <div class="flex items-center gap-3">
    <SkeletonBase width="w-12" height="h-12" rounded="rounded-xl" />
    <div class="flex-1 space-y-2">
      <SkeletonBase width="w-48" height="h-6" />
      <SkeletonBase width="w-64" height="h-4" />
    </div>
  </div>
</template>