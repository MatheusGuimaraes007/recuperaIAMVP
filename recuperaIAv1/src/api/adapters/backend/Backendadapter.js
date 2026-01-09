/**
 * Backendadapter - Implementação para Backend próprio
 *
 * ESTRUTURA VAZIA - Para ser implementado no futuro quando houver backend próprio.
 *
 * Quando implementar, este adapter fará requisições HTTP para sua API REST.
 * Exemplo: axios.get('/api/clients'), axios.post('/api/clients'), etc.
 */
import BaseAdapter from "@api/adapters/base/Baseadapter.js";


export class Backendadapter extends BaseAdapter {
    constructor(config = {}) {
        super(config)

        this.baseURL = config.baseURL || import.meta.env.VITE_API_BASE_URL
        this.timeout = config.timeout || 30000

        if (!this.baseURL) {
            throw new Error('Backend base URL é obrigatório')
        }
    }

    // ============================================================================
    // INICIALIZAÇÃO
    // ============================================================================

    async initialize() {
        // TODO: Inicializar cliente HTTP (axios, fetch, etc)
        // TODO: Configurar interceptors
        // TODO: Configurar headers padrão
        console.log('🚧 Backendadapter ainda não implementado')
        console.log('📝 Implementar quando houver backend próprio')
    }

    getClient() {
        throw new Error('Backendadapter ainda não implementado')
    }

    // ============================================================================
    // CRUD OPERATIONS - A IMPLEMENTAR
    // ============================================================================

    async findMany(resource, options = {}) {
        // TODO: GET /api/{resource}?filters=...&order=...&limit=...
        throw new Error('Backendadapter.findMany() não implementado')
    }

    async findById(resource, id) {
        // TODO: GET /api/{resource}/{id}
        throw new Error('Backendadapter.findById() não implementado')
    }

    async findOne(resource, filters = {}) {
        // TODO: GET /api/{resource}/find-one?filters=...
        throw new Error('Backendadapter.findOne() não implementado')
    }

    async create(resource, data) {
        // TODO: POST /api/{resource}
        throw new Error('Backendadapter.create() não implementado')
    }

    async update(resource, id, data) {
        // TODO: PUT /api/{resource}/{id}
        throw new Error('Backendadapter.update() não implementado')
    }

    async delete(resource, id) {
        // TODO: DELETE /api/{resource}/{id}
        throw new Error('Backendadapter.delete() não implementado')
    }

    // ============================================================================
    // AUTENTICAÇÃO - A IMPLEMENTAR
    // ============================================================================

    async login(credentials) {
        // TODO: POST /api/auth/login
        throw new Error('Backendadapter.login() não implementado')
    }

    async logout() {
        // TODO: POST /api/auth/logout
        throw new Error('Backendadapter.logout() não implementado')
    }

    async register(userData) {
        // TODO: POST /api/auth/register
        throw new Error('Backendadapter.register() não implementado')
    }

    async getCurrentUser() {
        // TODO: GET /api/auth/me
        throw new Error('Backendadapter.getCurrentUser() não implementado')
    }

    async resetPassword(email) {
        // TODO: POST /api/auth/reset-password
        throw new Error('Backendadapter.resetPassword() não implementado')
    }

    // ============================================================================
    // STORAGE - A IMPLEMENTAR
    // ============================================================================

    async uploadFile(bucket, path, file) {
        // TODO: POST /api/storage/upload
        throw new Error('Backendadapter.uploadFile() não implementado')
    }

    async deleteFile(bucket, path) {
        // TODO: DELETE /api/storage/{bucket}/{path}
        throw new Error('Backendadapter.deleteFile() não implementado')
    }

    getPublicUrl(bucket, path) {
        // TODO: Retornar URL pública do arquivo
        throw new Error('Backendadapter.getPublicUrl() não implementado')
    }

    // ============================================================================
    // REALTIME - A IMPLEMENTAR
    // ============================================================================

    subscribe(resource, callback) {
        // TODO: Implementar via WebSockets ou SSE
        throw new Error('Backendadapter.subscribe() não implementado')
    }
}

export default Backendadapter

/**
 * GUIA DE IMPLEMENTAÇÃO FUTURA
 * =============================
 *
 * 1. Instalar dependências:
 *    npm install axios
 *
 * 2. Inicializar cliente:
 *    import axios from 'axios'
 *    this.client = axios.create({
 *      baseURL: this.baseURL,
 *      timeout: this.timeout,
 *      headers: { 'Content-Type': 'application/json' }
 *    })
 *
 * 3. Configurar interceptors:
 *    // Request interceptor (adicionar token)
 *    this.client.interceptors.request.use(config => {
 *      const token = localStorage.getItem('token')
 *      if (token) {
 *        config.headers.Authorization = `Bearer ${token}`
 *      }
 *      return config
 *    })
 *
 *    // Response interceptor (tratar erros)
 *    this.client.interceptors.response.use(
 *      response => response.data,
 *      error => {
 *        if (error.response?.status === 401) {
 *          // Redirecionar para login
 *        }
 *        throw error
 *      }
 *    )
 *
 * 4. Implementar métodos:
 *    async findMany(resource, options) {
 *      const params = this.buildQueryParams(options)
 *      const response = await this.client.get(`/${resource}`, { params })
 *      return response.data
 *    }
 *
 * 5. Upload de arquivos:
 *    async uploadFile(bucket, path, file) {
 *      const formData = new FormData()
 *      formData.append('file', file)
 *      formData.append('bucket', bucket)
 *      formData.append('path', path)
 *
 *      const response = await this.client.post('/storage/upload', formData, {
 *        headers: { 'Content-Type': 'multipart/form-data' }
 *      })
 *
 *      return response.data
 *    }
 *
 * 6. Realtime via WebSocket:
 *    subscribe(resource, callback) {
 *      const ws = new WebSocket(`${this.wsURL}/${resource}`)
 *      ws.onmessage = (event) => {
 *        const data = JSON.parse(event.data)
 *        callback(data)
 *      }
 *      return () => ws.close()
 *    }
 */