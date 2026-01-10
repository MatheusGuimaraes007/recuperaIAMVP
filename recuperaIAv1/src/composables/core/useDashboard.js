/**
 * useDashboard Composable
 *
 * Composable centralizado para funcionalidades do dashboard
 */

import { computed } from 'vue'
import { useAuth } from '@/composables/core/useAuth'
import {
  useDashboardMetrics,
  useMetricsTimeline,
  useOpportunitiesByType,
  useLostReasonsDistribution,
  useTopAgents
} from '@/api/queries/dashboard'

export function useDashboard(options = {}) {
  const {
    period = 'week',
    topAgentsLimit = 10,
    enableRealtime = false
  } = options

  const { user, isAdmin } = useAuth()

  // ============================================================================
  // DATA QUERIES
  // ============================================================================

  // Dashboard metrics
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useDashboardMetrics(user.value?.id)

  // Timeline data
  const {
    data: timelineData,
    isLoading: isLoadingTimeline,
    error: timelineError,
    refetch: refetchTimeline
  } = useMetricsTimeline(period, user.value?.id)

  // Opportunities by type
  const {
    data: opportunitiesByType,
    isLoading: isLoadingByType,
    error: byTypeError,
    refetch: refetchByType
  } = useOpportunitiesByType(user.value?.id)

  // Lost reasons (only for admins)
  const {
    data: lostReasons,
    isLoading: isLoadingLostReasons,
    error: lostReasonsError,
    refetch: refetchLostReasons
  } = useLostReasonsDistribution(isAdmin.value ? user.value?.id : null)

  // Top agents (only for admins)
  const {
    data: topAgents,
    isLoading: isLoadingTopAgents,
    error: topAgentsError,
    refetch: refetchTopAgents
  } = useTopAgents(topAgentsLimit, isAdmin.value ? user.value?.id : null)

  // ============================================================================
  // COMPUTED
  // ============================================================================

  const metrics = computed(() => {
    const raw = metricsData.value?.data || metricsData.value
    if (!raw) return null

    return {
      totalOpportunities: raw.total_opportunities || 0,
      activeOpportunities: raw.active_opportunities || 0,
      wonOpportunities: raw.won_opportunities || 0,
      lostOpportunities: raw.lost_opportunities || 0,
      recoveredOpportunities: raw.recovered_opportunities || 0,
      totalContacts: raw.total_contacts || 0,
      totalAgents: raw.total_agents || 0,
      totalValue: raw.total_value || 0,
      convertedValue: raw.converted_value || 0,
      conversionRate: raw.conversion_rate || 0,
      todaysOpportunities: raw.todays_opportunities || 0,
      todaysClosedOpportunities: raw.todays_closed_opportunities || 0
    }
  })

  const timeline = computed(() => {
    return timelineData.value?.data || timelineData.value || []
  })

  const typeDistribution = computed(() => {
    return opportunitiesByType.value?.data || opportunitiesByType.value || []
  })

  const lostReasonsData = computed(() => {
    return lostReasons.value?.data || lostReasons.value || []
  })

  const topAgentsData = computed(() => {
    return topAgents.value?.data || topAgents.value || []
  })

  const isLoading = computed(() => {
    return isLoadingMetrics.value || isLoadingTimeline.value
  })

  const hasError = computed(() => {
    return !!(metricsError.value || timelineError.value)
  })

  const errorMessage = computed(() => {
    return (
      metricsError.value?.message ||
      timelineError.value?.message ||
      'Erro ao carregar dados do dashboard'
    )
  })

  // ============================================================================
  // CHART DATA FORMATTERS
  // ============================================================================

  /**
   * Formata dados para Chart.js Line Chart
   */
  const timelineChartData = computed(() => {
    if (!timeline.value || timeline.value.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    return {
      labels: timeline.value.map(item => item.date),
      datasets: [
        {
          label: 'Total de Oportunidades',
          data: timeline.value.map(item => item.total_opportunities || 0),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Oportunidades Ganhas',
          data: timeline.value.map(item => item.won_opportunities || 0),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Oportunidades Perdidas',
          data: timeline.value.map(item => item.lost_opportunities || 0),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  })

  /**
   * Formata dados para Donut/Pie Chart
   */
  const typeDistributionChartData = computed(() => {
    if (!typeDistribution.value || typeDistribution.value.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    return {
      labels: typeDistribution.value.map(item => item.type),
      datasets: [
        {
          data: typeDistribution.value.map(item => item.count),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(139, 92, 246)',
            'rgb(251, 146, 60)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }
      ]
    }
  })

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const refreshAll = async () => {
    await Promise.all([
      refetchMetrics(),
      refetchTimeline(),
      refetchByType(),
      isAdmin.value ? refetchLostReasons() : Promise.resolve(),
      isAdmin.value ? refetchTopAgents() : Promise.resolve()
    ])
  }

  const refreshMetrics = async () => {
    await refetchMetrics()
  }

  // ============================================================================
  // FORMATTERS
  // ============================================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0)
  }

  const formatPercent = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0)
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    metrics,
    timeline,
    typeDistribution,
    lostReasonsData,
    topAgentsData,

    // Loading states
    isLoading,
    isLoadingMetrics,
    isLoadingTimeline,
    isLoadingByType,
    isLoadingLostReasons,
    isLoadingTopAgents,

    // Errors
    hasError,
    errorMessage,
    metricsError,
    timelineError,
    byTypeError,
    lostReasonsError,
    topAgentsError,

    // Chart data
    timelineChartData,
    typeDistributionChartData,

    // Actions
    refreshAll,
    refreshMetrics,
    refetchTimeline,
    refetchByType,
    refetchLostReasons,
    refetchTopAgents,

    // Formatters
    formatCurrency,
    formatPercent,
    formatNumber
  }
}

export default useDashboard