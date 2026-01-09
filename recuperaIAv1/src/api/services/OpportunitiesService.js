/**
 * OpportunitiesService - Serviço de Oportunidades
 * 
 * Gerencia oportunidades de recuperação de vendas.
 * Baseado no useOpportunitiesStore.
 */

import { getAdapter } from '../adapters'
import { RESOURCES } from '../config'

// Status válidos
export const OPPORTUNITY_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  WON: 'won',
  LOST: 'lost',
  PAUSED: 'paused',
  RECOVERED: 'recovered'
}

// Tipos de oportunidade
export const OPPORTUNITY_TYPES = {
  BOLETO: 'boleto_emitido',
  PIX: 'pix_emitido',
  CART: 'abandono_de_carrinho',
  REFUSED_CARD: 'cartao_recusado'
}

// Motivos de perda
export const LOST_REASONS = {
  PRICE: 'price',
  NO_RESPONSE: 'no_response',
  COMPETITOR: 'competitor',
  NOT_INTERESTED: 'not_interested',
  OTHER: 'other'
}

export class OpportunitiesService {
  constructor() {
    this.adapter = null
    this.resource = RESOURCES.OPPORTUNITIES
  }

  async ensureAdapter() {
    if (!this.adapter) {
      this.adapter = await getAdapter()
    }
    return this.adapter
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  /**
   * Lista oportunidades com filtros
   */
  async listOpportunities(options = {}) {
    const adapter = await this.ensureAdapter()
    
    const {
      page = 1,
      limit = 25,
      status = null,
      contactId = null,
      agentId = null,
      productId = null,
      opportunityType = null,
      search = ''
    } = options

    const filters = {
      deleted_at: null
    }
    
    if (status && status !== OPPORTUNITY_STATUS.ALL) {
      filters.status = status
    }

    if (contactId) {
      filters.contact_id = contactId
    }

    if (agentId) {
      filters.agent_id = agentId
    }

    if (productId) {
      filters.product_id = productId
    }

    if (opportunityType) {
      filters.opportunity_type = opportunityType
    }

    let opportunities = await adapter.findMany(this.resource, {
      filters,
      order: { column: 'created_at', ascending: false },
      limit,
      offset: (page - 1) * limit,
      select: `
        *,
        contact:contacts(id, name, phone, email),
        agent:agents(id, name),
        product:products(id, name, description)
      `
    })

    // Filtrar por search se necessário
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim()
      opportunities = opportunities.filter(opp => {
        const contactName = (opp.contact?.name || '').toLowerCase()
        const contactPhone = (opp.contact?.phone || '').toLowerCase()
        const value = String(opp.value || '').toLowerCase()
        
        return contactName.includes(searchTerm) || 
               contactPhone.includes(searchTerm) || 
               value.includes(searchTerm)
      })
    }

    return opportunities
  }

  /**
   * Busca oportunidade por ID com relacionamentos
   */
  async getOpportunityById(opportunityId) {
    const adapter = await this.ensureAdapter()
    
    const opportunity = await adapter.findById(this.resource, opportunityId)
    
    if (!opportunity) {
      throw new Error('Oportunidade não encontrada')
    }

    // Buscar relacionamentos
    const [contact, agent, product, messages] = await Promise.all([
      opportunity.contact_id ? adapter.findById('contacts', opportunity.contact_id) : null,
      opportunity.agent_id ? adapter.findById('agents', opportunity.agent_id) : null,
      opportunity.product_id ? adapter.findById('products', opportunity.product_id) : null,
      adapter.findMany('messages', {
        filters: { opportunity_id: opportunityId },
        order: { column: 'created_at', ascending: true }
      })
    ])

    return {
      ...opportunity,
      contact,
      agent,
      product,
      messages: messages || []
    }
  }

