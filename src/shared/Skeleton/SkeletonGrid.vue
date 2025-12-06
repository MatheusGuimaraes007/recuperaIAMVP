<script setup>
defineProps({
  cols: {
    type: String,
    default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  },
  items: {
    type: Number,
    default: 6
  }
});
</script>

<template>
  <div :class="['grid gap-4', cols]">
    <slot v-for="i in items" :key="i" :index="i">
      <div class="rounded-xl border border-gray-700 p-5 animate-pulse">
        <div class="space-y-3">
          <div class="h-20 bg-gray-700 rounded"></div>
          <div class="h-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    </slot>
  </div>
</template>