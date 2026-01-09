/**
 * Auth Store - Pinia v3.0
 *
 * Store de autenticação focada APENAS em estado global da aplicação.
 * Data fetching é gerenciado por TanStack Query (ver @/api/queries/auth.js).
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 *
 * RESPONSABILIDADES:
 * ✅ Gerenciar estado reativo (user, session)
 * ✅ Computed values (isAuthenticated, isAdmin, etc)
 * ✅ Actions para setar/limpar state
 * ✅ Helpers de permissões e roles
 *
 * NÃO RESPONSABILIDADES:
 * ❌ Fazer fetch de dados (usar TanStack Query)
 * ❌ Gerenciar cache (TanStack Query faz isso)
 * ❌ Try/catch de API calls (Services fazem isso)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/api/services/AuthService'

export const useAuthStore = defineStore('auth', () => {
    // ============================================================================
    // STATE
    // ============================================================================

    /**
     * Dados do usuário da tabela users
     * @type {Ref<object|null>}
     */
    const user = ref(null)

    /**
     * Sessão do Supabase Auth
     * @type {Ref<object|null>}
     */
    const session = ref(null)

    /**
     * Flag de loading durante inicialização
     * @type {Ref<boolean>}
     */
    const loading = ref(false)

    /**
     * Flag se auth foi inicializada
     * @type {Ref<boolean>}
     */
    const initialized = ref(false)

    // ============================================================================
    // GETTERS (Computed)
    // ============================================================================

    /**
     * Verifica se usuário está autenticado
     * @returns {boolean}
     */
    const isAuthenticated = computed(() => !!session.value)

    /**
     * Verifica se usuário é admin
     * @returns {boolean}
     */
    const isAdmin = computed(() => user.value?.role === 'admin')

    /**
     * Retorna usuário atual
     * @returns {object|null}
     */
    const currentUser = computed(() => user.value)

    /**
     * Retorna role do usuário
     * @returns {string}
     */
    const userRole = computed(() => user.value?.role || 'guest')

    /**
     * Retorna status da conta do usuário
     * @returns {string}
     */
    const userStatus = computed(() => user.value?.status || 'inactive')

    /**
     * Verifica se usuário está em trial
     * @returns {boolean}
     */
    const isTrial = computed(() => user.value?.status === 'trial')

    /**
     * Verifica se conta está ativa
     * @returns {boolean}
     */
    const isActive = computed(() => user.value?.status === 'active')

    /**
     * Retorna iniciais do usuário para avatar
     * @returns {string}
     */
    const userInitials = computed(() => {
        if (!user.value?.name) return '??'

        const names = user.value.name.trim().split(' ')

        if (names.length >= 2) {
            // Primeira + última letra
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        }

        // Primeiras 2 letras do único nome
        return names[0].substring(0, 2).toUpperCase()
    })

    /**
     * Retorna nome de exibição do usuário
     * @returns {string}
     */
    const displayName = computed(() => {
        if (!user.value?.name) return 'Usuário'

        const names = user.value.name.trim().split(' ')

        // Apenas primeiro nome
        return names[0]
    })

    /**
     * Retorna email do usuário
     * @returns {string|null}
     */
    const userEmail = computed(() => user.value?.email || session.value?.user?.email || null)

    /**
     * Verifica se sessão está expirada ou próxima de expirar
     * @returns {boolean}
     */
    const isSessionExpiring = computed(() => {
        if (!session.value?.expires_at) return false

        const expiresAt = new Date(session.value.expires_at).getTime()
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000

        // Retorna true se expira em menos de 5 minutos
        return expiresAt - now < fiveMinutes
    })

    // ============================================================================
    // ACTIONS
    // ============================================================================

    /**
     * Inicializar autenticação
     * Chamado UMA vez no main.js ao iniciar a aplicação
     *
     * @returns {Promise<void>}
     */
    const initializeAuth = async () => {
        // Evitar inicialização duplicada
        if (initialized.value) {
            console.log('ℹ️ Auth já foi inicializada')
            return
        }

        loading.value = true

        try {
            console.log('🔐 Inicializando autenticação...')

            // 1. Obter sessão atual do Supabase
            const sessionResult = await authService.getSession()

            if (sessionResult.success && sessionResult.session) {
                session.value = sessionResult.session

                // 2. Buscar dados do usuário
                const userData = await authService.fetchUserData(
                    sessionResult.session.user.id
                )

                user.value = userData

                console.log('✅ Autenticação inicializada com sucesso')
            } else {
                console.log('ℹ️ Nenhuma sessão ativa')
            }

            // 3. Setup listener para mudanças de auth
            authService.onAuthStateChange(async (event, newSession) => {
                console.log(`🔔 Auth event: ${event}`)

                session.value = newSession

                if (newSession) {
                    // Usuário logou: buscar dados
                    const userData = await authService.fetchUserData(newSession.user.id)
                    user.value = userData
                } else {
                    // Usuário deslogou: limpar dados
                    user.value = null
                }
            })

            initialized.value = true

        } catch (error) {
            console.error('❌ Erro ao inicializar autenticação:', error)
        } finally {
            loading.value = false
        }
    }

    /**
     * Setar sessão
     * Usado pelos mutations do TanStack Query
     *
     * @param {object|null} newSession - Nova sessão
     */
    const setSession = (newSession) => {
        session.value = newSession
    }

    /**
     * Setar usuário
     * Usado pelos mutations do TanStack Query
     *
     * @param {object|null} newUser - Novo usuário
     */
    const setUser = (newUser) => {
        user.value = newUser
    }

    /**
     * Limpar autenticação
     * Remove session e user do state
     */
    const clearAuth = () => {
        user.value = null
        session.value = null
    }

    /**
     * Atualizar campo específico do usuário
     * Útil para updates parciais
     *
     * @param {string} field - Nome do campo
     * @param {any} value - Novo valor
     */
    const updateUserField = (field, value) => {
        if (user.value) {
            user.value = {
                ...user.value,
                [field]: value
            }
        }
    }

    /**
     * Atualizar múltiplos campos do usuário
     *
     * @param {object} fields - Campos para atualizar
     */
    const updateUserFields = (fields) => {
        if (user.value) {
            user.value = {
                ...user.value,
                ...fields
            }
        }
    }

    // ============================================================================
    // PERMISSIONS & ROLES
    // ============================================================================

    /**
     * Verifica se usuário tem permissão específica
     *
     * @param {string} permission - Nome da permissão
     * @returns {boolean}
     */
    const hasPermission = (permission) => {
        if (!user.value) return false

        // Admin tem todas as permissões
        if (user.value.role === 'admin') return true

        // TODO: Implementar sistema de permissões granular
        // Por enquanto, apenas verificar role
        return user.value.permissions?.includes(permission) || false
    }

    /**
     * Verifica se usuário tem uma das roles especificadas
     *
     * @param {string|string[]} roles - Role ou array de roles
     * @returns {boolean}
     */
    const hasRole = (roles) => {
        if (!user.value) return false

        const roleArray = Array.isArray(roles) ? roles : [roles]

        return roleArray.includes(user.value.role)
    }

    /**
     * Verifica se usuário pode acessar rota
     * Baseado nas meta tags da rota
     *
     * @param {object} routeMeta - Meta da rota
     * @returns {boolean}
     */
    const canAccessRoute = (routeMeta) => {
        if (!routeMeta) return true

        // Verificar autenticação
        if (routeMeta.requiresAuth && !isAuthenticated.value) {
            return false
        }

        // Verificar role admin
        if (routeMeta.requiresAdmin && !isAdmin.value) {
            return false
        }

        // Verificar assinatura ativa
        if (routeMeta.requiresSubscription && !isActive.value) {
            return false
        }

        // Verificar roles específicas
        if (routeMeta.roles && !hasRole(routeMeta.roles)) {
            return false
        }

        // Verificar permissões específicas
        if (routeMeta.permissions) {
            const permissions = Array.isArray(routeMeta.permissions)
                ? routeMeta.permissions
                : [routeMeta.permissions]

            return permissions.every(permission => hasPermission(permission))
        }

        return true
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Força refresh dos dados do usuário
     * Útil após updates que não passam pelo TanStack Query
     *
     * @returns {Promise<void>}
     */
    const refreshUser = async () => {
        if (!session.value) return

        try {
            const userData = await authService.fetchUserData(session.value.user.id)
            user.value = userData
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error)
        }
    }

    /**
     * Obter token de acesso atual
     *
     * @returns {string|null}
     */
    const getAccessToken = () => {
        return session.value?.access_token || null
    }

    /**
     * Verificar se precisa renovar sessão
     *
     * @returns {boolean}
     */
    const needsSessionRefresh = () => {
        return isSessionExpiring.value
    }

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        // State
        user,
        session,
        loading,
        initialized,

        // Getters
        isAuthenticated,
        isAdmin,
        currentUser,
        userRole,
        userStatus,
        isTrial,
        isActive,
        userInitials,
        displayName,
        userEmail,
        isSessionExpiring,

        // Actions
        initializeAuth,
        setSession,
        setUser,
        clearAuth,
        updateUserField,
        updateUserFields,
        refreshUser,

        // Permissions & Roles
        hasPermission,
        hasRole,
        canAccessRoute,

        // Utilities
        getAccessToken,
        needsSessionRefresh
    }
})