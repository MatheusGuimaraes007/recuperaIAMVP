<template>
  <RDefaultLayout>
    <div class="dashboard-page">
      <!-- Page Header -->
      <RPageHeader
        title="Dashboard"
        :subtitle="`Bem-vindo, ${displayName}!`"
      >
        <template #actions>
          <RButton
            v-if="isAdmin"
            variant="primary"
            size="sm"
            @click="router.push({ name: 'admin-dashboard' })"
          >
            Painel Admin
          </RButton>
        </template>
      </RPageHeader>

      <!-- Loading State -->
      <RLoadingState
        v-if="isLoadingMetrics"
        message="Carregando métricas..."
      />

      <!-- Error State -->
      <RErrorState
        v-else-if="metricsError"
        :message="metricsError.message"
        @retry="refetchMetrics"
      />

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Metrics Cards -->
        <section class="dashboard-metrics">
          <RMetricCard
            label="Oportunidades Totais"
            :value="metrics?.total_opportunities || 0"
            icon="briefcase"
            variant="blue"
            :loading="isLoadingMetrics"
          />

          <RMetricCard
            label="Oportunidades Ativas"
            :value="metrics?.active_opportunities || 0"
            icon="clock"
            variant="green"
            :loading="isLoadingMetrics"
          />

          <RMetricCard
            label="Taxa de Conversão"
            :value="`${metrics?.conversion_rate?.toFixed(2) || 0}%`"
            icon="trending-up"
            variant="purple"
            :loading="isLoadingMetrics"
          />

          <RMetricCard
            label="Valor Convertido"
            :value="formatCurrency(metrics?.converted_value || 0)"
            icon="dollar-sign"
            variant="orange"
            :loading="isLoadingMetrics"
          />
        </section>

        <!-- Charts Section -->
        <div class="dashboard-charts">
          <!-- Timeline Chart -->
          <RCard title="Evolução de Oportunidades" class="chart-card">
            <RLineChart
              v-if="!isLoadingTimeline && timelineData"
              :data="timelineChartData"
              height="300"
            />
            <RLoadingState
              v-else-if="isLoadingTimeline"
              message="Carregando gráfico..."
            />
          </RCard>

          <!-- Distribution by Type -->
          <RCard title="Distribuição por Tipo" class="chart-card">
            <div v-if="!isLoadingByType && opportunitiesByType">
              <div
                v-for="type in opportunitiesByType"
                :key="type.type"
                class="type-item"
              >
                <div class="type-info">
                  <RText weight="medium">{{ type.type }}</RText>
                  <RText size="sm" color="secondary">
                    {{ type.count }} oportunidades
                  </RText>
                </div>
                <RText weight="bold">
                  {{ formatCurrency(type.total_value) }}
                </RText>
              </div>
            </div>
            <RLoadingState
              v-else-if="isLoadingByType"
              message="Carregando dados..."
            />
          </RCard>
        </div>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <RCard title="Ações Rápidas">
            <div class="actions-grid">
              <RButton
                variant="secondary"
                full-width
                @click="router.push({ name: 'opportunities' })"
              >
                Ver Oportunidades
              </RButton>

              <RButton
                variant="secondary"
                full-width
                @click="router.push({ name: 'clients' })"
              >
                Gerenciar Clientes
              </RButton>

              <RButton
                variant="secondary"
                full-width
                @click="router.push({ name: 'agents' })"
              >
                Configurar Agentes
              </RButton>

              <RButton
                variant="secondary"
                full-width
                @click="router.push({ name: 'profile' })"
              >
                Meu Perfil
              </RButton>
            </div>
          </RCard>
        </section>
      </div>
    </div>
  </RDefaultLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/core/useAuth'
import {
  useDashboardMetrics,
  useMetricsTimeline,
  useOpportunitiesByType
} from '@/api/queries/dashboard'

// Layout
import RDefaultLayout from '@/components/templates/layouts/RDefaultLayout.vue'

// Atoms
import RButton from '@/components/atoms/buttons/RButton.vue'
import RText from '@/components/atoms/typography/RText.vue'

// Molecules
import RCard from '@/components/atoms/layout/RCard.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'
import RErrorState from '@/components/molecules/feedback/RErrorState.vue'
import RMetricCard from '@/components/molecules/cards/RMetricCard.vue'

// Organisms
import RPageHeader from '@/components/organisms/headers/RPageHeader.vue'
import RLineChart from '@/components/organisms/charts/RLineChart.vue'

// ============================================================================
// SETUP
// ============================================================================

const router = useRouter()
const { user, isAdmin, displayName } = useAuth()

// ============================================================================
// DATA FETCHING
// ============================================================================

// Dashboard metrics
const {
  data: metricsData,
  isLoading: isLoadingMetrics,
  error: metricsError,
  refetch: refetchMetrics
} = useDashboardMetrics(user.value?.id)

const metrics = computed(() => metricsData.value?.data || metricsData.value || null)

// Timeline data (last 7 days)
const {
  data: timelineDataRaw,
  isLoading: isLoadingTimeline
} = useMetricsTimeline('week', user.value?.id)

const timelineData = computed(() => timelineDataRaw.value?.data || timelineDataRaw.value || [])

// Opportunities by type
const {
  data: opportunitiesByTypeRaw,
  isLoading: isLoadingByType
} = useOpportunitiesByType(user.value?.id)

const opportunitiesByType = computed(() =>
  opportunitiesByTypeRaw.value?.data || opportunitiesByTypeRaw.value || []
)

// ============================================================================
// CHART DATA
// ============================================================================

const timelineChartData = computed(() => {
  if (!timelineData.value || timelineData.value.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  return {
    labels: timelineData.value.map(item => item.date),
    datasets: [
      {
        label: 'Oportunidades',
        data: timelineData.value.map(item => item.total_opportunities || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Convertidas',
        data: timelineData.value.map(item => item.won_opportunities || 0),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// ============================================================================
// HELPERS
// ============================================================================

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-6);
}

.chart-card {
  min-height: 400px;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border-light);
}

.type-item:last-child {
  border-bottom: none;
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.quick-actions {
  margin-top: var(--spacing-4);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-3);
}

@media (max-width: 768px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>