<script setup>
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'
import RSearchBar from '@/components/molecules/forms/RSearchBar.vue'

defineProps({
  title: String,
  breadcrumb: Array,
  searchQuery: String
})

defineEmits(['search', 'create'])
</script>

<template>
  <div class="r-list-template space-y-6">
    <RPageHeader :title="title" :breadcrumb="breadcrumb">
      <template #actions>
        <slot name="actions" />
      </template>
    </RPageHeader>

    <div class="bg-bg-primary rounded-lg border border-border-light shadow-sm overflow-hidden">
      <div class="p-4 border-b border-border-light flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="w-full md:max-w-md">
          <RSearchBar
              :model-value="searchQuery"
              @update:model-value="$emit('search', $event)"
              placeholder="Buscar..."
          />
        </div>
        <div class="flex gap-2 w-full md:w-auto justify-end">
          <slot name="filters" />
        </div>
      </div>

      <div class="w-full">
        <slot name="table" />
      </div>

      <div v-if="$slots.pagination" class="p-4 border-t border-border-light bg-bg-secondary">
        <slot name="pagination" />
      </div>
    </div>
  </div>
</template>