/**
 * DashboardService - Serviço de Dashboard e Métricas
 * 
 * Agrega métricas e estatísticas usando RPC functions otimizadas.
 * Baseado no useAdminDashboardStore.
 */

import { getAdapter } from '../adapters'

export class DashboardService {
  constructor() {
    this.adapter = null
  }

  async ensureAdapter() {
    if (!this.adapter) {
      this.adapter = await getAdapter()
    }
    return this.adapter
  }

  // ============================================================================
  // MÉTRICAS AGREGADAS (via RPC)
  // ============================================================================

  /**
   * Busca métricas gerais do dashboard
   * RPC: get_dashboard_metrics
   */
  async getDashboardMetrics(userId = null) {
    const adapter = await this.ensureAdapter()
    
    try {
      const metrics = await adapter.rpc('get_dashboard_metrics', {
        p_user_id: userId
      })
      
      return metrics
    } catch (error) {
      console.warn('RPC get_dashboard_metrics não disponível, calculando manualmente')
      
      // Fallback: calcular métricas manualmente
      return await this.calculateDashboardMetricsManually(userId)
    }
  }

  /**
   * Fallback manual para métricas do dashboard
   */
  async calculateDashboardMetricsManually(userId = null) {
    const adapter = await this.ensureAdapter()
    
    const filters = userId ? { user_id: userId } : {}
    
    // Buscar dados em paralelo
    const [opportunities, contacts, agents] = await Promise.all([
      adapter.findMany('opportunities', {
        filters: { ...filters, deleted_at: null }
      }),
      adapter.findMany('contacts', {
        filters: { ...filters, deleted_at: null }
      }),
      adapter.findMany('agents', {
        filters: { ...filters, deleted_at: null }
      })
    ])

    // Calcular métricas
    const totalOpportunities = opportunities.length
    const activeOpportunities = opportunities.filter(o => o.status === 'active').length
    const wonOpportunities = opportunities.filter(o => o.status === 'won').length
    const lostOpportunities = opportunities.filter(o => o.status === 'lost').length
    const recoveredOpportunities = opportunities.filter(o => o.status === 'recovered').length

    const totalValue = opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0)
    const convertedValue = opportunities
      .filter(o => o.status === 'won' || o.status === 'recovered')
      .reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0)

    const conversionRate = totalOpportunities > 0 
      ? ((wonOpportunities + recoveredOpportunities) / totalOpportunities) * 100 
      : 0

    // Oportunidades criadas hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysOpportunities = opportunities.filter(o => 
      new Date(o.created_at) >= today
    ).length

    // Oportunidades fechadas hoje
    const todaysClosedOpportunities = opportunities.filter(o => {
      if (!o.closed_at) return false
      const closedDate = new Date(o.closed_at)
      closedDate.setHours(0, 0, 0, 0)
      return closedDate.getTime() === today.getTime()
    }).length

    return {
      total_opportunities: totalOpportunities,
      active_opportunities: activeOpportunities,
      won_opportunities: wonOpportunities,
      lost_opportunities: lostOpportunities,
      recovered_opportunities: recoveredOpportunities,
      total_contacts: contacts.length,
      total_agents: agents.length,
      total_value: totalValue,
      converted_value: convertedValue,
      conversion_rate: parseFloat(conversionRate.toFixed(2)),
      todays_opportunities: todaysOpportunities,
      todays_closed_opportunities: todaysClosedOpportunities
    }
  }

  /**
   * Busca métricas de usuário específico (ADMIN)
   */
  async getUserMetrics(userId) {
    return await this.getDashboardMetrics(userId)
  }

  /**
   * Busca métricas por período
   */
  async getMetricsByPeriod(startDate, endDate, userId = null) {
    const adapter = await this.ensureAdapter()
    
    try {
      const metrics = await adapter.rpc('get_metrics_by_period', {
        p_user_id: userId,
        p_start_date: startDate,
        p_end_date: endDate
      })
      
      return metrics
    } catch (error) {
      console.warn('RPC get_metrics_by_period não disponível')
      
      // Fallback manual
      const filters = {
        deleted_at: null,
        created_at: {
          operator: 'gte',
          value: startDate
        }
      }

      if (userId) {
        filters.user_id = userId
      }

      const opportunities = await adapter.findMany('opportunities', {
        filters
      })

      // Filtrar por end_date
      const filteredOpps = opportunities.filter(o => 
        new Date(o.created_at) <= new Date(endDate)
      )

      return this.calculateMetricsFromOpportunities(filteredOpps)
    }
  }

  /**
   * Calcula métricas de array de oportunidades
   */
  calculateMetricsFromOpportunities(opportunities) {
    const total = opportunities.length
    const won = opportunities.filter(o => o.status === 'won').length
    const lost = opportunities.filter(o => o.status === 'lost').length
    const recovered = opportunities.filter(o => o.status === 'recovered').length

    const totalValue = opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0)
    const convertedValue = opportunities
      .filter(o => o.status === 'won' || o.status === 'recovered')
      .reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0)

    return {
      total_opportunities: total,
      won_opportunities: won,
      lost_opportunities: lost,
      recovered_opportunities: recovered,
      total_value: totalValue,
      converted_value: convertedValue,
      conversion_rate: total > 0 ? ((won + recovered) / total) * 100 : 0
    }
  }

  /**
   * Busca top agentes por performance
   */
  async getTopAgents(limit = 10, userId = null) {
    const adapter = await this.ensureAdapter()
    
    try {
      const topAgents = await adapter.rpc('get_top_agents', {
        p_user_id: userId,
        p_limit: limit
      })
      
      return topAgents
    } catch (error) {
      console.warn('RPC get_top_agents não disponível')
      
      // Fallback: buscar agentes e calcular manualmente
      const filters = userId ? { user_id: userId, deleted_at: null } : { deleted_at: null }
      const agents = await adapter.findMany('agents', { filters })

      // Buscar oportunidades de cada agente
      const agentsWithStats = await Promise.all(
        agents.map(async (agent) => {
          const opportunities = await adapter.findMany('opportunities', {
            filters: { agent_id: agent.id, deleted_at: null }
          })

          const wonOpps = opportunities.filter(o => o.status === 'won' || o.status === 'recovered')
          const convertedValue = wonOpps.reduce((sum, o) => 
            sum + (parseFloat(o.converted_value || o.value) || 0), 0
          )

          return {
            ...agent,
            total_opportunities: opportunities.length,
            won_opportunities: wonOpps.length,
            converted_value: convertedValue,
            conversion_rate: opportunities.length > 0 
              ? (wonOpps.length / opportunities.length) * 100 
              : 0
          }
        })
      )

      // Ordenar por valor convertido
      return agentsWithStats
        .sort((a, b) => b.converted_value - a.converted_value)
        .slice(0, limit)
    }
  }

  /**
   * Busca evolução de métricas ao longo do tempo
   */
  async getMetricsTimeline(period = 'week', userId = null) {
    const adapter = await this.ensureAdapter()
    
    // Calcular datas
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    const filters = {
      deleted_at: null,
      created_at: {
        operator: 'gte',
        value: startDate.toISOString()
      }
    }

    if (userId) {
      filters.user_id = userId
    }

    const opportunities = await adapter.findMany('opportunities', { filters })

    // Agrupar por dia/semana/mês
    const timeline = []
    const groupedByDate = {}

    opportunities.forEach(opp => {
      const date = new Date(opp.created_at)
      let key

      if (period === 'week' || period === 'month') {
        // Agrupar por dia
        key = date.toISOString().split('T')[0]
      } else {
        // Agrupar por semana
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
      }

      if (!groupedByDate[key]) {
        groupedByDate[key] = []
      }
      groupedByDate[key].push(opp)
    })

    // Converter para array
    Object.keys(groupedByDate).sort().forEach(date => {
      const opps = groupedByDate[date]
      const metrics = this.calculateMetricsFromOpportunities(opps)
      
      timeline.push({
        date,
        ...metrics
      })
    })

    return timeline
  }

  /**
   * Busca distribuição por tipo de oportunidade
   */
  async getOpportunitiesByType(userId = null) {
    const adapter = await this.ensureAdapter()
    
    const filters = { deleted_at: null }
    if (userId) filters.user_id = userId

    const opportunities = await adapter.findMany('opportunities', { filters })

    // Agrupar por tipo
    const distribution = {}
    
    opportunities.forEach(opp => {
      const type = opp.opportunity_type || 'unknown'
      
      if (!distribution[type]) {
        distribution[type] = {
          type,
          count: 0,
          total_value: 0,
          converted_value: 0
        }
      }

      distribution[type].count++
      distribution[type].total_value += parseFloat(opp.value) || 0
      
      if (opp.status === 'won' || opp.status === 'recovered') {
        distribution[type].converted_value += parseFloat(opp.converted_value || opp.value) || 0
      }
    })

    return Object.values(distribution)
  }

  /**
   * Busca motivos de perda mais comuns
   */
  async getLostReasonsDistribution(userId = null) {
    const adapter = await this.ensureAdapter()
    
    const filters = { deleted_at: null, status: 'lost' }
    if (userId) filters.user_id = userId

    const lostOpportunities = await adapter.findMany('opportunities', { filters })

    // Agrupar por motivo
    const distribution = {}
    
    lostOpportunities.forEach(opp => {
      const reason = opp.lost_reason || 'not_specified'
      
      if (!distribution[reason]) {
        distribution[reason] = {
          reason,
          count: 0,
          total_value: 0
        }
      }

      distribution[reason].count++
      distribution[reason].total_value += parseFloat(opp.value) || 0
    })

    return Object.values(distribution).sort((a, b) => b.count - a.count)
  }
}

// Export singleton
export const dashboardService = new DashboardService()

export default dashboardService
