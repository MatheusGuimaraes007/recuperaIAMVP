<script setup>
import RCard from '@/components/atoms/layout/RCard.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RStatusBadge from '@/components/molecules/data-display/RStatusBadge.vue'
import RAvatar from '@/components/atoms/feedback/RAvatar.vue'
import RIcon from '@/components/atoms/icons/RIcon.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

const props = defineProps({
  opportunity: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <RCard
      class="h-full flex flex-col transition-all hover:-translate-y-1"
      padding="sm"
      hoverable
      clickable
      bordered
      @click="$emit('click', opportunity)"
  >
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center gap-2 overflow-hidden">
        <RAvatar
            :name="opportunity.contact?.name"
            size="sm"
            class="bg-gradient-to-br from-primary to-primary-dark text-white shrink-0"
        />
        <div class="min-w-0">
          <RHeading level="6" truncate class="text-sm">{{ opportunity.contact?.name || 'Lead Desconhecido' }}</RHeading>
          <RText size="xs" color="secondary" truncate>{{ opportunity.product?.name || 'Produto Geral' }}</RText>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <RText weight="bold" size="lg" class="text-white">
        {{ opportunity.value ? formatCurrency(opportunity.value) : 'R$ -' }}
      </RText>
    </div>

    <div class="mt-auto flex items-center justify-between pt-3 border-t border-border-light">
      <RStatusBadge
          :status="opportunity.status"
          size="xs"
          variant="soft"
      />

      <div class="flex items-center gap-3 text-text-tertiary">
        <div class="flex items-center gap-1" title="Mensagens trocadas">
          <RIcon name="message-square" size="14" />
          <span class="text-xs font-medium">{{ opportunity.message_count || 0 }}</span>
        </div>

        <div class="flex items-center gap-1" title="Data de criação">
          <RIcon name="calendar" size="14" />
          <span class="text-xs">{{ formatDate(opportunity.created_at, 'DD/MM') }}</span>
        </div>
      </div>
    </div>
  </RCard>
</template>