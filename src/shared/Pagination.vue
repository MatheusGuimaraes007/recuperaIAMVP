<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { PAGINATION } from "../utils/constants.js";

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
      class="pt-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <div class="text-sm text-gray-400">
      Mostrando <span class="text-white font-medium">{{ showingFrom }}</span> - <span class="text-white font-medium">{{ showingTo }}</span> de <span class="text-white font-medium">{{ totalCount }}</span> clientes
    </div>

    <div class="flex gap-1">
      <button
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:text-gray-400"
          title="Página anterior"
      >
        <ChevronLeft :size="20" />
      </button>

      <button
          v-for="(page, index) in paginationRange"
          :key="index"
          @click="handlePageChange(page)"
          :disabled="page === '...'"
          class="min-w-[40px] px-3 py-2 rounded-lg border transition-all"
          :class="page === currentPage
          ? 'border-primary text-primary bg-primary/10'
          : page === '...'
          ? 'border-transparent text-gray-600 cursor-default'
          : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'"
      >
        {{ page }}
      </button>

      <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:text-gray-400"
          title="Próxima página"
      >
        <ChevronRight :size="20" />
      </button>
    </div>
  </div>
</template>