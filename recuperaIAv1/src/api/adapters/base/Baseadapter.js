/**
 * BaseAdapter - Interface Abstrata para Adaptadores de API
 *
 * Define a interface que todos os adaptadores devem implementar.
 * Garante que Supabase e Backend tenham a mesma API.
 *
 * @abstract
 */

export class BaseAdapter {
    constructor(config = {}) {
        if (new.target === BaseAdapter) {
            throw new Error('BaseAdapter é uma classe abstrata e não pode ser instanciada diretamente')
        }

        this.config = config
        this.client = null
    }

    // ============================================================================
    // MÉTODOS ABSTRATOS - DEVEM SER IMPLEMENTADOS
    // ============================================================================

    /**
     * Inicializa o cliente/conexão
     * @abstract
     * @returns {Promise<void>}
     */
    async initialize() {
        throw new Error('Método initialize() deve ser implementado')
    }

    /**
     * Retorna o cliente inicializado
     * @abstract
     * @returns {any}
     */
    getClient() {
        throw new Error('Método getClient() deve ser implementado')
    }

    // ============================================================================
    // CRUD OPERATIONS
    // ============================================================================

    /**
     * Busca múltiplos registros
     * @abstract
     * @param {string} resource - Nome do recurso/tabela
     * @param {Object} options - Opções de filtro, ordenação, paginação
     * @returns {Promise<Array>}
     */
    async findMany(resource, options = {}) {
        throw new Error('Método findMany() deve ser implementado')
    }

    /**
     * Busca um único registro por ID
     * @abstract
     * @param {string} resource - Nome do recurso/tabela
     * @param {string|number} id - ID do registro
     * @returns {Promise<Object|null>}
     */
    async findById(resource, id) {
        throw new Error('Método findById() deve ser implementado')
    }

    /**
     * Busca um único registro com filtros
     * @abstract
     * @param {string} resource - Nome do recurso/tabela
     * @param {Object} filters - Filtros
     * @returns {Promise<Object|null>}
     */
    async findOne(resource, filters = {}) {
        throw new Error('Método findOne() deve ser implementado')
    }

    /**
     * Cria um novo registro
     * @abstract
     * @param {string} resource - Nome do recurso/tabela
     * @param {Object} data - Dados do registro
     * @returns {Promise<Object>}
     */
    async create(resource, data) {
        throw new Error('Método create() deve ser implementado')
    }

    /**
     * Atualiza um registro existente
     * @abstract
     * @param {string} resource - Nome do recurso/tabela
     * @param {string|number} id - ID do registro
     * @param {Object} data - Dados para atualizar
     * @returns {Promise<Object>}
     */
    async update(resource, id, data) {
        throw new Error('Método update() deve ser implementado')
    }

    /**
     * Deleta um registro
     * @abstract
     * @param {string} resource - Nome do recurso/tabela
     * @param {string|number} id - ID do registro
     * @returns {Promise<void>}
     */
    async delete(resource, id) {
        throw new Error('Método delete() deve ser implementado')
    }

    // ============================================================================
    // AUTENTICAÇÃO
    // ============================================================================

    /**
     * Faz login
     * @abstract
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} { user, session }
     */
    async login(credentials) {
        throw new Error('Método login() deve ser implementado')
    }

    /**
     * Faz logout
     * @abstract
     * @returns {Promise<void>}
     */
    async logout() {
        throw new Error('Método logout() deve ser implementado')
    }

    /**
     * Registra novo usuário
     * @abstract
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<Object>}
     */
    async register(userData) {
        throw new Error('Método register() deve ser implementado')
    }

    /**
     * Retorna usuário autenticado atual
     * @abstract
     * @returns {Promise<Object|null>}
     */
    async getCurrentUser() {
        throw new Error('Método getCurrentUser() deve ser implementado')
    }

    /**
     * Reseta senha
     * @abstract
     * @param {string} email - E-mail do usuário
     * @returns {Promise<void>}
     */
    async resetPassword(email) {
        throw new Error('Método resetPassword() deve ser implementado')
    }

    // ============================================================================
    // STORAGE (Upload de arquivos)
    // ============================================================================

    /**
     * Faz upload de arquivo
     * @abstract
     * @param {string} bucket - Nome do bucket
     * @param {string} path - Caminho do arquivo
     * @param {File} file - Arquivo
     * @returns {Promise<Object>} { url, path }
     */
    async uploadFile(bucket, path, file) {
        throw new Error('Método uploadFile() deve ser implementado')
    }

    /**
     * Deleta arquivo
     * @abstract
     * @param {string} bucket - Nome do bucket
     * @param {string} path - Caminho do arquivo
     * @returns {Promise<void>}
     */
    async deleteFile(bucket, path) {
        throw new Error('Método deleteFile() deve ser implementado')
    }

    /**
     * Retorna URL pública do arquivo
     * @abstract
     * @param {string} bucket - Nome do bucket
     * @param {string} path - Caminho do arquivo
     * @returns {string}
     */
    getPublicUrl(bucket, path) {
        throw new Error('Método getPublicUrl() deve ser implementado')
    }

    // ============================================================================
    // REALTIME (Opcional)
    // ============================================================================

    /**
     * Inscreve em mudanças em tempo real
     * @abstract
     * @param {string} resource - Nome do recurso
     * @param {Function} callback - Callback para mudanças
     * @returns {Function} Função para cancelar inscrição
     */
    subscribe(resource, callback) {
        throw new Error('Método subscribe() não implementado neste adapter')
    }

    // ============================================================================
    // HELPERS
    // ============================================================================

    /**
     * Verifica se adapter está inicializado
     * @returns {boolean}
     */
    isInitialized() {
        return this.client !== null
    }

    /**
     * Valida se recurso existe
     * @param {string} resource
     */
    validateResource(resource) {
        if (!resource || typeof resource !== 'string') {
            throw new Error('Resource name é obrigatório e deve ser string')
        }
    }

    /**
     * Valida ID
     * @param {string|number} id
     */
    validateId(id) {
        if (!id) {
            throw new Error('ID é obrigatório')
        }
    }
}

export default BaseAdapter