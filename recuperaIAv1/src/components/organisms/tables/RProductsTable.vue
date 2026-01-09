<script setup>
import RDataTable from './RDataTable.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RStatusBadge from '@/components/molecules/data-display/RStatusBadge.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  products: { type: Array, default: () => [] },
  loading: Boolean
})

const emit = defineEmits(['edit', 'delete'])

const columns = [
  { key: 'name', label: 'Produto' },
  { key: 'price', label: 'Preço', align: 'right' },
  { key: 'sales', label: 'Vendas', align: 'center' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', align: 'right' }
]
</script>

<template>
  <RDataTable :columns="columns" :data="products" :loading="loading">
    <template #cell-name="{ item }">
      <div>
        <RText weight="medium">{{ item.name }}</RText>
        <RText size="xs" color="secondary" v-if="item.sku">SKU: {{ item.sku }}</RText>
      </div>
    </template>

    <template #cell-price="{ item }">
      <RText>{{ formatCurrency(item.price) }}</RText>
    </template>

    <template #cell-status="{ item }">
      <RStatusBadge
          :status="item.active ? 'Ativo' : 'Inativo'"
          :variant="item.active ? 'success' : 'neutral'"
          size="sm"
          label=""/>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex justify-end gap-2">
        <RButton variant="ghost" size="sm" icon-left="edit-2" @click.stop="$emit('edit', item)" />
        <RButton variant="ghost" size="sm" icon-left="trash" color="danger" @click.stop="$emit('delete', item)" />
      </div>
    </template>
  </RDataTable>
</template>