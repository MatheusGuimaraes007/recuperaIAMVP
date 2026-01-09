/**
 * ProductsService - Serviço de Produtos
 * 
 * Gerencia produtos com conhecimento e treinamento de IA.
 */

import { getAdapter } from '../adapters'
import { RESOURCES } from '../config'

export class ProductsService {
  constructor() {
    this.adapter = null
    this.resource = RESOURCES.PRODUCTS
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
   * Lista todos os produtos
   */
  async listProducts(options = {}) {
    const adapter = await this.ensureAdapter()
    
    const {
      page = 1,
      limit = 50,
      includeDeleted = false,
      search = ''
    } = options

    const filters = {}
    
    if (!includeDeleted) {
      filters.deleted_at = null
    }

    let products = await adapter.findMany(this.resource, {
      filters,
      order: { column: 'created_at', ascending: false },
      limit,
      offset: (page - 1) * limit
    })

    // Filtrar por search
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim()
      products = products.filter(product => {
        const name = (product.name || '').toLowerCase()
        const description = (product.description || '').toLowerCase()
        
        return name.includes(searchTerm) || description.includes(searchTerm)
      })
    }

    return products
  }

  /**
   * Busca produto por ID
   */
  async getProductById(productId) {
    const adapter = await this.ensureAdapter()
    
    const product = await adapter.findById(this.resource, productId)
    
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    // Buscar knowledge bases
    product.knowledge_bases = await this.getProductKnowledgeBases(productId)

    // Buscar links de treinamento
    product.training_links = await this.getProductTrainingLinks(productId)

    // Buscar estatísticas
    product.stats = await this.getProductStats(productId)

    return product
  }

  /**
   * Cria novo produto
   */
  async createProduct(productData) {
    const adapter = await this.ensureAdapter()
    
    // Validações
    if (!productData.name) {
      throw new Error('Nome é obrigatório')
    }

    // Criar produto
    const product = await adapter.create(this.resource, {
      ...productData,
      total_revenue: 0,
      total_recovered: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return product
  }

  /**
   * Atualiza produto
   */
  async updateProduct(productId, updates) {
    const adapter = await this.ensureAdapter()
    
    const existing = await adapter.findById(this.resource, productId)
    if (!existing) {
      throw new Error('Produto não encontrado')
    }

    return await adapter.update(this.resource, productId, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Soft delete do produto
   */
  async deleteProduct(productId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update(this.resource, productId, {
      deleted_at: new Date().toISOString()
    })
  }

  /**
   * Restaura produto deletado
   */
  async restoreProduct(productId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update(this.resource, productId, {
      deleted_at: null,
      updated_at: new Date().toISOString()
    })
  }

  // ============================================================================
  // KNOWLEDGE BASES
  // ============================================================================

  /**
   * Busca knowledge bases do produto
   */
  async getProductKnowledgeBases(productId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.findMany('knowledge_bases', {
      filters: { product_id: productId },
      order: { column: 'created_at', ascending: false }
    })
  }

  /**
   * Cria knowledge base para produto
   */
  async createKnowledgeBase(productId, kbData) {
    const adapter = await this.ensureAdapter()
    
    const product = await adapter.findById(this.resource, productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    return await adapter.create('knowledge_bases', {
      ...kbData,
      product_id: productId,
      user_id: product.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  // ============================================================================
  // TRAINING LINKS
  // ============================================================================

  /**
   * Busca links de treinamento do produto
   */
  async getProductTrainingLinks(productId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.findMany('product_training_links', {
      filters: { product_id: productId },
      order: { column: 'created_at', ascending: false }
    })
  }

  /**
   * Adiciona link de treinamento
   */
  async addTrainingLink(productId, url) {
    const adapter = await this.ensureAdapter()
    
    const product = await adapter.findById(this.resource, productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    return await adapter.create('product_training_links', {
      product_id: productId,
      url,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Atualiza status do link de treinamento
   */
  async updateTrainingLinkStatus(linkId, status, extractedContent = null) {
    const adapter = await this.ensureAdapter()
    
    const updates = {
      status,
      updated_at: new Date().toISOString()
    }

    if (extractedContent) {
      updates.extracted_content = extractedContent
      updates.last_scraped_at = new Date().toISOString()
    }

    return await adapter.update('product_training_links', linkId, updates)
  }

  /**
   * Remove link de treinamento
   */
  async removeTrainingLink(linkId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.delete('product_training_links', linkId)
  }

  // ============================================================================
  // PRODUCT KNOWLEDGE ENTRIES
  // ============================================================================

  /**
   * Busca entradas de conhecimento do produto
   */
  async getProductKnowledgeEntries(productId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.findMany('product_knowledge_entries', {
      filters: {
        product_id: productId,
        is_active: true
      },
      order: { column: 'created_at', ascending: false }
    })
  }

  /**
   * Adiciona entrada de conhecimento
   */
  async addKnowledgeEntry(productId, entryData) {
    const adapter = await this.ensureAdapter()
    
    const product = await adapter.findById(this.resource, productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    return await adapter.create('product_knowledge_entries', {
      ...entryData,
      product_id: productId,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Atualiza entrada de conhecimento
   */
  async updateKnowledgeEntry(entryId, updates) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update('product_knowledge_entries', entryId, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Desativa entrada de conhecimento
   */
  async deactivateKnowledgeEntry(entryId) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update('product_knowledge_entries', entryId, {
      is_active: false,
      updated_at: new Date().toISOString()
    })
  }

  // ============================================================================
  // BUSINESS LOGIC
  // ============================================================================

  /**
   * Busca produtos ativos
   */
  async getActiveProducts() {
    const products = await this.listProducts()
    return products.filter(product => !product.deleted_at)
  }

  /**
   * Busca estatísticas do produto
   */
  async getProductStats(productId) {
    const adapter = await this.ensureAdapter()
    
    // Buscar oportunidades do produto
    const opportunities = await adapter.findMany('opportunities', {
      filters: {
        product_id: productId,
        deleted_at: null
      }
    })

    const wonOpportunities = opportunities.filter(o => o.status === 'won' || o.status === 'recovered')

    const totalRevenue = wonOpportunities.reduce((sum, o) => 
      sum + (parseFloat(o.converted_value || o.value) || 0), 0
    )

    return {
      total_opportunities: opportunities.length,
      won_opportunities: wonOpportunities.length,
      total_revenue: totalRevenue,
      conversion_rate: opportunities.length > 0 ? (wonOpportunities.length / opportunities.length) * 100 : 0
    }
  }

  /**
   * Atualiza texto de treinamento de IA
   */
  async updateAITrainingText(productId, trainingText) {
    return await this.updateProduct(productId, {
      ai_training_text: trainingText
    })
  }

  /**
   * Atualiza totais de receita
   */
  async updateRevenueTotals(productId, totalRevenue, totalRecovered) {
    return await this.updateProduct(productId, {
      total_revenue: totalRevenue,
      total_recovered: totalRecovered
    })
  }

  /**
   * Incrementa receita recuperada
   */
  async incrementRecovered(productId, amount) {
    const adapter = await this.ensureAdapter()
    
    const product = await adapter.findById(this.resource, productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const newRecovered = (parseFloat(product.total_recovered) || 0) + amount

    return await adapter.update(this.resource, productId, {
      total_recovered: newRecovered,
      updated_at: new Date().toISOString()
    })
  }
}

// Export singleton
export const productsService = new ProductsService()

export default productsService
