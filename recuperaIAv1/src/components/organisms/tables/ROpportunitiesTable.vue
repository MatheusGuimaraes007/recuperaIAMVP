<script setup>
import RDataTable from './RDataTable.vue'
import RStatusBadge from '@components/molecules/data-display/RStatusBadge.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'
import { formatDate, formatPhone } from '@utils/formatters'

defineProps({
  opportunities: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['view-details'])

const columns = [
  { key: 'contact', label: 'Lead / Contato' },
  { key: 'product', label: 'Produto' },
  { key: 'method', label: 'Método' },
  { key: 'status', label: 'Status' },
  { key: 'messages', label: 'Msgs', align: 'center' },
  { key: 'date', label: 'Data', align: 'right' },
  { key: 'actions', label: 'Ação', align: 'center' }
]

const getStatusColor = (status) => {
  const map = {
    won: 'success',
    lost: 'error',
    open: 'info',
    contacted: 'warning'
  }
  return map[status] || 'neutral'
}
</script>

<template>
  <RDataTable
    :columns="columns"
    :data="opportunities"
    :loading="loading"
    @row-click="$emit('view-details', $event)"
  >
    <template #cell-contact="{ item }">
      <div>
        <RText weight="medium">{{ item.contact?.name || 'Sem nome' }}</RText>
        <RText size="xs" color="secondary">{{ formatPhone(item.contact?.phone) }}</RText>
      </div>
    </template>

    <template #cell-product="{ item }">
      <RText size="sm">{{ item.product?.name || '-' }}</RText>
    </template>

    <template #cell-method="{ item }">
      <RText size="sm">{{ item.opportunity_type || '-' }}</RText>
    </template>

    <template #cell-status="{ item }">
      <RStatusBadge
        :status="item.status"
        :variant="getStatusColor(item.status)"
        size="sm"
        label=""/>
    </template>

    <template #cell-messages="{ item }">
      <RText size="sm" weight="medium">{{ item.message_count || 0 }}</RText>
    </template>

    <template #cell-date="{ item }">
      <RText size="sm" color="secondary">{{ formatDate(item.created_at) }}</RText>
    </template>

    <template #cell-actions="{ item }">
      <RButton
        variant="ghost"
        size="sm"
        @click.stop="$emit('view-details', item)"
      >
        Detalhes
      </RButton>
    </template>

    <template v-if="$slots.pagination" #pagination>
      <slot name="pagination" />
    </template>
  </RDataTable>
</template>