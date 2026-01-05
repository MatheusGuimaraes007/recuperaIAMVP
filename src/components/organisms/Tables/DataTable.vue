<script setup>
import { computed } from 'vue'

import { ChevronUp, ChevronDown, Minus } from 'lucide-vue-next'
import Card from "../../atoms/Card/Card.vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },

  columns: {
    type: Array,
    required: true
  },

  loading: {
    type: Boolean,
    default: false
  },

  emptyMessage: {
    type: String,
    default: 'Nenhum item encontrado'
  },

  clickableRow: {
    type: Boolean,
    default: true
  },

  striped: {
    type: Boolean,
    default: false
  },

  hoverable: {
    type: Boolean,
    default: true
  },

  compact: {
    type: Boolean,
    default: false
  },

  sortBy: {
    type: String,
    default: null
  },

  sortDirection: {
    type: String,
    default: 'asc',
    validator: (v) => ['asc', 'desc'].includes(v)
  }
})

const emit = defineEmits(['row-click', 'sort-change'])

const isEmpty = computed(() => {
  return !props.loading && (!props.data || props.data.length === 0)
})

const paddingClass = computed(() => {
  return props.compact ? 'px-4 py-2' : 'px-6 py-4'
})


/**
 * Handle row click
 */
const handleRowClick = (row, index) => {
  if (props.clickableRow) {
    emit('row-click', row, index)
  }
}

/**
 * Handle sort
 */
const handleSort = (column) => {
  if (!column.sortable) return

  let newDirection = 'asc'
  if (props.sortBy === column.key) {
    newDirection = props.sortDirection === 'asc' ? 'desc' : 'asc'
  }

  emit('sort-change', column.key, newDirection)
}

/**
 * Get sort icon
 */
const getSortIcon = (column) => {
  if (!column.sortable) return null
  if (props.sortBy !== column.key) return Minus
  return props.sortDirection === 'asc' ? ChevronUp : ChevronDown
}

/**
 * Get alignment class
 */
const getAlignmentClass = (align) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  return alignments[align] || 'text-left'
}

/**
 * Get cell value
 */
const getCellValue = (row, column) => {
  const keys = column.key.split('.')
  let value = row

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      return null
    }
  }

  return value
}
</script>

<template>
  <Card padding="none" class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-background-base/50 to-background-card/50"></div>
        <tr class="border-b-2 border-primary/20">
          <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'relative font-bold text-gray-300 uppercase tracking-wider text-xs',
                paddingClass,
                getAlignmentClass(column.align),
                column.class,
                column.sortable ? 'cursor-pointer hover:text-primary transition-colors select-none' : ''
              ]"
              :style="column.width ? { width: column.width } : {}"
              @click="handleSort(column)"
          >
            <div class="flex items-center gap-2" :class="getAlignmentClass(column.align)">
              <component
                  v-if="column.icon"
                  :is="column.icon"
                  :size="16"
              />
              <span>{{ column.label }}</span>
              <component
                  v-if="column.sortable"
                  :is="getSortIcon(column)"
                  :size="14"
                  class="transition-colors"
                  :class="sortBy === column.key ? 'text-primary' : 'text-gray-500'"
              />
            </div>
          </th>
        </tr>
        </thead>

        <tbody v-if="!loading && !isEmpty" class="divide-y divide-border">
        <tr
            v-for="(row, index) in data"
            :key="row.id || index"
            :class="[
              'transition-colors',
              hoverable ? 'hover:bg-primary/5' : '',
              clickableRow ? 'cursor-pointer' : '',
              striped && index % 2 === 1 ? 'bg-background-base/50' : ''
            ]"
            @click="handleRowClick(row, index)"
        >
          <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                paddingClass,
                getAlignmentClass(column.align),
                column.cellClass
              ]"
          >
            <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getCellValue(row, column)"
                :index="index"
            >
              <span class="text-sm text-gray-300">
                  {{ getCellValue(row, column) ?? '-' }}
                </span>
            </slot>
          </td>
        </tr>
        </tbody>

        <tbody v-if="loading">
        <tr>
          <td :colspan="columns.length" class="text-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span class="text-sm text-gray-400">Carregando dados...</span>
            </div>
          </td>
        </tr>
        </tbody>

        <tbody v-if="isEmpty">
        <tr>
          <td :colspan="columns.length" class="text-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="w-16 h-16 rounded-full bg-background-base flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-400">{{ emptyMessage }}</p>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div
        v-if="$slots.footer"
        class="border-t border-border bg-background-base/20 p-4"
    >
      <slot name="footer" />
    </div>
  </Card>
</template>
