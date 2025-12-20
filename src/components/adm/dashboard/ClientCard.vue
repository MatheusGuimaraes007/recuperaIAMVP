<script setup>
import { Users, Clock, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-vue-next';

defineProps({
  client: {
    type: Object,
    required: true
  },
  getDaysRemaining: {
    type: Function,
    required: true
  },
  getGuaranteeStatus: {
    type: Function,
    required: true
  },
  getProgressColor: {
    type: Function,
    required: true
  },
  formatPercent: {
    type: Function,
    required: true
  },
  clientStatusConfig: {
    type: Function,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <div
      class="rounded-lg border p-5 transition-colors"
      :class="parseFloat(client.metrics?.conversionRate || 0) < 12
      ? 'border-red-500/40 bg-red-500/5 hover:border-red-500/60'
      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'"
  >

    <!-- Header do Cliente -->
    <div class="flex items-start gap-3 mb-5 pb-4 border-b border-gray-700/50">
      <div class="h-11 w-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
        <Users :size="20" class="text-primary" />
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-white text-base mb-2 truncate">
          {{ client.name }}
        </h3>
        <div class="flex items-center gap-2 flex-wrap">
          <span
              class="text-xs px-2.5 py-1 rounded-md border font-medium"
              :style="{
                color: clientStatusConfig(client.status).color,
                backgroundColor: clientStatusConfig(client.status).bgColor,
                borderColor: clientStatusConfig(client.status).color + '40'
              }"
          >
            {{ clientStatusConfig(client.status).icon }} {{ clientStatusConfig(client.status).label }}
          </span>
          <span class="text-xs text-gray-400 flex items-center gap-1">
            <Clock :size="12" />
            {{ client.active_months || 0 }} meses
          </span>
        </div>
      </div>
    </div>

    <!-- Garantia Ativa -->
    <div v-if="client.active_guarantee" class="space-y-4 mb-5">

      <!-- Status da Garantia -->
      <div class="flex items-center justify-between">
        <span
            class="text-sm font-medium flex items-center gap-1.5"
            :style="{ color: getGuaranteeStatus(client.active_guarantee).color }"
        >
          {{ getGuaranteeStatus(client.active_guarantee).icon }}
          {{ getGuaranteeStatus(client.active_guarantee).label }}
        </span>
        <div v-if="getDaysRemaining(client.active_guarantee) !== null" class="flex items-center gap-1 text-xs text-gray-400">
          <Clock :size="12" />
          {{ getDaysRemaining(client.active_guarantee) }} dias
        </div>
      </div>

      <!-- Métricas Leads e Vendas -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <div class="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <Users :size="12" />
            Leads
          </div>
          <div class="font-semibold text-white text-lg mb-0.5">
            {{ client.active_guarantee.total_opportunities || 0 }}
          </div>
          <div class="text-xs text-gray-400">
            {{ formatCurrency(client.active_guarantee.total_value || 0) }}
          </div>
        </div>

        <div class="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <div class="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <DollarSign :size="12" />
            Vendas
          </div>
          <div class="font-semibold text-white text-lg mb-0.5">
            {{ client.active_guarantee.won_opportunities || 0 }}
          </div>
          <div class="text-xs text-green-400">
            {{ formatCurrency(client.active_guarantee.converted_value || 0) }}
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400 flex items-center gap-1">
            <Target :size="12" />
            Meta: {{ formatCurrency(client.active_guarantee.goal_amount || 0) }}
          </span>
          <span class="font-semibold text-white">
            {{ formatPercent(client.active_guarantee.progress_percentage || 0) }}
          </span>
        </div>
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
              class="h-full rounded-full transition-all duration-300"
              :style="{
                width: `${Math.min(parseFloat(client.active_guarantee.progress_percentage || 0), 100)}%`,
                backgroundColor: getProgressColor(client.active_guarantee)
              }"
          />
        </div>
        <div class="text-xs text-gray-500">
          Gerado: {{ formatCurrency(client.active_guarantee.current_recovered_amount || 0) }}
        </div>
      </div>
    </div>

    <!-- Métricas Gerais -->
    <div class="space-y-3 pt-4 border-t border-gray-700/50">

      <!-- Conversão e Investimento -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-800/30 p-3 rounded-lg">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs text-gray-400">Conversão</span>
            <TrendingUp
                v-if="parseFloat(client.metrics?.conversionRate || 0) >= 10"
                :size="14"
                class="text-green-400"
            />
            <TrendingDown
                v-else
                :size="14"
                class="text-red-400"
            />
          </div>
          <div class="font-semibold text-white text-lg">
            {{ formatPercent(client.metrics?.conversionRate || 0) }}
          </div>
        </div>

        <div class="bg-gray-800/30 p-3 rounded-lg">
          <div class="text-xs text-gray-400 mb-1.5">Investimento</div>
          <div class="font-semibold text-white text-lg">
            {{ formatCurrency(client.annual_investment || 0) }}
          </div>
        </div>
      </div>

      <!-- Receita e ROI -->
      <div class="bg-primary/5 border border-primary/20 p-3 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-400 mb-1.5">Nossa Receita Total</div>
            <div class="font-semibold text-primary text-lg">
              {{ formatCurrency(client.metrics?.totalRecovered || 0) }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400 mb-1.5">ROI</div>
            <div
                class="font-semibold text-base"
                :class="parseFloat(client.metrics?.roi || 0) > 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ formatPercent(client.metrics?.roi || 0) }}
            </div>
          </div>
        </div>
      </div>

      <!-- CS Info -->
      <div class="text-xs text-gray-500 flex items-center gap-1.5">
        <Users :size="12" />
        CS: {{ client.cs_name || 'Não atribuído' }}
      </div>
    </div>
  </div>
</template>