  /**
   * Cria nova oportunidade
   */
  async createOpportunity(opportunityData) {
    const adapter = await this.ensureAdapter()
    
    // Validações
    if (!opportunityData.contact_id) {
      throw new Error('Contato é obrigatório')
    }

    if (!opportunityData.agent_id) {
      throw new Error('Agente é obrigatório')
    }

    if (!opportunityData.opportunity_type) {
      throw new Error('Tipo de oportunidade é obrigatório')
    }

    if (!opportunityData.value || parseFloat(opportunityData.value) <= 0) {
      throw new Error('Valor deve ser maior que zero')
    }

    // Criar oportunidade
    const opportunity = await adapter.create(this.resource, {
      ...opportunityData,
      status: opportunityData.status || OPPORTUNITY_STATUS.ACTIVE,
      message_count: 0,
      metadata: opportunityData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return opportunity
  }

  /**
   * Atualiza oportunidade
   */
  async updateOpportunity(opportunityId, updates) {
    const adapter = await this.ensureAdapter()
    
    const existing = await adapter.findById(this.resource, opportunityId)
    if (!existing) {
      throw new Error('Oportunidade não encontrada')
    }

    // Se mudou para 'won', garantir que tem converted_value
    if (updates.status === OPPORTUNITY_STATUS.WON && !updates.converted_value && !existing.converted_value) {
      updates.converted_value = existing.value
    }

    // Se mudou para 'lost', garantir que tem lost_reason
    if (updates.status === OPPORTUNITY_STATUS.LOST && !updates.lost_reason) {
      throw new Error('Motivo da perda é obrigatório')
    }

    // Se fechou (won ou lost), adicionar closed_at
    if ((updates.status === OPPORTUNITY_STATUS.WON || updates.status === OPPORTUNITY_STATUS.LOST) && !existing.closed_at) {
      updates.closed_at = new Date().toISOString()
      
      // Calcular conversion_time_minutes
      const createdAt = new Date(existing.created_at)
      const closedAt = new Date(updates.closed_at)
      updates.conversion_time_minutes = Math.round((closedAt - createdAt) / (1000 * 60))
    }

    return await adapter.update(this.resource, opportunityId, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Atualiza status da oportunidade
   */
  async updateOpportunityStatus(opportunityId, newStatus, additionalData = {}) {
    return await this.updateOpportunity(opportunityId, {
      status: newStatus,
      ...additionalData
    })
  }

  /**
   * Marca oportunidade como ganha
   */
  async markAsWon(opportunityId, convertedValue = null, metadata = {}) {
    const adapter = await this.ensureAdapter()
    
    const existing = await adapter.findById(this.resource, opportunityId)
    if (!existing) {
      throw new Error('Oportunidade não encontrada')
    }

    const updates = {
      status: OPPORTUNITY_STATUS.WON,
      converted_value: convertedValue || existing.value,
      closed_at: new Date().toISOString(),
      metadata: { ...existing.metadata, ...metadata }
    }

    // Calcular tempo de conversão
    const createdAt = new Date(existing.created_at)
    const closedAt = new Date(updates.closed_at)
    updates.conversion_time_minutes = Math.round((closedAt - createdAt) / (1000 * 60))

    return await this.updateOpportunity(opportunityId, updates)
  }

  /**
   * Marca oportunidade como perdida
   */
  async markAsLost(opportunityId, lostReason, notes = null) {
    const adapter = await this.ensureAdapter()
    
    if (!lostReason) {
      throw new Error('Motivo da perda é obrigatório')
    }

    if (!Object.values(LOST_REASONS).includes(lostReason)) {
      throw new Error('Motivo de perda inválido')
    }

    const existing = await adapter.findById(this.resource, opportunityId)
    if (!existing) {
      throw new Error('Oportunidade não encontrada')
    }

    const updates = {
      status: OPPORTUNITY_STATUS.LOST,
      lost_reason: lostReason,
      closed_at: new Date().toISOString()
    }

    if (notes) {
      updates.conversation_summary = notes
    }

    return await this.updateOpportunity(opportunityId, updates)
  }

  /**
   * Marca oportunidade como recuperada
   */
  async markAsRecovered(opportunityId, convertedValue = null) {
    const adapter = await this.ensureAdapter()
    
    const existing = await adapter.findById(this.resource, opportunityId)
    if (!existing) {
      throw new Error('Oportunidade não encontrada')
    }

    // Só pode recuperar se estava perdida ou pausada
    if (existing.status !== OPPORTUNITY_STATUS.LOST && existing.status !== OPPORTUNITY_STATUS.PAUSED) {
      throw new Error('Apenas oportunidades perdidas ou pausadas podem ser recuperadas')
    }

    const updates = {
      status: OPPORTUNITY_STATUS.RECOVERED,
      converted_value: convertedValue || existing.value,
      closed_at: new Date().toISOString()
    }

    // Calcular tempo de recuperação
    if (existing.closed_at) {
      const lostAt = new Date(existing.closed_at)
      const recoveredAt = new Date(updates.closed_at)
      updates.recovery_time_minutes = Math.round((recoveredAt - lostAt) / (1000 * 60))
    }

    return await this.updateOpportunity(opportunityId, updates)
  }

  /**
   * Pausa oportunidade
   */
  async pauseOpportunity(opportunityId) {
    return await this.updateOpportunityStatus(opportunityId, OPPORTUNITY_STATUS.PAUSED)
  }

  /**
   * Reativa oportunidade
   */
  async reactivateOpportunity(opportunityId) {
    return await this.updateOpportunityStatus(opportunityId, OPPORTUNITY_STATUS.ACTIVE, {
      closed_at: null
    })
  }

  /**
   * Soft delete da oportunidade
   */
  async deleteOpportunity(opportunityId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update(this.resource, opportunityId, {
      deleted_at: new Date().toISOString()
    })
  }

  /**
   * Incrementa contador de mensagens
   */
  async incrementMessageCount(opportunityId) {
    const adapter = await this.ensureAdapter()
    
    const opportunity = await adapter.findById(this.resource, opportunityId)
    if (!opportunity) {
      throw new Error('Oportunidade não encontrada')
    }

    return await adapter.update(this.resource, opportunityId, {
      message_count: (opportunity.message_count || 0) + 1,
      updated_at: new Date().toISOString()
    })
  }

  // ============================================================================
  // BUSINESS LOGIC
  // ============================================================================

  /**
   * Busca oportunidades ativas
   */
  async getActiveOpportunities() {
    return await this.listOpportunities({
      status: OPPORTUNITY_STATUS.ACTIVE
    })
  }

  /**
   * Busca oportunidades ganhas
   */
  async getWonOpportunities() {
    return await this.listOpportunities({
      status: OPPORTUNITY_STATUS.WON
    })
  }

  /**
   * Busca oportunidades perdidas
   */
  async getLostOpportunities() {
    return await this.listOpportunities({
      status: OPPORTUNITY_STATUS.LOST
    })
  }

  /**
   * Busca oportunidades recuperadas
   */
  async getRecoveredOpportunities() {
    return await this.listOpportunities({
      status: OPPORTUNITY_STATUS.RECOVERED
    })
  }

  /**
   * Busca oportunidades por tipo
   */
  async getOpportunitiesByType(type) {
    return await this.listOpportunities({
      opportunityType: type
    })
  }

  /**
   * Busca oportunidades por contato
   */
  async getOpportunitiesByContact(contactId) {
    return await this.listOpportunities({
      contactId
    })
  }

  /**
   * Busca oportunidades por agente
   */
  async getOpportunitiesByAgent(agentId) {
    return await this.listOpportunities({
      agentId
    })
  }

  /**
   * Busca oportunidades por produto
   */
  async getOpportunitiesByProduct(productId) {
    return await this.listOpportunities({
      productId
    })
  }

  /**
   * Calcula métricas gerais
   */
  async getMetrics(filters = {}) {
    const opportunities = await this.listOpportunities(filters)
    
    const total = opportunities.length
    const active = opportunities.filter(o => o.status === OPPORTUNITY_STATUS.ACTIVE).length
    const won = opportunities.filter(o => o.status === OPPORTUNITY_STATUS.WON).length
    const lost = opportunities.filter(o => o.status === OPPORTUNITY_STATUS.LOST).length
    const recovered = opportunities.filter(o => o.status === OPPORTUNITY_STATUS.RECOVERED).length
    
    const totalValue = opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0)
    const convertedValue = opportunities
      .filter(o => o.status === OPPORTUNITY_STATUS.WON || o.status === OPPORTUNITY_STATUS.RECOVERED)
      .reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0)
    
    const conversionRate = total > 0 ? ((won + recovered) / total) * 100 : 0
    
    return {
      total,
      active,
      won,
      lost,
      recovered,
      paused: total - active - won - lost - recovered,
      totalValue,
      convertedValue,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      averageValue: total > 0 ? totalValue / total : 0,
      averageConvertedValue: (won + recovered) > 0 ? convertedValue / (won + recovered) : 0
    }
  }

  /**
   * Agrupa oportunidades por status
   */
  async groupByStatus() {
    const opportunities = await this.listOpportunities()
    
    return {
      active: opportunities.filter(o => o.status === OPPORTUNITY_STATUS.ACTIVE),
      won: opportunities.filter(o => o.status === OPPORTUNITY_STATUS.WON),
      lost: opportunities.filter(o => o.status === OPPORTUNITY_STATUS.LOST),
      recovered: opportunities.filter(o => o.status === OPPORTUNITY_STATUS.RECOVERED),
      paused: opportunities.filter(o => o.status === OPPORTUNITY_STATUS.PAUSED)
    }
  }

  /**
   * Busca oportunidades criadas hoje
   */
  async getTodaysOpportunities() {
    const adapter = await this.ensureAdapter()
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return await adapter.findMany(this.resource, {
      filters: {
        deleted_at: null,
        created_at: {
          operator: 'gte',
          value: today.toISOString()
        }
      },
      order: { column: 'created_at', ascending: false }
    })
  }

  /**
   * Busca oportunidades fechadas recentemente
   */
  async getRecentlyClosed(days = 7) {
    const adapter = await this.ensureAdapter()
    
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    return await adapter.findMany(this.resource, {
      filters: {
        deleted_at: null,
        closed_at: {
          operator: 'gte',
          value: sinceDate.toISOString()
        }
      },
      order: { column: 'closed_at', ascending: false }
    })
  }
}

// Export singleton
export const opportunitiesService = new OpportunitiesService()

export default opportunitiesService
