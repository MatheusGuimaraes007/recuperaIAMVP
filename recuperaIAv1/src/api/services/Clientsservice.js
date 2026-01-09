/**
 * ClientsService - Serviço de Clientes
 *
 * Exemplo de serviço que usa o adapter.
 * Encapsula lógica de negócio específica de clientes.
 */

import { getAdapter } from '../adapters'
import { RESOURCES } from '../config'

export class ClientsService {
    constructor() {
        this.adapter = null
        this.resource = RESOURCES.CLIENTS
    }

    /**
     * Inicializa o serviço
     */
    async initialize() {
        this.adapter = await getAdapter()
    }

    /**
     * Garante que adapter está inicializado
     */
    async ensureAdapter() {
        if (!this.adapter) {
            await this.initialize()
        }
        return this.adapter
    }

    // ============================================================================
    // CRUD OPERATIONS
    // ============================================================================

    /**
     * Lista todos os clientes
     * @param {Object} options - Opções de filtro, ordenação, paginação
     * @returns {Promise<Array>}
     */
    async listClients(options = {}) {
        const adapter = await this.ensureAdapter()

        const clients = await adapter.findMany(this.resource, {
            ...options,
            order: options.order || { column: 'name', ascending: true }
        })

        return clients
    }

    /**
     * Busca cliente por ID
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    async getClientById(id) {
        const adapter = await this.ensureAdapter()
        return await adapter.findById(this.resource, id)
    }

    /**
     * Busca cliente por e-mail
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    async getClientByEmail(email) {
        const adapter = await this.ensureAdapter()
        return await adapter.findOne(this.resource, { email })
    }

    /**
     * Cria novo cliente
     * @param {Object} clientData
     * @returns {Promise<Object>}
     */
    async createClient(clientData) {
        const adapter = await this.ensureAdapter()

        // Validações de negócio
        if (!clientData.name) {
            throw new Error('Nome é obrigatório')
        }
        if (!clientData.email) {
            throw new Error('E-mail é obrigatório')
        }

        // Verificar se e-mail já existe
        const existing = await this.getClientByEmail(clientData.email)
        if (existing) {
            throw new Error('E-mail já cadastrado')
        }

        // Criar cliente
        const client = await adapter.create(this.resource, {
            ...clientData,
            status: clientData.status || 'active',
            created_at: new Date().toISOString()
        })

        return client
    }

    /**
     * Atualiza cliente
     * @param {string} id
     * @param {Object} updates
     * @returns {Promise<Object>}
     */
    async updateClient(id, updates) {
        const adapter = await this.ensureAdapter()

        // Verificar se cliente existe
        const existing = await this.getClientById(id)
        if (!existing) {
            throw new Error('Cliente não encontrado')
        }

        // Atualizar
        const client = await adapter.update(this.resource, id, {
            ...updates,
            updated_at: new Date().toISOString()
        })

        return client
    }

    /**
     * Deleta cliente
     * @param {string} id
     * @returns {Promise<void>}
     */
    async deleteClient(id) {
        const adapter = await this.ensureAdapter()

        // Verificar se cliente existe
        const existing = await this.getClientById(id)
        if (!existing) {
            throw new Error('Cliente não encontrado')
        }

        await adapter.delete(this.resource, id)
    }

    // ============================================================================
    // BUSINESS LOGIC
    // ============================================================================

    /**
     * Busca clientes ativos
     * @returns {Promise<Array>}
     */
    async getActiveClients() {
        return await this.listClients({
            filters: { status: 'active' }
        })
    }

    /**
     * Busca clientes por status
     * @param {string} status
     * @returns {Promise<Array>}
     */
    async getClientsByStatus(status) {
        return await this.listClients({
            filters: { status }
        })
    }

    /**
     * Busca clientes criados hoje
     * @returns {Promise<Array>}
     */
    async getTodaysClients() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return await this.listClients({
            filters: {
                created_at: {
                    operator: 'gte',
                    value: today.toISOString()
                }
            }
        })
    }

    /**
     * Conta total de clientes
     * @returns {Promise<number>}
     */
    async countClients() {
        const clients = await this.listClients()
        return clients.length
    }

    /**
     * Ativa cliente
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async activateClient(id) {
        return await this.updateClient(id, { status: 'active' })
    }

    /**
     * Desativa cliente
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async deactivateClient(id) {
        return await this.updateClient(id, { status: 'inactive' })
    }

    // ============================================================================
    // REALTIME
    // ============================================================================

    /**
     * Inscreve em mudanças de clientes
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    subscribeToClients(callback) {
        if (!this.adapter) {
            throw new Error('Adapter não inicializado')
        }

        return this.adapter.subscribe(this.resource, callback)
    }
}

// Export singleton
export const clientsService = new ClientsService()

export default clientsService