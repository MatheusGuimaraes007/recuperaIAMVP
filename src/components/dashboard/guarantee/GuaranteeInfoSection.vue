<script setup>
import { formatCurrency } from '../../../utils/formatters';
import Button from '../../../shared/Button.vue';
import { DollarSign, AlertCircle } from 'lucide-vue-next';

defineProps({
  guarantee: { type: Object, required: true },
  hasActiveGuarantee: { type: Boolean, required: true }
});
</script>

<template>
  <div class="p-6">
    <div class="grid gap-4 mb-5">
      <div class="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl hover:bg-primary/10 transition-colors">
        <div class="w-11 h-11 bg-primary/15 rounded-lg flex items-center justify-center flex-shrink-0">
          <DollarSign :size="22" class="text-primary" />
        </div>
        <div class="flex-1">
          <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Investimento (90 dias)</span>
          <span class="text-lg font-bold text-white leading-tight">{{ formatCurrency(guarantee.investment_90days) }}</span>
        </div>
      </div>
    </div>

    <Button
        v-if="!hasActiveGuarantee"
        variant="primary"
        class="w-full justify-center"
        size="lg"
    >
      <AlertCircle :size="20" class="mr-2" />
      Solicitar Reembolso
    </Button>
  </div>
</template>