<script setup>
import { computed } from 'vue'
import RPagination from '@/components/molecules/navigation/RPagination.vue'
import RSelect from '@/components/atoms/inputs/RSelect.vue'
import RText from '@/components/atoms/typography/RText.vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, default: 0 },
  itemsPerPage: { type: Number, default: 10 }
})

const emit = defineEmits(['update:page', 'update:limit'])

const limitOptions = [
  { label: '10 por pág', value: 10 },
  { label: '25 por pág', value: 25 },
  { label: '50 por pág', value: 50 }
]

const startItem = computed(() => ((props.currentPage - 1) * props.itemsPerPage) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-4 text-sm text-text-secondary order-2 sm:order-1">
      <RText size="sm">
        Mostrando {{ startItem }} - {{ endItem }} de {{ totalItems }}
      </RText>

      <div class="w-32 hidden sm:block">
        <RSelect
            :model-value="itemsPerPage"
            :options="limitOptions"
            size="sm"
            @update:model-value="$emit('update:limit', parseInt($event))"
        />
      </div>
    </div>

    <div class="order-1 sm:order-2">
      <RPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:page="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>