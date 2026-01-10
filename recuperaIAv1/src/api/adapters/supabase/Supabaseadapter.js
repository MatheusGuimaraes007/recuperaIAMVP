/**
 * SupabaseAdapter - Implementação para Supabase (CORRIGIDO)
 *
 * Implementa todos os métodos do BaseAdapter usando Supabase.
 * CORREÇÃO: Expõe objeto `auth` com métodos de autenticação
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

        // ⭐ NOVO: Objeto auth será inicializado após o client
        this.auth = null
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

            // ⭐ CORREÇÃO PRINCIPAL: Criar objeto auth com métodos wrapper
            this.auth = {
                /**
                 * SignIn - Login com email e senha
                 */
                signIn: async (email, password) => {
                    try {
                        const { data, error } = await this.client.auth.signInWithPassword({
                            email,
                            password
                        })

                        if (error) {
                            return { data: null, error }
                        }

                        return { data, error: null }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * SignUp - Registro de novo usuário
                 */
                signUp: async (email, password, options = {}) => {
                    try {
                        const { data, error } = await this.client.auth.signUp({
                            email,
                            password,
                            options
                        })

                        if (error) {
                            return { data: null, error }
                        }

                        return { data, error: null }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * SignOut - Logout
                 */
                signOut: async () => {
                    try {
                        const { error } = await this.client.auth.signOut()
                        return { error }
                    } catch (err) {
                        return { error: err }
                    }
                },

                /**
                 * GetSession - Obter sessão atual
                 */
                getSession: async () => {
                    try {
                        const { data, error } = await this.client.auth.getSession()
                        return { data, error }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * GetUser - Obter usuário atual
                 */
                getUser: async () => {
                    try {
                        const { data, error } = await this.client.auth.getUser()
                        return { data, error }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * RefreshSession - Renovar sessão
                 */
                refreshSession: async () => {
                    try {
                        const { data, error } = await this.client.auth.refreshSession()
                        return { data, error }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * ResetPasswordForEmail - Enviar email de recuperação
                 */
                resetPasswordForEmail: async (email, options = {}) => {
                    try {
                        const { data, error } = await this.client.auth.resetPasswordForEmail(
                            email,
                            options
                        )
                        return { data, error }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * UpdateUser - Atualizar usuário (incluindo senha)
                 */
                updateUser: async (attributes) => {
                    try {
                        const { data, error } = await this.client.auth.updateUser(attributes)
                        return { data, error }
                    } catch (err) {
                        return { data: null, error: err }
                    }
                },

                /**
                 * OnAuthStateChange - Listener de mudanças de autenticação
                 */
                onAuthStateChange: (callback) => {
                    const { data: { subscription } } = this.client.auth.onAuthStateChange(
                        (event, session) => {
                            callback(event, session)
                        }
                    )

                    // Retorna função para cancelar inscrição
                    return () => {
                        subscription?.unsubscribe()
                    }
                }
            }

            console.log('✅ SupabaseAdapter inicializado com auth wrapper')
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
                        query = query[value.operator](key, value.value)
                    } else {
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

            if (error) {
                return { data: null, error }
            }

            return { data: data || [], error: null }
        } catch (error) {
            console.error(`Erro ao buscar ${resource}:`, error)
            return { data: null, error }
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
                    return { data: null, error: null }
                }
                return { data: null, error }
            }

            return { data, error: null }
        } catch (error) {
            console.error(`Erro ao buscar ${resource} por ID:`, error)
            return { data: null, error }
        }
    }

    /**
     * Busca um único registro com filtros
     */
    async findOne(resource, options = {}) {
        this.validateResource(resource)

        try {
            const { filters = {} } = options

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
                    return { data: null, error: null }
                }
                return { data: null, error }
            }

            return { data, error: null }
        } catch (error) {
            console.error(`Erro ao buscar ${resource}:`, error)
            return { data: null, error }
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

            if (error) {
                return { data: null, error }
            }

            return { data: result, error: null }
        } catch (error) {
            console.error(`Erro ao criar ${resource}:`, error)
            return { data: null, error }
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

            if (error) {
                return { data: null, error }
            }

            return { data: result, error: null }
        } catch (error) {
            console.error(`Erro ao atualizar ${resource}:`, error)
            return { data: null, error }
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

            if (error) {
                return { error }
            }

            return { error: null }
        } catch (error) {
            console.error(`Erro ao deletar ${resource}:`, error)
            return { error }
        }
    }

    // ============================================================================
    // MÉTODOS LEGADOS (Mantidos para compatibilidade)
    // ============================================================================

    async login({ email, password }) {
        return await this.auth.signIn(email, password)
    }

    async logout() {
        return await this.auth.signOut()
    }

    async register({ email, password, ...metadata }) {
        return await this.auth.signUp(email, password, {
            data: metadata
        })
    }

    async getCurrentUser() {
        const result = await this.auth.getUser()
        return result.data?.user || null
    }

    async resetPassword(email) {
        return await this.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
    }

    onAuthStateChange(callback) {
        return this.auth.onAuthStateChange(callback)
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

            if (error) {
                return { data: null, error }
            }

            const publicUrl = this.getPublicUrl(bucket, path)

            return {
                data: {
                    path: data.path,
                    url: publicUrl
                },
                error: null
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error)
            return { data: null, error }
        }
    }

    async deleteFile(bucket, path) {
        try {
            const { error } = await this.client.storage
                .from(bucket)
                .remove([path])

            return { error }
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error)
            return { error }
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

        return () => {
            this.client.removeChannel(channel)
        }
    }

    // ============================================================================
    // RPC (Remote Procedure Call)
    // ============================================================================

    async rpc(functionName, params = {}) {
        try {
            const { data, error } = await this.client.rpc(functionName, params)

            if (error) {
                return { data: null, error }
            }

            return { data, error: null }
        } catch (error) {
            console.error(`Erro ao chamar função ${functionName}:`, error)
            return { data: null, error }
        }
    }
}

export default SupabaseAdapter