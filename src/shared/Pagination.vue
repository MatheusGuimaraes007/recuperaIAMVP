<script setup>
import { computed } from 'vue';
import {PAGINATION} from "../utils/constants.js";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: PAGINATION.ITEMS_PER_PAGE
  }
});

const emit = defineEmits(['page-change']);

const paginationRange = computed(() => {
  const range = [];
  const delta = PAGINATION.PAGE_RANGE;
  const left = props.currentPage - delta;
  const right = props.currentPage + delta;

  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || (i >= left && i <= right)) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
});

const showingFrom = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const showingTo = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalCount);
});

const handlePageChange = (page) => {
  if (page !== '...' && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};
</script>

<template>
  <div
      v-if="totalPages > 1"
      class="px-6 py-4 border-t border-gray-700 flex items-center justify-between"
  >
    <div class="text-sm text-gray-400">
      Mostrando {{ showingFrom }} - {{ showingTo }} de {{ totalCount }} oportunidades
    </div>

    <div class="flex gap-1">
      <button
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
          v-for="(page, index) in paginationRange"
          :key="index"
          @click="handlePageChange(page)"
          :disabled="page === '...'"
          class="px-4 py-2 rounded-lg border transition-all"
          :class="page === currentPage
          ? 'border-[#7cba10] text-[#7cba10] bg-[#7cba10]/10'
          : page === '...'
          ? 'border-transparent text-gray-600 cursor-default'
          : 'border-gray-700 text-gray-400 hover:border-gray-600'"
      >
        {{ page }}
      </button>

      <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>