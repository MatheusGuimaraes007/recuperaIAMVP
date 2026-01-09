/**
 * MessagesService - Serviço de Mensagens
 * 
 * Gerencia mensagens entre agentes e contatos.
 */

import { getAdapter } from '../adapters'

export class MessagesService {
  constructor() {
    this.adapter = null
    this.resource = 'messages'
  }

  async ensureAdapter() {
    if (!this.adapter) {
      this.adapter = await getAdapter()
    }
    return this.adapter
  }

  /**
   * Lista mensagens de uma oportunidade
   */
  async getOpportunityMessages(opportunityId, options = {}) {
    const adapter = await this.ensureAdapter()
    
    const { limit = 50, order = 'asc' } = options

    return await adapter.findMany(this.resource, {
      filters: { opportunity_id: opportunityId },
      order: { column: 'created_at', ascending: order === 'asc' },
      limit
    })
  }

  /**
   * Lista mensagens de um contato
   */
  async getContactMessages(contactId, options = {}) {
    const adapter = await this.ensureAdapter()
    
    const { limit = 50, order = 'desc' } = options

    return await adapter.findMany(this.resource, {
      filters: { contact_id: contactId },
      order: { column: 'created_at', ascending: order === 'asc' },
      limit
    })
  }

  /**
   * Cria nova mensagem
   */
  async createMessage(messageData) {
    const adapter = await this.ensureAdapter()
    
    if (!messageData.opportunity_id) throw new Error('opportunity_id obrigatório')
    if (!messageData.contact_id) throw new Error('contact_id obrigatório')
    if (!messageData.agent_id) throw new Error('agent_id obrigatório')
    if (!messageData.direction) throw new Error('direction obrigatório')

    return await adapter.create(this.resource, {
      ...messageData,
      metadata: messageData.metadata || {},
      created_at: new Date().toISOString()
    })
  }

  /**
   * Busca mensagem por ID externo (WhatsApp)
   */
  async getByExternalId(externalId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.findOne(this.resource, {
      external_message_id: externalId
    })
  }
}

export const messagesService = new MessagesService()
export default messagesService
