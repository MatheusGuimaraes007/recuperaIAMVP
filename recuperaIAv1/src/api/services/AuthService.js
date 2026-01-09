/**
 * AuthService - Serviço de Autenticação
 *
 * Gerencia autenticação de usuários usando adapter pattern.
 * Integrado com TanStack Query para cache e state management.
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 */

import { getAdapter } from '../adapters'

export class AuthService {
    constructor() {
        this.adapter = null
        this.authStateListeners = []
    }

    /**
     * Garante que o adapter está inicializado
     */
    async ensureAdapter() {
        if (!this.adapter) {
            this.adapter = await getAdapter()
        }
        return this.adapter
    }

    // ============================================================================
    // AUTENTICAÇÃO
    // ============================================================================

    /**
     * Login com email e senha
     *
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<{success: boolean, session?: object, user?: object, error?: string}>}
     */
    async login(email, password) {
        const adapter = await this.ensureAdapter()

        try {
            console.log('🔐 Iniciando login...')

            // 1. Autenticar no Supabase Auth
            const authResult = await adapter.auth.signIn(email, password)

            if (authResult.error) {
                throw authResult.error
            }

            if (!authResult.data?.session) {
                throw new Error('Sessão não foi criada')
            }

            console.log('✅ Autenticação realizada')

            // 2. Buscar dados do usuário na tabela users
            const userData = await this.fetchUserData(authResult.data.user.id)

            if (!userData) {
                console.warn('⚠️ Usuário autenticado mas não encontrado na tabela users')
            }

            console.log('✅ Login completo')

            return {
                success: true,
                session: authResult.data.session,
                user: userData
            }

        } catch (error) {
            console.error('❌ Erro no login:', error)

            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Registrar novo usuário
     *
     * @param {object} userData - Dados do usuário
     * @param {string} userData.email - Email
     * @param {string} userData.password - Senha
     * @param {string} userData.name - Nome completo
     * @param {string} [userData.phone] - Telefone (opcional)
     * @param {string} [userData.role] - Role (default: 'user')
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async register(userData) {
        const adapter = await this.ensureAdapter()

        try {
            console.log('📝 Iniciando registro...')

            // Validações básicas
            if (!userData.email || !userData.password || !userData.name) {
                throw new Error('Email, senha e nome são obrigatórios')
            }

            if (userData.password.length < 6) {
                throw new Error('A senha deve ter no mínimo 6 caracteres')
            }

            // 1. Criar usuário no Supabase Auth
            const authResult = await adapter.auth.signUp(
                userData.email,
                userData.password,
                {
                    data: {
                        name: userData.name,
                        phone: userData.phone
                    }
                }
            )

            if (authResult.error) {
                throw authResult.error
            }

            if (!authResult.data?.user) {
                throw new Error('Usuário não foi criado no Auth')
            }

            console.log('✅ Usuário criado no Auth')

            // 2. Criar registro na tabela users
            const userRecord = await adapter.create('users', {
                auth_uuid: authResult.data.user.id,
                email: userData.email,
                name: userData.name,
                phone: userData.phone || null,
                role: userData.role || 'user',
                status: 'trial'
            })

            if (userRecord.error) {
                // Se falhar ao criar na tabela, tentar deletar do Auth
                console.error('❌ Erro ao criar na tabela users, limpando Auth...')
                // TODO: Implementar rollback
                throw userRecord.error
            }

            console.log('✅ Registro completo')

            return {
                success: true,
                user: userRecord.data
            }

        } catch (error) {
            console.error('❌ Erro no registro:', error)

            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Logout
     *
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async logout() {
        const adapter = await this.ensureAdapter()

        try {
            console.log('🚪 Fazendo logout...')

            const result = await adapter.auth.signOut()

            if (result.error) {
                throw result.error
            }

            console.log('✅ Logout realizado')

            return {
                success: true
            }

        } catch (error) {
            console.error('❌ Erro no logout:', error)

            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Recuperar senha (enviar email)
     *
     * @param {string} email - Email para recuperação
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    async resetPassword(email) {
        const adapter = await this.ensureAdapter()

        try {
            console.log('📧 Enviando email de recuperação...')

            if (!email) {
                throw new Error('Email é obrigatório')
            }

            const redirectTo = `${window.location.origin}/reset-password`

            const result = await adapter.auth.resetPasswordForEmail(email, {
                redirectTo
            })

            if (result.error) {
                throw result.error
            }

            console.log('✅ Email enviado')

            return {
                success: true,
                message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
            }

        } catch (error) {
            console.error('❌ Erro ao resetar senha:', error)

            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Atualizar senha (com token de reset)
     *
     * @param {string} newPassword - Nova senha
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    async updatePassword(newPassword) {
        const adapter = await this.ensureAdapter()

        try {
            console.log('🔑 Atualizando senha...')

            if (!newPassword) {
                throw new Error('Nova senha é obrigatória')
            }

            if (newPassword.length < 6) {
                throw new Error('A senha deve ter no mínimo 6 caracteres')
            }

            const result = await adapter.auth.updateUser({
                password: newPassword
            })

            if (result.error) {
                throw result.error
            }

            console.log('✅ Senha atualizada')

            return {
                success: true,
                message: 'Senha atualizada com sucesso!'
            }

        } catch (error) {
            console.error('❌ Erro ao atualizar senha:', error)

            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    // ============================================================================
    // SESSÃO
    // ============================================================================

    /**
     * Obter sessão atual
     *
     * @returns {Promise<{success: boolean, session?: object, error?: string}>}
     */
    async getSession() {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.auth.getSession()

            return {
                success: true,
                session: result.data?.session || null
            }

        } catch (error) {
            console.error('❌ Erro ao obter sessão:', error)

            return {
                success: false,
                session: null,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Renovar sessão
     *
     * @returns {Promise<{success: boolean, session?: object, error?: string}>}
     */
    async refreshSession() {
        const adapter = await this.ensureAdapter()

        try {
            console.log('🔄 Renovando sessão...')

            const result = await adapter.auth.refreshSession()

            if (result.error) {
                throw result.error
            }

            console.log('✅ Sessão renovada')

            return {
                success: true,
                session: result.data?.session || null
            }

        } catch (error) {
            console.error('❌ Erro ao renovar sessão:', error)

            return {
                success: false,
                session: null,
                error: this.normalizeAuthError(error)
            }
        }
    }

    // ============================================================================
    // DADOS DO USUÁRIO
    // ============================================================================

    /**
     * Buscar dados do usuário na tabela users
     *
     * @param {string} authUuid - UUID do usuário no Auth
     * @returns {Promise<object|null>}
     */
    async fetchUserData(authUuid) {
        const adapter = await this.ensureAdapter()

        try {
            if (!authUuid) {
                console.warn('⚠️ authUuid não fornecido')
                return null
            }

            const result = await adapter.findOne('users', {
                filters: { auth_uuid: authUuid }
            })

            if (result.error) {
                throw result.error
            }

            return result.data || null

        } catch (error) {
            console.error('❌ Erro ao buscar dados do usuário:', error)
            return null
        }
    }

    /**
     * Atualizar perfil do usuário
     *
     * @param {number} userId - ID do usuário na tabela users
     * @param {object} data - Dados para atualizar
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async updateProfile(userId, data) {
        const adapter = await this.ensureAdapter()

        try {
            console.log('✏️ Atualizando perfil...')

            if (!userId) {
                throw new Error('ID do usuário é obrigatório')
            }

            // Remover campos que não devem ser atualizados diretamente
            const { id, auth_uuid, email, created_at, ...updateData } = data

            const result = await adapter.update('users', userId, updateData)

            if (result.error) {
                throw result.error
            }

            console.log('✅ Perfil atualizado')

            return {
                success: true,
                user: result.data
            }

        } catch (error) {
            console.error('❌ Erro ao atualizar perfil:', error)

            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    // ============================================================================
    // VERIFICAÇÕES
    // ============================================================================

    /**
     * Verificar se email já existe
     *
     * @param {string} email - Email para verificar
     * @returns {Promise<{exists: boolean, user?: object}>}
     */
    async checkEmailExists(email) {
        const adapter = await this.ensureAdapter()

        try {
            if (!email) {
                return { exists: false, user: null }
            }

            const result = await adapter.findOne('users', {
                filters: { email }
            })

            return {
                exists: !!result.data,
                user: result.data || null
            }

        } catch (error) {
            console.error('❌ Erro ao verificar email:', error)
            return { exists: false, user: null }
        }
    }

    // ============================================================================
    // AUTH STATE LISTENER
    // ============================================================================

    /**
     * Escutar mudanças de autenticação
     *
     * @param {Function} callback - Callback (event, session) => void
     * @returns {Function} Unsubscribe function
     */
    onAuthStateChange(callback) {
        if (!this.adapter?.auth?.onAuthStateChange) {
            console.warn('⚠️ onAuthStateChange não disponível no adapter')
            return () => {}
        }

        return this.adapter.auth.onAuthStateChange(callback)
    }

    // ============================================================================
    // HELPERS
    // ============================================================================

    /**
     * Normalizar erros de autenticação para mensagens amigáveis
     *
     * @param {Error|object} error - Erro original
     * @returns {string} Mensagem amigável
     */
    normalizeAuthError(error) {
        const errorMessage = error?.message || error?.toString() || 'Erro desconhecido'

        // Erros de login
        if (errorMessage.includes('Invalid login credentials')) {
            return 'Email ou senha incorretos. Tente novamente.'
        }
        if (errorMessage.includes('Email not confirmed')) {
            return 'Email não confirmado. Verifique sua caixa de entrada.'
        }
        if (errorMessage.includes('User not found')) {
            return 'Usuário não encontrado. Verifique o email digitado.'
        }

        // Erros de registro
        if (error.code === '23505' || errorMessage.includes('already registered')) {
            return 'Este email já está cadastrado. Tente fazer login.'
        }
        if (errorMessage.includes('Password should be at least')) {
            return 'A senha deve ter no mínimo 6 caracteres.'
        }
        if (errorMessage.includes('Invalid email')) {
            return 'Email inválido. Verifique o formato.'
        }

        // Erros de recuperação de senha
        if (errorMessage.includes('Email rate limit exceeded')) {
            return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
        }

        // Erros de sessão
        if (errorMessage.includes('JWT expired') || errorMessage.includes('refresh_token')) {
            return 'Sessão expirada. Faça login novamente.'
        }

        // Erro genérico
        return errorMessage
    }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const authService = new AuthService()

export default authService