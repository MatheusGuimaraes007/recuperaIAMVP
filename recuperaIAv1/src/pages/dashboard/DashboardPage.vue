<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <RHeading level="1">Dashboard</RHeading>

        <div class="flex items-center space-x-4">
          <RText>Olá, {{ user?.name || 'Usuário' }}!</RText>
          <RButton variant="ghost" size="sm" @click="handleLogout">
            Sair
          </RButton>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Loading State -->
        <RLoadingState v-if="isLoadingMetrics" message="Carregando métricas..." />

        <!-- Error State -->
        <RErrorState
            v-else-if="metricsError"
            :message="metricsError.message"
            @retry="refetchMetrics"
        />

        <!-- Métricas -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RStatCard
              label="Total de Oportunidades"
              :value="metrics?.total_opportunities || 0"
              icon="briefcase"
              color="blue"
               title=""/>

          <RStatCard
              label="Oportunidades Ativas"
              :value="metrics?.active_opportunities || 0"
              icon="clock"
              color="green"
              title=""/>

          <RStatCard
              label="Taxa de Conversão"
              :value="`${metrics?.conversion_rate || 0}%`"
              icon="trending-up"
              color="purple"
              title=""/>

          <RStatCard
              label="Valor Convertido"
              :value="formatCurrency(metrics?.converted_value || 0)"
              icon="dollar-sign"
              color="emerald"
              title=""/>
        </div>

        <!-- Info adicional -->
        <div class="mt-8 bg-white rounded-lg shadow p-6">
          <RHeading level="3" class="mb-4">Informações do Usuário</RHeading>

          <div class="space-y-2">
            <RKeyValue label="Email" :value="user?.email" />
            <RKeyValue label="Role" :value="user?.role" />
            <RKeyValue label="Status" :value="user?.status" />
            <RKeyValue
                label="É Admin?"
                :value="isAdmin ? 'Sim' : 'Não'"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/core/useAuth'
import { useDashboardMetrics } from '@/api/queries/dashboard'

// Components
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'
import RErrorState from '@/components/molecules/feedback/RErrorState.vue'
import RStatCard from '@/components/molecules/cards/RStatCard.vue'
import RKeyValue from '@/components/molecules/data-display/RKeyValue.vue'

// Auth
const { user, isAdmin, logout } = useAuth()

// Dashboard metrics
const {
  data: metricsData,
  isLoading: isLoadingMetrics,
  error: metricsError,
  refetch: refetchMetrics
} = useDashboardMetrics()

const metrics = computed(() => metricsData.value?.data || null)

// Methods
const handleLogout = async () => {
  await logout()
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>