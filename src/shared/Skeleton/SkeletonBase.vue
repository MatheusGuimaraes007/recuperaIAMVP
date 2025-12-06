<script setup>
defineProps({
  width: {
    type: String,
    default: 'w-full'
  },
  height: {
    type: String,
    default: 'h-4'
  },
  rounded: {
    type: String,
    default: 'rounded'
  },
  className: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div
      :class="[
      'bg-gray-700 animate-pulse',
      width,
      height,
      rounded,
      className
    ]"
  />
</template>