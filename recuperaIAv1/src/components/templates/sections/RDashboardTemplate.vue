<script setup>
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'

defineProps({
  title: String,
  subtitle: String,
  breadcrumb: Array,
  loading: Boolean
})
</script>

<template>
  <div class="r-dashboard-template space-y-6">
    <RPageHeader :title="title" :subtitle="subtitle" :breadcrumb="breadcrumb">
      <template #actions>
        <slot name="header-actions" />
      </template>
    </RPageHeader>

    <div v-if="$slots.filters" class="bg-bg-primary p-4 rounded-lg border border-border-light shadow-sm">
      <slot name="filters" />
    </div>

    <div v-if="$slots.metrics" class="r-dashboard-template__metrics">
      <slot name="metrics" />
    </div>

    <div class="r-dashboard-template__content">
      <slot />
    </div>
  </div>
</template>