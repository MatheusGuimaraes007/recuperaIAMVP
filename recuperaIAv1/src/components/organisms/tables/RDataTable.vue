<script setup>
import RText from '@components/atoms/typography/RText.vue'
import RSpinner from '@components/atoms/feedback/RSpinner.vue'
import REmptyState from '@components/molecules/feedback/REmptyState.vue'

const props = defineProps({
  columns: { type: Array, required: true }, // [{ key: 'name', label: 'Nome', align: 'left' }]
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  showSelection: { type: Boolean, default: false }
})

const emit = defineEmits(['row-click', 'selection-change'])
</script>

<template>
  <div class="r-data-table-wrapper">
    <div v-if="loading" class="r-data-table__loading">
      <RSpinner size="lg" />
      <RText color="secondary" class="mt-2">Carregando dados...</RText>
    </div>

    <div v-else-if="!data.length" class="r-data-table__empty">
      <REmptyState
        title="Nenhum registro encontrado"
        icon="search"
      />
    </div>

    <div v-else class="r-data-table-container">
      <table class="r-data-table">
        <thead>
          <tr>
            <th v-if="showSelection" class="r-data-table__th w-10">
              </th>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="['r-data-table__th', `text-${col.align || 'left'}`]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="r-data-table__tr"
            @click="$emit('row-click', row)"
          >
            <td v-if="showSelection" class="r-data-table__td">
              </td>
            <td
              v-for="col in columns"
              :key="col.key"
              :class="['r-data-table__td', `text-${col.align || 'left'}`]"
            >
              <slot :name="`cell-${col.key}`" :item="row" :value="row[col.key]">
                <RText size="sm">{{ row[col.key] || '-' }}</RText>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="$slots.pagination" class="r-data-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<style scoped>
.r-data-table-wrapper {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.r-data-table-container {
  overflow-x: auto;
}

.r-data-table {
  width: 100%;
  border-collapse: collapse;
}

.r-data-table__th {
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-light);
}

.r-data-table__tr {
  transition: background-color 0.2s;
  cursor: pointer;
}

.r-data-table__tr:hover {
  background-color: var(--bg-tertiary);
}

.r-data-table__tr:not(:last-child) .r-data-table__td {
  border-bottom: 1px solid var(--border-light);
}

.r-data-table__td {
  padding: var(--spacing-4) var(--spacing-6);
  vertical-align: middle;
}

.r-data-table__loading,
.r-data-table__empty {
  padding: var(--spacing-12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.r-data-table__footer {
  border-top: 1px solid var(--border-light);
  padding: var(--spacing-4);
  background-color: var(--bg-secondary);
}
</style>