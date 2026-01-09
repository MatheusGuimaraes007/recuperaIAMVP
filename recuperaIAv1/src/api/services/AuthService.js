/**
 * AuthService - Serviço de Autenticação
 *
 * Gerencia autenticação de usuários usando Supabase Auth.
 * Integrado com TanStack Query para cache e state management.
 */

import { getAdapter } from '../adapters'

export class AuthService {
    constructor() {
        this.adapter = null
    }

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
     */
    async login(email, password) {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.auth.signIn(email, password)

            if (result.error) {
                throw result.error
            }

            // Buscar dados do usuário na tabela users
            if (result.data?.user) {
                const userData = await this.fetchUserData(result.data.user.id)

                return {
                    success: true,
                    session: result.data.session,
                    user: userData
                }
            }

            return {
                success: true,
                session: result.data.session,
                user: null
            }

        } catch (error) {
            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Registrar novo usuário
     */
    async register(userData) {
        const adapter = await this.ensureAdapter()

        try {
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

            // 2. Criar registro na tabela users
            const userRecord = await adapter.create('users', {
                auth_uuid: authResult.data.user.id,
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                role: userData.role || 'user',
                status: 'trial'
            })

            if (userRecord.error) {
                throw userRecord.error
            }

            return {
                success: true,
                user: userRecord.data
            }

        } catch (error) {
            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Logout
     */
    async logout() {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.auth.signOut()

            return {
                success: !result.error,
                error: result.error || null
            }
        } catch (error) {
            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Recuperar senha
     */
    async resetPassword(email) {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (result.error) {
                throw result.error
            }

            return {
                success: true,
                message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
            }

        } catch (error) {
            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Atualizar senha
     */
    async updatePassword(newPassword) {
        const adapter = await this.ensureAdapter()

        try {
            if (newPassword.length < 6) {
                throw new Error('A senha deve ter no mínimo 6 caracteres.')
            }

            const result = await adapter.auth.updateUser({
                password: newPassword
            })

            if (result.error) {
                throw result.error
            }

            return {
                success: true,
                message: 'Senha atualizada com sucesso!'
            }

        } catch (error) {
            return {
                success: false,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Obter sessão atual
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
            return {
                success: false,
                session: null,
                error: this.normalizeAuthError(error)
            }
        }
    }

    /**
     * Renovar sessão
     */
    async refreshSession() {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.auth.refreshSession()

            return {
                success: true,
                session: result.data?.session || null
            }
        } catch (error) {
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
     */
    async fetchUserData(authUuid) {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.findOne('users', {
                filters: { auth_uuid: authUuid }
            })

            if (result.error) {
                throw result.error
            }

            return result.data
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error)
            return null
        }
    }

    /**
     * Atualizar perfil do usuário
     */
    async updateProfile(userId, data) {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.update('users', userId, data)

            if (result.error) {
                throw result.error
            }

            return {
                success: true,
                user: result.data
            }
        } catch (error) {
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
     */
    async checkEmailExists(email) {
        const adapter = await this.ensureAdapter()

        try {
            const result = await adapter.findOne('users', {
                filters: { email }
            })

            return {
                exists: !!result.data,
                user: result.data
            }
        } catch (error) {
            return {
                exists: false,
                user: null
            }
        }
    }

    // ============================================================================
    // HELPERS
    // ============================================================================

    /**
     * Normalizar erros de autenticação para mensagens amigáveis
     */
    normalizeAuthError(error) {
        const errorMessage = error?.message || error?.toString() || 'Erro desconhecido'

        // Erros comuns de login
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

        // Erro genérico
        return errorMessage
    }

    /**
     * Setup de listener para mudanças de autenticação
     */
    onAuthStateChange(callback) {
        const adapter = this.adapter

        if (!adapter?.auth?.onAuthStateChange) {
            console.warn('onAuthStateChange não disponível no adapter')
            return () => {}
        }

        return adapter.auth.onAuthStateChange(callback)
    }
}

// Export singleton
export const authService = new AuthService()

export default authService