/**
 * ContactsService - Serviço de Contatos (Clientes)
 * 
 * Gerencia contatos/clientes com suas oportunidades e mensagens.
 * Baseado no useClientsStore da arquitetura anterior.
 */

import { getAdapter } from '../adapters'
import { RESOURCES } from '../config'

export class ContactsService {
  constructor() {
    this.adapter = null
    this.resource = RESOURCES.CLIENTS // 'contacts' na tabela
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
   * Lista todos os contatos com filtros
   * @param {Object} options - { page, limit, status, search, agentId }
   */
  async listContacts(options = {}) {
    const adapter = await this.ensureAdapter()
    
    const {
      page = 1,
      limit = 50,
      status = null,
      search = '',
      agentId = null
    } = options

    const filters = {}
    
    // Filtro por status
    if (status && status !== 'all') {
      filters.status = status
    }

    // Filtro por agente
    if (agentId) {
      filters.agent_id = agentId
    }

    // Filtro de deletados
    filters.deleted_at = null

    // Busca por texto (nome, phone, email)
    // Nota: Adapter não suporta OR nativo, então fazer no service
    let contacts = await adapter.findMany(this.resource, {
      filters,
      order: { column: 'created_at', ascending: false },
      limit,
      offset: (page - 1) * limit,
      select: `
        *,
        agent:agents(id, name)
      `
    })

    // Filtrar por search no service se necessário
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim()
      contacts = contacts.filter(contact => {
        const name = (contact.name || '').toLowerCase()
        const phone = (contact.phone || '').toLowerCase()
        const email = (contact.email || '').toLowerCase()
        
        return name.includes(searchTerm) || 
               phone.includes(searchTerm) || 
               email.includes(searchTerm)
      })
    }

    return contacts
  }

  /**
   * Busca contato por ID com relacionamentos
   * Inclui: opportunities, messages, agent
   */
  async getContactById(contactId) {
    const adapter = await this.ensureAdapter()
    
    // Buscar contato
    const contact = await adapter.findById(this.resource, contactId)
    
    if (!contact) {
      throw new Error('Contato não encontrado')
    }

    // Buscar relacionamentos em paralelo
    const [opportunities, messages] = await Promise.all([
      // Opportunities
      adapter.findMany('opportunities', {
        filters: { contact_id: contactId, deleted_at: null },
        order: { column: 'created_at', ascending: false },
        select: `
          *,
          product:products(id, name, description),
          agent:agents(id, name)
        `
      }),
      
      // Messages (últimas 50)
      adapter.findMany('messages', {
        filters: { contact_id: contactId },
        order: { column: 'created_at', ascending: false },
        limit: 50,
        select: 'id, content, direction, created_at, metadata'
      })
    ])

    // Buscar agente se tiver
    if (contact.agent_id) {
      contact.agent = await adapter.findById('agents', contact.agent_id)
    }

    return {
      ...contact,
      opportunities: opportunities || [],
      messages: messages || []
    }
  }

