<script setup>
import SkeletonBase from './SkeletonBase.vue';
</script>

<template>
  <div class="rounded-xl border border-gray-700 p-5 animate-pulse">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <SkeletonBase width="w-12" height="h-12" rounded="rounded-full" />
        <div class="space-y-2">
          <SkeletonBase width="w-32" height="h-5" />
          <SkeletonBase width="w-24" height="h-4" />
        </div>
      </div>
    </div>

    <!-- Content Areas -->
    <div class="space-y-3 mt-4">
      <SkeletonBase height="h-20" rounded="rounded-lg" />
      <SkeletonBase height="h-16" rounded="rounded-lg" />
      <SkeletonBase height="h-12" rounded="rounded-lg" />
    </div>
  </div>
</template>