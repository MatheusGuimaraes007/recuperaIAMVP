<script setup>
import { ref } from 'vue';
import { STATUS_OPTIONS } from '../../utils/constants';
import Card from "../../shared/Card.vue";
import Input from "../../shared/Input.vue";
import Button from "../../shared/Button.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['search', 'clear', 'status-change']);

const searchTerm = ref('');
const selectedStatus = ref('all');

const handleSearch = () => {
  emit('search', {
    search: searchTerm.value,
    status: selectedStatus.value !== 'all' ? selectedStatus.value : null
  });
};

const handleStatusFilter = (status) => {
  selectedStatus.value = status;
  emit('status-change', status);
};

const handleClear = () => {
  searchTerm.value = '';
  selectedStatus.value = 'all';
  emit('clear');
};
</script>

<template>
  <Card padding="md">
    <!-- Search Bar -->
    <div class="mb-4">
      <Input
          v-model="searchTerm"
          placeholder="Buscar por nome ou telefone..."
          icon="search"
          @keyup.enter="handleSearch"
      />
    </div>

    <!-- Status Filters -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
          v-for="status in STATUS_OPTIONS"
          :key="status.value"
          @click="handleStatusFilter(status.value)"
          class="px-4 py-2 rounded-lg border transition-all text-sm font-medium"
          :class="selectedStatus === status.value
          ? 'border-[#7cba10] text-[#7cba10] bg-[#7cba10]/10'
          : 'border-gray-700 text-gray-400 hover:border-gray-600'"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <Button
          variant="primary"
          :loading="loading"
          @click="handleSearch"
      >
        <span v-if="!loading">Buscar</span>
        <span v-else>Buscando...</span>
      </Button>

      <Button
          variant="secondary"
          @click="handleClear"
      >
        Limpar filtros
      </Button>
    </div>
  </Card>
</template>