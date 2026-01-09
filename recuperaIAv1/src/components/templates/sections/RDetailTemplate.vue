<script setup>
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'
import RTabNavigation from '@/components/organisms/navigation/RTabNavigation.vue'

defineProps({
  title: String,
  breadcrumb: Array,
  tabs: Array,
  currentTab: String,
  loading: Boolean
})

defineEmits(['update:currentTab'])
</script>

<template>
  <div class="r-detail-template min-h-screen pb-12">
    <RPageHeader :title="title" :breadcrumb="breadcrumb">
      <template #actions>
        <slot name="actions" />
      </template>
    </RPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-4 xl:col-span-3 space-y-6">
        <slot name="sidebar" />
      </div>

      <div class="lg:col-span-8 xl:col-span-9">
        <div v-if="tabs" class="bg-bg-primary rounded-t-lg border-b border-border-light px-6 pt-4">
          <RTabNavigation
              :tabs="tabs"
              :model-value="currentTab"
              @update:model-value="$emit('update:currentTab', $event)"
              class="mb-0 border-none"
          />
        </div>

        <div class="bg-bg-primary rounded-b-lg border border-border-light p-6 min-h-[400px]">
          <slot name="content" />
        </div>
      </div>
    </div>
  </div>
</template>