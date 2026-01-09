/**
 * AgentsService - Serviço de Agentes de IA
 * 
 * Gerencia agentes de IA com WhatsApp oficial e knowledge bases.
 * Baseado no useAgentsStore e useWhatsAppStore.
 */

import { getAdapter } from '../adapters'
import { RESOURCES } from '../config'

export class AgentsService {
  constructor() {
    this.adapter = null
    this.resource = RESOURCES.AGENTS
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
   * Lista todos os agentes
   */
  async listAgents(options = {}) {
    const adapter = await this.ensureAdapter()
    
    const {
      page = 1,
      limit = 50,
      includeDeleted = false
    } = options

    const filters = {}
    
    if (!includeDeleted) {
      filters.deleted_at = null
    }

    const agents = await adapter.findMany(this.resource, {
      filters,
      order: { column: 'created_at', ascending: false },
      limit,
      offset: (page - 1) * limit,
      select: `
        *,
        official_whatsapp:official_whatsapp_numbers(
          id,
          phone_number,
          display_name,
          status
        )
      `
    })

    // Buscar knowledge bases para cada agente
    for (const agent of agents) {
      agent.knowledge_bases = await this.getAgentKnowledgeBases(agent.id)
    }

    return agents
  }

  /**
   * Busca agente por ID com relacionamentos
   */
  async getAgentById(agentId) {
    const adapter = await this.ensureAdapter()
    
    const agent = await adapter.findById(this.resource, agentId)
    
    if (!agent) {
      throw new Error('Agente não encontrado')
    }

    // Buscar WhatsApp oficial se tiver
    if (agent.official_whatsapp_number_id) {
      agent.official_whatsapp = await adapter.findById(
        'official_whatsapp_numbers',
        agent.official_whatsapp_number_id
      )
    }

    // Buscar knowledge bases
    agent.knowledge_bases = await this.getAgentKnowledgeBases(agentId)

    // Buscar estatísticas
    agent.stats = await this.getAgentStats(agentId)

    return agent
  }

  /**
   * Cria novo agente
   */
  async createAgent(agentData) {
    const adapter = await this.ensureAdapter()
    
    // Validações
    if (!agentData.name) {
      throw new Error('Nome é obrigatório')
    }

    // Criar agente
    const agent = await adapter.create(this.resource, {
      ...agentData,
      tone_of_voice: agentData.tone_of_voice || 'professional',
      ai_model: agentData.ai_model || 'gpt-4',
      token_used: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return agent
  }

  /**
   * Atualiza agente
   */
  async updateAgent(agentId, updates) {
    const adapter = await this.ensureAdapter()
    
    const existing = await adapter.findById(this.resource, agentId)
    if (!existing) {
      throw new Error('Agente não encontrado')
    }

    return await adapter.update(this.resource, agentId, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Soft delete do agente
   */
  async deleteAgent(agentId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update(this.resource, agentId, {
      deleted_at: new Date().toISOString()
    })
  }

  /**
   * Restaura agente deletado
   */
  async restoreAgent(agentId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update(this.resource, agentId, {
      deleted_at: null,
      updated_at: new Date().toISOString()
    })
  }

  // ============================================================================
  // WHATSAPP OFICIAL
  // ============================================================================

  /**
   * Cria/Vincula número oficial WhatsApp ao agente
   * 1. Cria registro em official_whatsapp_numbers
   * 2. Vincula ao agente
   */
  async createOfficialWhatsApp(agentId, whatsappData) {
    const adapter = await this.ensureAdapter()
    
    // Validações
    if (!whatsappData.phone_number) {
      throw new Error('Número de telefone é obrigatório')
    }
    if (!whatsappData.phone_number_id) {
      throw new Error('Phone Number ID é obrigatório')
    }
    if (!whatsappData.waba_id) {
      throw new Error('WABA ID é obrigatório')
    }
    if (!whatsappData.api_token) {
      throw new Error('API Token é obrigatório')
    }

    // Verificar se agente existe
    const agent = await adapter.findById(this.resource, agentId)
    if (!agent) {
      throw new Error('Agente não encontrado')
    }

    // PASSO 1: Criar número oficial WhatsApp
    const whatsapp = await adapter.create('official_whatsapp_numbers', {
      id: agentId, // ID = ID do agente (relação 1:1)
      user_id: agent.user_id,
      phone_number: whatsappData.phone_number,
      phone_number_id: whatsappData.phone_number_id,
      display_name: whatsappData.display_name || whatsappData.phone_number,
      waba_id: whatsappData.waba_id,
      api_token: whatsappData.api_token,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // PASSO 2: Vincular ao agente
    await adapter.update(this.resource, agentId, {
      official_whatsapp_number_id: whatsapp.id,
      updated_at: new Date().toISOString()
    })

    return whatsapp
  }

  /**
   * Atualiza WhatsApp oficial
   */
  async updateOfficialWhatsApp(agentId, updates) {
    const adapter = await this.ensureAdapter()
    
    const agent = await adapter.findById(this.resource, agentId)
    if (!agent || !agent.official_whatsapp_number_id) {
      throw new Error('Agente não tem WhatsApp oficial vinculado')
    }

    return await adapter.update('official_whatsapp_numbers', agentId, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Remove WhatsApp oficial do agente
   */
  async deleteOfficialWhatsApp(agentId) {
    const adapter = await this.ensureAdapter()
    
    const agent = await adapter.findById(this.resource, agentId)
    if (!agent || !agent.official_whatsapp_number_id) {
      throw new Error('Agente não tem WhatsApp oficial vinculado')
    }

    // 1. Remove vínculo no agente
    await adapter.update(this.resource, agentId, {
      official_whatsapp_number_id: null,
      updated_at: new Date().toISOString()
    })

    // 2. Deleta número oficial
    await adapter.delete('official_whatsapp_numbers', agentId)

    return true
  }

  // ============================================================================
  // KNOWLEDGE BASES
  // ============================================================================

  /**
   * Busca knowledge bases do agente
   */
  async getAgentKnowledgeBases(agentId) {
    const adapter = await this.ensureAdapter()
    
    // Buscar IDs de knowledge bases vinculadas
    const links = await adapter.findMany('agents_knowledge_bases', {
      filters: { agent_id: agentId }
    })

    if (!links || links.length === 0) {
      return []
    }

    // Buscar knowledge bases
    const knowledgeBaseIds = links.map(link => link.knowledge_base_id)
    const knowledgeBases = []
    
    for (const kbId of knowledgeBaseIds) {
      const kb = await adapter.findById('knowledge_bases', kbId)
      if (kb) {
        knowledgeBases.push(kb)
      }
    }

    return knowledgeBases
  }

  /**
   * Vincula knowledge base ao agente
   */
  async linkKnowledgeBase(agentId, knowledgeBaseId) {
    const adapter = await this.ensureAdapter()
    
    // Verificar se já existe
    const existing = await adapter.findOne('agents_knowledge_bases', {
      agent_id: agentId,
      knowledge_base_id: knowledgeBaseId
    })

    if (existing) {
      return existing // Já vinculado
    }

    // Criar vínculo
    return await adapter.create('agents_knowledge_bases', {
      agent_id: agentId,
      knowledge_base_id: knowledgeBaseId,
      created_at: new Date().toISOString()
    })
  }

  /**
   * Desvincula knowledge base do agente
   */
  async unlinkKnowledgeBase(agentId, knowledgeBaseId) {
    const adapter = await this.ensureAdapter()
    
    // Buscar vínculo
    const link = await adapter.findOne('agents_knowledge_bases', {
      agent_id: agentId,
      knowledge_base_id: knowledgeBaseId
    })

    if (!link) {
      throw new Error('Knowledge base não vinculada ao agente')
    }

    // Deletar vínculo (composite key: agent_id + knowledge_base_id)
    // Como não temos método para composite keys, usar query manual
    const { error } = await adapter.getClient()
      .from('agents_knowledge_bases')
      .delete()
      .eq('agent_id', agentId)
      .eq('knowledge_base_id', knowledgeBaseId)

    if (error) throw error

    return true
  }

  // ============================================================================
  // BUSINESS LOGIC
  // ============================================================================

  /**
   * Busca agentes ativos
   */
  async getActiveAgents() {
    const agents = await this.listAgents()
    return agents.filter(agent => !agent.deleted_at)
  }

  /**
   * Busca agentes com WhatsApp oficial
   */
  async getAgentsWithWhatsApp() {
    const agents = await this.listAgents()
    return agents.filter(agent => agent.official_whatsapp_number_id)
  }

  /**
   * Busca estatísticas do agente
   */
  async getAgentStats(agentId) {
    const adapter = await this.ensureAdapter()
    
    // Buscar oportunidades do agente
    const opportunities = await adapter.findMany('opportunities', {
      filters: {
        agent_id: agentId,
        deleted_at: null
      }
    })

    // Buscar contatos do agente
    const contacts = await adapter.findMany('contacts', {
      filters: {
        agent_id: agentId,
        deleted_at: null
      }
    })

    const wonOpportunities = opportunities.filter(o => o.status === 'won')
    const activeOpportunities = opportunities.filter(o => o.status === 'active')

    const totalValue = opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0)
    const convertedValue = wonOpportunities.reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0)

    return {
      total_opportunities: opportunities.length,
      active_opportunities: activeOpportunities.length,
      won_opportunities: wonOpportunities.length,
      total_contacts: contacts.length,
      total_value: totalValue,
      converted_value: convertedValue,
      conversion_rate: opportunities.length > 0 ? (wonOpportunities.length / opportunities.length) * 100 : 0
    }
  }

  /**
   * Incrementa tokens usados
   */
  async incrementTokensUsed(agentId, tokensUsed) {
    const adapter = await this.ensureAdapter()
    
    const agent = await adapter.findById(this.resource, agentId)
    if (!agent) {
      throw new Error('Agente não encontrado')
    }

    return await adapter.update(this.resource, agentId, {
      token_used: (agent.token_used || 0) + tokensUsed,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Atualiza prompt do agente
   */
  async updatePrompt(agentId, prompt) {
    return await this.updateAgent(agentId, { prompt })
  }

  /**
   * Atualiza tom de voz
   */
  async updateToneOfVoice(agentId, toneOfVoice) {
    return await this.updateAgent(agentId, { tone_of_voice: toneOfVoice })
  }

  /**
   * Atualiza modelo de IA
   */
  async updateAIModel(agentId, aiModel) {
    return await this.updateAgent(agentId, { ai_model: aiModel })
  }
}

// Export singleton
export const agentsService = new AgentsService()

export default agentsService
