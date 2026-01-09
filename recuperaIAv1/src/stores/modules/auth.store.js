/**
 * Auth Store - Pinia v3.0
 *
 * Store de autenticação usando TanStack Query para data fetching.
 * Gerencia apenas estado global da aplicação (user, session, UI state).
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/api/services/AuthService'

export const useAuthStore = defineStore('auth', () => {
    // ============================================================================
    // STATE
    // ============================================================================

    const user = ref(null)
    const session = ref(null)
    const loading = ref(false)
    const initialized = ref(false)

    // ============================================================================
    // GETTERS (Computed)
    // ============================================================================

    const isAuthenticated = computed(() => !!session.value)

    const isAdmin = computed(() => user.value?.role === 'admin')

    const currentUser = computed(() => user.value)

    const userRole = computed(() => user.value?.role || 'guest')

    const userStatus = computed(() => user.value?.status || 'inactive')

    const isTrial = computed(() => user.value?.status === 'trial')

    const isActive = computed(() => user.value?.status === 'active')

    const userInitials = computed(() => {
        if (!user.value?.name) return '??'

        const names = user.value.name.split(' ')
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        }
        return names[0].substring(0, 2).toUpperCase()
    })

    // ============================================================================
    // ACTIONS
    // ============================================================================

    /**
     * Inicializar autenticação
     * Chamado uma vez no main.js
     */
    const initializeAuth = async () => {
        if (initialized.value) return

        loading.value = true

        try {
            console.log('🔐 Inicializando autenticação...')

            // Obter sessão atual
            const sessionResult = await authService.getSession()

            if (sessionResult.success && sessionResult.session) {
                session.value = sessionResult.session

                // Buscar dados do usuário
                const userData = await authService.fetchUserData(sessionResult.session.user.id)
                user.value = userData

                console.log('✅ Autenticação inicializada com sucesso')
            } else {
                console.log('ℹ️ Nenhuma sessão ativa')
            }

            // Setup listener para mudanças de auth
            authService.onAuthStateChange(async (event, newSession) => {
                console.log(`🔔 Auth event: ${event}`)

                session.value = newSession

                if (newSession) {
                    // Buscar dados do usuário
                    const userData = await authService.fetchUserData(newSession.user.id)
                    user.value = userData
                } else {
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
     * Setar sessão (usado pelos mutations)
     */
    const setSession = (newSession) => {
        session.value = newSession
    }

    /**
     * Setar usuário (usado pelos mutations)
     */
    const setUser = (newUser) => {
        user.value = newUser
    }

    /**
     * Limpar autenticação
     */
    const clearAuth = () => {
        user.value = null
        session.value = null
    }

    /**
     * Atualizar campo específico do usuário
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
     * Verificar se usuário tem permissão específica
     */
    const hasPermission = (permission) => {
        if (!user.value) return false
        if (user.value.role === 'admin') return true

        // TODO: Implementar sistema de permissões granular
        return user.value.permissions?.includes(permission) || false
    }

    /**
     * Verificar se usuário pode acessar rota
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

        return true
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

        // Actions
        initializeAuth,
        setSession,
        setUser,
        clearAuth,
        updateUserField,
        hasPermission,
        canAccessRoute
    }
})