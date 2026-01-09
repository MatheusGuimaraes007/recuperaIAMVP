<script setup>
import RDataTable from './RDataTable.vue'
import RStatusBadge from '@components/molecules/data-display/RStatusBadge.vue'
import RButton from '@components/atoms/buttons/RButton.vue'
import RText from '@components/atoms/typography/RText.vue'
import RAvatar from '@components/atoms/feedback/RAvatar.vue'

defineProps({
  agents: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'delete', 'toggle-status'])

const columns = [
  { key: 'name', label: 'Agente' },
  { key: 'role', label: 'Função' },
  { key: 'model', label: 'Modelo IA' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', align: 'right' }
]
</script>

<template>
  <RDataTable :columns="columns" :data="agents" :loading="loading">
    <template #cell-name="{ item }">
      <div class="flex items-center gap-3">
        <RAvatar :name="item.name" size="sm" class="bg-primary-100 text-primary" />
        <div>
          <RText weight="medium">{{ item.name }}</RText>
          <RText size="xs" color="secondary">ID: {{ item.id.slice(0,8) }}</RText>
        </div>
      </div>
    </template>

    <template #cell-status="{ item }">
      <RStatusBadge
        :status="item.active ? 'Ativo' : 'Inativo'"
        :variant="item.active ? 'success' : 'neutral'"
        size="sm"
        class="cursor-pointer"
        @click.stop="$emit('toggle-status', item)"
      />
    </template>

    <template #cell-actions="{ item }">
      <div class="flex justify-end gap-2">
        <RButton variant="ghost" size="sm" icon-left="edit-2" @click.stop="$emit('edit', item)" />
        <RButton variant="ghost" size="sm" icon-left="trash" color="danger" @click.stop="$emit('delete', item)" />
      </div>
    </template>

    <template v-if="$slots.pagination" #pagination>
      <slot name="pagination" />
    </template>
  </RDataTable>
</template>