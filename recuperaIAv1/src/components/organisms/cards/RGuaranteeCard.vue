<script setup>
import RCard from '@/components/atoms/layout/RCard.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RProgress from '@/components/atoms/feedback/RProgress.vue'
import RIcon from '@/components/atoms/icons/RIcon.vue'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  currentAmount: { type: Number, default: 0 },
  targetAmount: { type: Number, default: 10000 },
  daysLeft: { type: Number, default: 15 },
  loading: Boolean
})

const emit = defineEmits(['view-details'])
</script>

<template>
  <RCard class="r-guarantee-card bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-2">
        <div class="p-2 bg-white/10 rounded-lg">
          <RIcon name="shield-check" class="text-green-400" />
        </div>
        <div>
          <RHeading level="6" class="text-white">Garantia de ROI</RHeading>
          <RText size="xs" class="text-gray-400">Progresso mensal</RText>
        </div>
      </div>
      <RButton variant="ghost" size="sm" class="text-white hover:bg-white/10" @click="$emit('view-details')">
        Ver Detalhes
      </RButton>
    </div>

    <div class="mb-4">
      <div class="flex justify-between items-end mb-2">
        <span class="text-3xl font-bold text-green-400">{{ formatCurrency(currentAmount) }}</span>
        <span class="text-sm text-gray-400 mb-1">Meta: {{ formatCurrency(targetAmount) }}</span>
      </div>
      <RProgress
          :value="(currentAmount / targetAmount) * 100"
          color="success"
          height="8px"
          class="bg-gray-700"
      />
    </div>

    <div class="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-3">
      <span class="flex items-center gap-1">
        <RIcon name="clock" size="12" />
        {{ daysLeft }} dias restantes
      </span>
      <span v-if="currentAmount >= targetAmount" class="text-green-400 font-medium flex items-center gap-1">
        <RIcon name="check" size="12" /> Garantia Atingida
      </span>
      <span v-else>Faltam {{ formatCurrency(targetAmount - currentAmount) }}</span>
    </div>
  </RCard>
</template>