<script setup>
import RChip from '@components/molecules/data-display/RChip.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'

const props = defineProps({
  /**
   * Array de filtros: [{ id: 'status', label: 'Status: Ativo' }, ...]
   */
  filters: { type: Array, default: () => [] }
})

const emit = defineEmits(['remove', 'clear-all'])
</script>

<template>
  <div v-if="filters.length > 0" class="r-filter-chips">
    <div class="r-filter-chips__list">
      <RText size="sm" weight="medium" color="secondary">Filtros:</RText>

      <RChip
        v-for="filter in filters"
        :key="filter.id"
        :label="filter.label"
        removable
        size="sm"
        @remove="$emit('remove', filter.id)"
      />

      <RButton
        variant="ghost"
        size="sm"
        class="r-filter-chips__clear"
        @click="$emit('clear-all')"
      >
        Limpar tudo
      </RButton>
    </div>
  </div>
</template>

<style scoped>
.r-filter-chips { padding: var(--spacing-2) 0; }
.r-filter-chips__list { display: flex; align-items: center; flex-wrap: wrap; gap: var(--spacing-2); }
.r-filter-chips__clear { color: var(--color-error); font-size: var(--font-size-xs); }
.r-filter-chips__clear:hover { background-color: var(--color-error-50); }
</style>