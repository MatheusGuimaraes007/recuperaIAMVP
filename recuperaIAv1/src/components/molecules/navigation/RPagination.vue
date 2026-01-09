<script setup>
import { computed } from 'vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, default: null }
})

const emit = defineEmits(['update:page'])

const isFirst = computed(() => props.currentPage === 1)
const isLast = computed(() => props.currentPage === props.totalPages)

const visiblePages = computed(() => {
  const pages = []
  const delta = 2 // páginas visíveis ao redor da atual
  for (let i = Math.max(2, props.currentPage - delta); i <= Math.min(props.totalPages - 1, props.currentPage + delta); i++) {
    pages.push(i)
  }
  return pages
})

const setPage = (page) => emit('update:page', page)
</script>

<template>
  <nav class="r-pagination" aria-label="Paginação">
    <div v-if="totalItems" class="r-pagination__info">
      <RText size="sm" color="secondary">Total: {{ totalItems }}</RText>
    </div>

    <div class="r-pagination__controls">
      <RIconButton
        variant="ghost"
        icon="chevron-left"
        :disabled="isFirst"
        @click="setPage(currentPage - 1)"
      />

      <button
        :class="['r-pagination__number', { 'r-pagination__number--active': currentPage === 1 }]"
        @click="setPage(1)"
      >1</button>

      <span v-if="currentPage > 4" class="r-pagination__ellipsis">...</span>

      <button
        v-for="page in visiblePages"
        :key="page"
        :class="['r-pagination__number', { 'r-pagination__number--active': currentPage === page }]"
        @click="setPage(page)"
      >
        {{ page }}
      </button>

      <span v-if="currentPage < totalPages - 3" class="r-pagination__ellipsis">...</span>

      <button
        v-if="totalPages > 1"
        :class="['r-pagination__number', { 'r-pagination__number--active': currentPage === totalPages }]"
        @click="setPage(totalPages)"
      >
        {{ totalPages }}
      </button>

      <RIconButton
        variant="ghost"
        icon="chevron-right"
        :disabled="isLast"
        @click="setPage(currentPage + 1)"
      />
    </div>
  </nav>
</template>

<style scoped>
.r-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) 0;
}

.r-pagination__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.r-pagination__number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: none;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition-normal);
}

.r-pagination__number:hover:not(.r-pagination__number--active) {
  background-color: var(--bg-tertiary);
}

.r-pagination__number--active {
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
}

.r-pagination__ellipsis {
  color: var(--text-tertiary);
  padding: 0 var(--spacing-1);
}
</style>