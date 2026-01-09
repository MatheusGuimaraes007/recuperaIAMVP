<script setup>
defineProps({
  sidebarWidth: { type: String, default: '1fr' } // '1/3', '300px', etc.
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <slot name="main" />
    </div>
    <div class="lg:col-span-1 space-y-6">
      <slot name="sidebar" />
    </div>
  </div>
</template>