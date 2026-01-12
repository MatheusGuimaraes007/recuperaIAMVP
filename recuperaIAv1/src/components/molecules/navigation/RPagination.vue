<script setup>
/**
 * RPagination - Controle de Paginação
 *
 * Componente molecule para navegação entre páginas com
 * controles inteligentes e informações de itens.
 *
 * @example
 * <RPagination
 *   :currentPage="1"
 *   :totalPages="10"
 *   :totalItems="100"
 *   :itemsPerPage="10"
 *   @update:page="handlePageChange"
 * />
 */

import { computed } from 'vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RText from '@components/atoms/typography/RText.vue'
import RButton from '@components/atoms/buttons/RButton.vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, default: null },
  itemsPerPage: { type: Number, default: 10 },
  maxVisible: { type: Number, default: 7 },
  showFirstLast: { type: Boolean, default: true },
  showInfo: { type: Boolean, default: true },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'simple', 'minimal'].includes(v)
  }
})

const emit = defineEmits(['update:page', 'change'])

const isFirst = computed(() => props.currentPage === 1)
const isLast = computed(() => props.currentPage === props.totalPages)

const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(props.maxVisible / 2)
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(props.totalPages, start + props.maxVisible - 1)

  if (end - start < props.maxVisible - 1) {
    start = Math.max(1, end - props.maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const showStartEllipsis = computed(() => visiblePages.value[0] > 1)
const showEndEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1] < props.totalPages)

const itemRange = computed(() => {
  if (!props.totalItems) return null
  const start = (props.currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  return { start, end }
})

const setPage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
    emit('change', page)
  }
}
</script>

<template>
  <nav :class="['r-pagination', `r-pagination--${variant}`, `r-pagination--${size}`]" aria-label="Paginação">
    <div v-if="showInfo && itemRange" class="r-pagination__info">
      <RText size="sm" color="secondary">
        Exibindo {{ itemRange.start }}-{{ itemRange.end }} de {{ totalItems }}
      </RText>
    </div>

    <div class="r-pagination__controls">
      <RIconButton
        v-if="showFirstLast && variant !== 'minimal'"
        variant="ghost"
        icon="chevrons-left"
        :size="size"
        :disabled="isFirst"
        aria-label="Primeira página"
        @click="setPage(1)"
      />

      <RIconButton
        variant="ghost"
        icon="chevron-left"
        :size="size"
        :disabled="isFirst"
        aria-label="Página anterior"
        @click="setPage(currentPage - 1)"
      />

      <template v-if="variant !== 'minimal'">
        <span v-if="showStartEllipsis" class="r-pagination__ellipsis">...</span>

        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[
            'r-pagination__number',
            `r-pagination__number--${size}`,
            { 'r-pagination__number--active': currentPage === page }
          ]"
          :aria-current="currentPage === page ? 'page' : undefined"
          @click="setPage(page)"
        >
          {{ page }}
        </button>

        <span v-if="showEndEllipsis" class="r-pagination__ellipsis">...</span>
      </template>

      <RText v-else size="sm" color="secondary" class="r-pagination__current">
        {{ currentPage }} / {{ totalPages }}
      </RText>

      <RIconButton
        variant="ghost"
        icon="chevron-right"
        :size="size"
        :disabled="isLast"
        aria-label="Próxima página"
        @click="setPage(currentPage + 1)"
      />

      <RIconButton
        v-if="showFirstLast && variant !== 'minimal'"
        variant="ghost"
        icon="chevrons-right"
        :size="size"
        :disabled="isLast"
        aria-label="Última página"
        @click="setPage(totalPages)"
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
  gap: var(--spacing-4);
}

.r-pagination--simple,
.r-pagination--minimal {
  justify-content: center;
}

.r-pagination__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.r-pagination__number {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: none;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.r-pagination__number--sm {
  width: 28px;
  height: 28px;
  font-size: var(--font-size-xs);
}

.r-pagination__number--md {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-sm);
}

.r-pagination__number--lg {
  width: 40px;
  height: 40px;
  font-size: var(--font-size-base);
}

.r-pagination__number:hover:not(.r-pagination__number--active) {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-border-medium);
}

.r-pagination__number--active {
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
}

.r-pagination__ellipsis {
  color: var(--color-text-tertiary);
  padding: 0 var(--spacing-1);
  user-select: none;
}

.r-pagination__current {
  padding: 0 var(--spacing-2);
}

@media (max-width: 640px) {
  .r-pagination {
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .r-pagination__info {
    order: 2;
  }
}
</style>