  /**
   * Busca contato por telefone
   */
  async getContactByPhone(phone) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.findOne(this.resource, {
      phone,
      deleted_at: null
    })
  }

  /**
   * Busca contato por email
   */
  async getContactByEmail(email) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.findOne(this.resource, {
      email,
      deleted_at: null
    })
  }

  /**
   * Cria novo contato
   */
  async createContact(contactData) {
    const adapter = await this.ensureAdapter()
    
    // Validações
    if (!contactData.phone) {
      throw new Error('Telefone é obrigatório')
    }

    // Validar formato do telefone (deve começar com +)
    if (!contactData.phone.startsWith('+')) {
      throw new Error('Telefone deve estar no formato internacional (+5511999999999)')
    }

    // Verificar se telefone já existe
    const existing = await this.getContactByPhone(contactData.phone)
    if (existing) {
      throw new Error('Telefone já cadastrado')
    }

    // Criar contato
    const contact = await adapter.create(this.resource, {
      ...contactData,
      status: contactData.status || 'new',
      tags: contactData.tags || [],
      metadata: contactData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return contact
  }

  /**
   * Atualiza contato
   */
  async updateContact(contactId, updates) {
    const adapter = await this.ensureAdapter()
    
    // Verificar se existe
    const existing = await adapter.findById(this.resource, contactId)
    if (!existing) {
      throw new Error('Contato não encontrado')
    }

    // Se está atualizando telefone, verificar duplicata
    if (updates.phone && updates.phone !== existing.phone) {
      const duplicate = await this.getContactByPhone(updates.phone)
      if (duplicate && duplicate.id !== contactId) {
        throw new Error('Telefone já cadastrado em outro contato')
      }
    }

    // Atualizar
    const contact = await adapter.update(this.resource, contactId, {
      ...updates,
      updated_at: new Date().toISOString()
    })

    return contact
  }

  /**
   * Atualiza status do contato
   */
  async updateContactStatus(contactId, newStatus) {
    return await this.updateContact(contactId, { status: newStatus })
  }

  /**
   * Soft delete do contato
   */
  async deleteContact(contactId) {
    const adapter = await this.ensureAdapter()
    
    // Soft delete
    return await adapter.update(this.resource, contactId, {
      deleted_at: new Date().toISOString()
    })
  }

  /**
   * Hard delete (cuidado!)
   */
  async permanentlyDeleteContact(contactId) {
    const adapter = await this.ensureAdapter()
    
    // ATENÇÃO: Isso vai deletar permanentemente
    // Considere verificar se há opportunities/messages primeiro
    return await adapter.delete(this.resource, contactId)
  }

  // ============================================================================
  // BUSINESS LOGIC
  // ============================================================================

  /**
   * Busca contatos ativos
   */
  async getActiveContacts() {
    return await this.listContacts({
      status: 'engaged'
    })
  }

  /**
   * Busca contatos convertidos
   */
  async getConvertedContacts() {
    return await this.listContacts({
      status: 'converted'
    })
  }

  /**
   * Busca contatos por agente
   */
  async getContactsByAgent(agentId) {
    return await this.listContacts({
      agentId
    })
  }

  /**
   * Busca contatos por tags
   */
  async getContactsByTags(tags) {
    const adapter = await this.ensureAdapter()
    
    const contacts = await adapter.findMany(this.resource, {
      filters: { deleted_at: null },
      order: { column: 'created_at', ascending: false }
    })

    // Filtrar por tags (array contains)
    return contacts.filter(contact => {
      if (!contact.tags || !Array.isArray(contact.tags)) return false
      return tags.some(tag => contact.tags.includes(tag))
    })
  }

  /**
   * Busca contatos criados hoje
   */
  async getTodaysContacts() {
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
   * Conta total de contatos
   */
  async countContacts(filters = {}) {
    const contacts = await this.listContacts(filters)
    return contacts.length
  }

  /**
   * Busca métricas do contato (via RPC se disponível)
   */
  async getContactMetrics(contactId) {
    const adapter = await this.ensureAdapter()
    
    try {
      // Tentar usar RPC function
      const metrics = await adapter.rpc('get_contact_metrics', {
        p_contact_id: contactId
      })
      
      return metrics
    } catch (error) {
      console.warn('RPC get_contact_metrics não disponível, calculando manualmente')
      
      // Fallback: calcular métricas manualmente
      const contact = await this.getContactById(contactId)
      
      const opportunities = contact.opportunities || []
      const wonOpportunities = opportunities.filter(o => o.status === 'won')
      
      const totalValue = opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0)
      const convertedValue = wonOpportunities.reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0)
      
      return {
        total_opportunities: opportunities.length,
        won_opportunities: wonOpportunities.length,
        total_value: totalValue,
        converted_value: convertedValue,
        conversion_rate: opportunities.length > 0 ? (wonOpportunities.length / opportunities.length) * 100 : 0,
        total_messages: contact.messages?.length || 0
      }
    }
  }

  /**
   * Busca otimizada com RPC
   */
  async searchContactsOptimized(options = {}) {
    const adapter = await this.ensureAdapter()
    
    const {
      search = '',
      status = null,
      limit = 50,
      offset = 0
    } = options

    try {
      // Tentar usar RPC function otimizada
      const contacts = await adapter.rpc('search_contacts', {
        p_user_id: null, // será preenchido pelo RLS
        p_search_term: search || null,
        p_status: status === 'all' ? null : status,
        p_limit: limit,
        p_offset: offset
      })
      
      return contacts
    } catch (error) {
      console.warn('RPC search_contacts não disponível, usando busca normal')
      
      // Fallback: busca normal
      return await this.listContacts(options)
    }
  }

  /**
   * Adiciona tag ao contato
   */
  async addTag(contactId, tag) {
    const adapter = await this.ensureAdapter()
    
    const contact = await adapter.findById(this.resource, contactId)
    
    if (!contact) {
      throw new Error('Contato não encontrado')
    }

    const tags = contact.tags || []
    
    if (!tags.includes(tag)) {
      tags.push(tag)
      
      return await adapter.update(this.resource, contactId, {
        tags,
        updated_at: new Date().toISOString()
      })
    }

    return contact
  }

  /**
   * Remove tag do contato
   */
  async removeTag(contactId, tag) {
    const adapter = await this.ensureAdapter()
    
    const contact = await adapter.findById(this.resource, contactId)
    
    if (!contact) {
      throw new Error('Contato não encontrado')
    }

    const tags = (contact.tags || []).filter(t => t !== tag)
    
    return await adapter.update(this.resource, contactId, {
      tags,
      updated_at: new Date().toISOString()
    })
  }
}

// Export singleton
export const contactsService = new ContactsService()

export default contactsService
