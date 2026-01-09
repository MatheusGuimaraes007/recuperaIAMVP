/**
 * SupabaseAdapter - Implementação para Supabase
 *
 * Implementa todos os métodos do BaseAdapter usando Supabase.
 */

import { createClient } from '@supabase/supabase-js'
import BaseAdapter from "@api/adapters/base/Baseadapter.js";


export class SupabaseAdapter extends BaseAdapter {
    constructor(config = {}) {
        super(config)

        this.supabaseUrl = config.url || import.meta.env.VITE_SUPABASE_URL
        this.supabaseKey = config.key || import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!this.supabaseUrl || !this.supabaseKey) {
            throw new Error('Supabase URL e Key são obrigatórios')
        }
    }

    // ============================================================================
    // INICIALIZAÇÃO
    // ============================================================================

    async initialize() {
        if (this.client) {
            console.warn('SupabaseAdapter já está inicializado')
            return
        }

        try {
            this.client = createClient(this.supabaseUrl, this.supabaseKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            })

            console.log('✅ SupabaseAdapter inicializado')
        } catch (error) {
            console.error('❌ Erro ao inicializar SupabaseAdapter:', error)
            throw error
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error('SupabaseAdapter não inicializado. Chame initialize() primeiro.')
        }
        return this.client
    }

    // ============================================================================
    // CRUD OPERATIONS
    // ============================================================================

    /**
     * Busca múltiplos registros
     * @param {string} resource - Nome da tabela
     * @param {Object} options - { filters, order, limit, offset, select }
     * @returns {Promise<Array>}
     */
    async findMany(resource, options = {}) {
        this.validateResource(resource)

        try {
            const {
                filters = {},
                order = { column: 'created_at', ascending: false },
                limit = null,
                offset = null,
                select = '*'
            } = options

            let query = this.client
                .from(resource)
                .select(select)

            // Aplicar filtros
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (typeof value === 'object' && value.operator) {
                        // Filtro avançado: { operator: 'gte', value: 10 }
                        query = query[value.operator](key, value.value)
                    } else {
                        // Filtro simples: { status: 'active' }
                        query = query.eq(key, value)
                    }
                }
            })

            // Ordenação
            if (order) {
                query = query.order(order.column, { ascending: order.ascending })
            }

            // Paginação
            if (limit) {
                query = query.limit(limit)
            }
            if (offset) {
                query = query.range(offset, offset + (limit || 10) - 1)
            }

            const { data, error } = await query

            if (error) throw error

            return data || []
        } catch (error) {
            console.error(`Erro ao buscar ${resource}:`, error)
            throw error
        }
    }

    /**
     * Busca um único registro por ID
     */
    async findById(resource, id) {
        this.validateResource(resource)
        this.validateId(id)

        try {
            const { data, error } = await this.client
                .from(resource)
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    // Nenhum registro encontrado
                    return null
                }
                throw error
            }

            return data
        } catch (error) {
            console.error(`Erro ao buscar ${resource} por ID:`, error)
            throw error
        }
    }

    /**
     * Busca um único registro com filtros
     */
    async findOne(resource, filters = {}) {
        this.validateResource(resource)

        try {
            let query = this.client
                .from(resource)
                .select('*')

            // Aplicar filtros
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query = query.eq(key, value)
                }
            })

            const { data, error } = await query.single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return null
                }
                throw error
            }

            return data
        } catch (error) {
            console.error(`Erro ao buscar ${resource}:`, error)
            throw error
        }
    }

    /**
     * Cria um novo registro
     */
    async create(resource, data) {
        this.validateResource(resource)

        if (!data || typeof data !== 'object') {
            throw new Error('Data é obrigatório e deve ser um objeto')
        }

        try {
            const { data: result, error } = await this.client
                .from(resource)
                .insert(data)
                .select()
                .single()

            if (error) throw error

            return result
        } catch (error) {
            console.error(`Erro ao criar ${resource}:`, error)
            throw error
        }
    }

    /**
     * Atualiza um registro existente
     */
    async update(resource, id, data) {
        this.validateResource(resource)
        this.validateId(id)

        if (!data || typeof data !== 'object') {
            throw new Error('Data é obrigatório e deve ser um objeto')
        }

        try {
            const { data: result, error } = await this.client
                .from(resource)
                .update(data)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return result
        } catch (error) {
            console.error(`Erro ao atualizar ${resource}:`, error)
            throw error
        }
    }

    /**
     * Deleta um registro
     */
    async delete(resource, id) {
        this.validateResource(resource)
        this.validateId(id)

        try {
            const { error } = await this.client
                .from(resource)
                .delete()
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            console.error(`Erro ao deletar ${resource}:`, error)
            throw error
        }
    }

    // ============================================================================
    // AUTENTICAÇÃO
    // ============================================================================

    async login({ email, password }) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            return {
                user: data.user,
                session: data.session
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            throw error
        }
    }

    async logout() {
        try {
            const { error } = await this.client.auth.signOut()
            if (error) throw error
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
            throw error
        }
    }

    async register({ email, password, ...metadata }) {
        try {
            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            })

            if (error) throw error

            return {
                user: data.user,
                session: data.session
            }
        } catch (error) {
            console.error('Erro ao registrar usuário:', error)
            throw error
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.client.auth.getUser()

            if (error) throw error

            return user
        } catch (error) {
            console.error('Erro ao buscar usuário atual:', error)
            return null
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (error) throw error
        } catch (error) {
            console.error('Erro ao resetar senha:', error)
            throw error
        }
    }

    /**
     * Listener para mudanças no estado de autenticação
     */
    onAuthStateChange(callback) {
        return this.client.auth.onAuthStateChange((event, session) => {
            callback(event, session)
        })
    }

    // ============================================================================
    // STORAGE
    // ============================================================================

    async uploadFile(bucket, path, file) {
        try {
            const { data, error } = await this.client.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            const publicUrl = this.getPublicUrl(bucket, path)

            return {
                path: data.path,
                url: publicUrl
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error)
            throw error
        }
    }

    async deleteFile(bucket, path) {
        try {
            const { error } = await this.client.storage
                .from(bucket)
                .remove([path])

            if (error) throw error
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error)
            throw error
        }
    }

    getPublicUrl(bucket, path) {
        const { data } = this.client.storage
            .from(bucket)
            .getPublicUrl(path)

        return data.publicUrl
    }

    // ============================================================================
    // REALTIME
    // ============================================================================

    subscribe(resource, callback) {
        const channel = this.client
            .channel(`${resource}-changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: resource
                },
                (payload) => {
                    callback(payload)
                }
            )
            .subscribe()

        // Retorna função para cancelar inscrição
        return () => {
            this.client.removeChannel(channel)
        }
    }

    // ============================================================================
    // RPC (Remote Procedure Call)
    // ============================================================================

    /**
     * Chama função do banco de dados
     */
    async rpc(functionName, params = {}) {
        try {
            const { data, error } = await this.client.rpc(functionName, params)

            if (error) throw error

            return data
        } catch (error) {
            console.error(`Erro ao chamar função ${functionName}:`, error)
            throw error
        }
    }
}

export default SupabaseAdapter