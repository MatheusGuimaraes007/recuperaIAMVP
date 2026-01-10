/**
 * useAgents Composable
 *
 * Composable de alto nível para operações com agentes.
 * Combina TanStack Query hooks com lógica de negócio.
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 */

import { computed } from 'vue'
import {
  useAgents as useAgentsQuery,
  useAgent,
  useAgentStats,
  useCreateAgent,
  useUpdateAgent,
  useDeleteAgent,
  useAgentsWithWhatsApp,
  useCreateOfficialWhatsApp,
  useLinkKnowledgeBase
} from '@/api/queries/agents'

/**
 * Composable principal de agentes
 * Fornece acesso a queries, mutations e helpers
 */
export function useAgents() {
  // ============================================================================
  // CONSTANTES
  // ============================================================================

  /**
   * Modelos de IA disponíveis
   */
  const AI_MODELS = [
    {
      value: 'gpt-4',
      label: 'GPT-4',
      icon: '🧠',
      description: 'Mais inteligente e preciso',
      costPerToken: 0.03
    },
    {
      value: 'gpt-4-turbo',
      label: 'GPT-4 Turbo',
      icon: '⚡',
      description: 'Rápido e eficiente',
      costPerToken: 0.01
    },
    {
      value: 'gpt-3.5-turbo',
      label: 'GPT-3.5 Turbo',
      icon: '💰',
      description: 'Econômico',
      costPerToken: 0.002
    },
    {
      value: 'claude-3',
      label: 'Claude 3',
      icon: '🤖',
      description: 'Alternativo',
      costPerToken: 0.015
    }
  ]

  /**
   * Opções de tom de voz
   */
  const TONE_OPTIONS = [
    { value: 'professional', label: 'Profissional', icon: '💼', color: 'blue' },
    { value: 'friendly', label: 'Amigável', icon: '😊', color: 'green' },
    { value: 'casual', label: 'Casual', icon: '👋', color: 'purple' },
    { value: 'persuasive', label: 'Persuasivo', icon: '🎯', color: 'orange' },
    { value: 'empathetic', label: 'Empático', icon: '❤️', color: 'pink' },
    { value: 'technical', label: 'Técnico', icon: '🔧', color: 'gray' }
  ]

  /**
   * Status do WhatsApp
   */
  const WHATSAPP_STATUS = {
    active: {
      label: 'Ativo',
      variant: 'success',
      icon: '✅',
      color: '#00C853'
    },
    pending: {
      label: 'Pendente',
      variant: 'warning',
      icon: '⏳',
      color: '#FF9800'
    },
    inactive: {
      label: 'Inativo',
      variant: 'neutral',
      icon: '⭕',
      color: '#6C757D'
    },
    error: {
      label: 'Erro',
      variant: 'danger',
      icon: '❌',
      color: '#F44336'
    }
  }

  // ============================================================================
  // FORMATTERS
  // ============================================================================

  /**
   * Formata número de tokens para exibição
   */
  const formatTokens = (tokens) => {
    if (!tokens || tokens === 0) return '0'

    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`
    }
    return tokens.toString()
  }

  /**
   * Calcula custo estimado baseado em tokens
   */
  const calculateTokenCost = (tokens, modelValue) => {
    if (!tokens) return '0.00'

    const model = AI_MODELS.find(m => m.value === modelValue)
    const costPerK = model?.costPerToken || 0.03

    return ((tokens / 1000) * costPerK).toFixed(2)
  }

  /**
   * Formata número de telefone WhatsApp
   */
  const formatWhatsAppNumber = (number) => {
    if (!number) return 'Não configurado'

    // Remove tudo exceto números
    const cleaned = number.replace(/\D/g, '')

    // Formato: +55 (11) 99999-9999
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }

    return number
  }

  /**
   * Retorna label do modelo de IA
   */
  const getModelLabel = (modelValue) => {
    const model = AI_MODELS.find(m => m.value === modelValue)
    return model?.label || modelValue
  }

  /**
   * Retorna label do tom de voz
   */
  const getToneLabel = (toneValue) => {
    const tone = TONE_OPTIONS.find(t => t.value === toneValue)
    return tone?.label || toneValue
  }

  /**
   * Retorna configuração do status WhatsApp
   */
  const getWhatsAppStatus = (status) => {
    return WHATSAPP_STATUS[status] || WHATSAPP_STATUS.pending
  }

  // ============================================================================
  // VALIDATORS
  // ============================================================================

  /**
   * Valida dados do agente
   */
  const validateAgentData = (data) => {
    const errors = []

    if (!data.name || data.name.trim() === '') {
      errors.push('Nome do agente é obrigatório')
    }

    if (!data.prompt || data.prompt.trim() === '') {
      errors.push('Prompt do sistema é obrigatório')
    }

    if (!data.tone_of_voice) {
      errors.push('Tom de voz é obrigatório')
    }

    if (!data.ai_model) {
      errors.push('Modelo de IA é obrigatório')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Valida dados do WhatsApp
   */
  const validateWhatsAppData = (data) => {
    const errors = []

    if (!data.phone_number) {
      errors.push('Número de telefone é obrigatório')
    }

    if (!data.phone_number_id) {
      errors.push('Phone Number ID é obrigatório')
    }

    if (!data.waba_id) {
      errors.push('WABA ID é obrigatório')
    }

    if (!data.api_token) {
      errors.push('API Token é obrigatório')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // ============================================================================
  // CALCULATORS
  // ============================================================================

  /**
   * Calcula saúde do agente baseado em métricas
   */
  const calculateAgentHealth = (stats) => {
    if (!stats) {
      return {
        status: 'unknown',
        label: 'Desconhecido',
        color: '#6C757D',
        icon: '❓'
      }
    }

    const conversionRate = parseFloat(stats.conversion_rate) || 0
    const activeOpportunities = stats.active_opportunities || 0

    if (conversionRate >= 20 && activeOpportunities > 0) {
      return {
        status: 'excellent',
        label: 'Excelente',
        color: '#00C853',
        icon: '🌟'
      }
    }

    if (conversionRate >= 10) {
      return {
        status: 'good',
        label: 'Bom',
        color: '#4CAF50',
        icon: '✅'
      }
    }

    if (conversionRate >= 5) {
      return {
        status: 'average',
        label: 'Médio',
        color: '#FF9800',
        icon: '⚠️'
      }
    }

    return {
      status: 'poor',
      label: 'Baixo',
      color: '#F44336',
      icon: '🔴'
    }
  }

  /**
   * Calcula métricas agregadas de agentes
   */
  const calculateAggregatedMetrics = (agents) => {
    if (!agents || agents.length === 0) {
      return {
        total: 0,
        active: 0,
        withWhatsApp: 0,
        totalTokens: 0,
        totalCost: 0,
        avgConversionRate: 0
      }
    }

    const metrics = agents.reduce((acc, agent) => {
      acc.total++

      if (!agent.deleted_at) {
        acc.active++
      }

      if (agent.official_whatsapp_number_id) {
        acc.withWhatsApp++
      }

      acc.totalTokens += agent.token_used || 0

      return acc
    }, {
      total: 0,
      active: 0,
      withWhatsApp: 0,
      totalTokens: 0,
      totalCost: 0,
      avgConversionRate: 0
    })

    // Calcular custo total
    metrics.totalCost = agents.reduce((sum, agent) => {
      return sum + parseFloat(calculateTokenCost(agent.token_used, agent.ai_model))
    }, 0).toFixed(2)

    return metrics
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Queries
    useAgentsQuery,
    useAgent,
    useAgentStats,
    useAgentsWithWhatsApp,

    // Mutations
    useCreateAgent,
    useUpdateAgent,
    useDeleteAgent,
    useCreateOfficialWhatsApp,
    useLinkKnowledgeBase,

    // Constantes
    AI_MODELS,
    TONE_OPTIONS,
    WHATSAPP_STATUS,

    // Formatters
    formatTokens,
    calculateTokenCost,
    formatWhatsAppNumber,
    getModelLabel,
    getToneLabel,
    getWhatsAppStatus,

    // Validators
    validateAgentData,
    validateWhatsAppData,

    // Calculators
    calculateAgentHealth,
    calculateAggregatedMetrics
  }
}

export default useAgents