<script setup>
import { computed } from 'vue'
import RDataTable from './RDataTable.vue'
import RStatusBadge from '@components/molecules/data-display/RStatusBadge.vue'
import RUserCard from '@components/molecules/cards/RUserCard.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'
import { formatPhone, formatDate, formatCurrency } from '@utils/formatters'

const props = defineProps({
  clients: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['client-click'])

const columns = [
  { key: 'client', label: 'Cliente' },
  { key: 'contact', label: 'Contato' },
  { key: 'status', label: 'Status' },
  { key: 'metrics', label: 'Métricas' },
  { key: 'created_at', label: 'Cadastro' },
  { key: 'actions', label: 'Ação', align: 'center' }
]

const getStatusType = (status) => {
  const map = { active: 'success', trial: 'warning', suspended: 'error', canceled: 'neutral' }
  return map[status] || 'neutral'
}

const getStatusLabel = (status) => {
  const map = { active: 'Ativo', trial: 'Trial', suspended: 'Suspenso', canceled: 'Cancelado' }
  return map[status] || status
}
</script>

<template>
  <RDataTable
    :columns="columns"
    :data="clients"
    :loading="loading"
    @row-click="$emit('client-click', $event)"
  >
    <template #cell-client="{ item }">
      <RUserCard
        :name="item.name || 'Sem nome'"
        :avatar-url="item.avatar_url"
        :sub="`ID: ${item.id.toString().slice(0, 8)}`"
        size="sm"
      />
    </template>

    <template #cell-contact="{ item }">
      <div class="flex flex-col">
        <RText size="sm">{{ item.email || '-' }}</RText>
        <RText size="xs" color="secondary">{{ formatPhone(item.phone) }}</RText>
      </div>
    </template>

    <template #cell-status="{ item }">
      <RStatusBadge
        :status="getStatusLabel(item.status)"
        :variant="getStatusType(item.status)"
        size="sm"
        label=""/>
    </template>

    <template #cell-metrics="{ item }">
      <div class="flex flex-col gap-1">
        <RText size="xs" color="secondary">
          Opps: <span class="text-white font-medium">{{ item.metrics?.totalOpportunities || 0 }}</span>
        </RText>
        <RText size="xs" color="secondary">
          Rec: <span style="color: var(--color-success)">{{ formatCurrency(item.metrics?.totalRecovered || 0) }}</span>
        </RText>
      </div>
    </template>

    <template #cell-created_at="{ value }">
      <RText size="sm" color="secondary">{{ formatDate(value) }}</RText>
    </template>

    <template #cell-actions="{ item }">
      <RButton
        variant="ghost"
        size="sm"
        @click.stop="$emit('client-click', item)"
      >
        Ver Detalhes
      </RButton>
    </template>

    <template v-if="$slots.pagination" #pagination>
      <slot name="pagination" />
    </template>
  </RDataTable>
</template>