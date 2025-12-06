<script setup>
import SkeletonBase from './SkeletonBase.vue';
</script>

<template>
  <div class="rounded-xl border border-gray-700 p-6 animate-pulse">
    <div class="flex items-center gap-4">
      <SkeletonBase width="w-14" height="h-14" rounded="rounded-xl" />
      <div class="flex-1 space-y-2">
        <SkeletonBase width="w-24" height="h-4" />
        <SkeletonBase width="w-32" height="h-8" />
      </div>
    </div>
  </div>
</template>