/**
 * TanStack Query Hooks - Auth
 *
 * Hooks para autenticação usando TanStack Query.
 * Gerencia sessão, login, logout e dados do usuário.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import authService from '@/api/services/AuthService'
import { useAuthStore } from '@/stores/modules/auth.store'

// ============================================================================
// QUERY KEYS
// ============================================================================

export const authKeys = {
    all: ['auth'],
    session: () => [...authKeys.all, 'session'],
    user: (authUuid) => [...authKeys.all, 'user', authUuid]
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obter sessão atual
 */
export function useSession() {
    return useQuery({
        queryKey: authKeys.session(),
        queryFn: () => authService.getSession(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: false,
        refetchOnWindowFocus: true
    })
}

/**
 * Hook para obter dados do usuário
 */
export function useUserData(authUuid) {
    return useQuery({
        queryKey: authKeys.user(authUuid),
        queryFn: () => authService.fetchUserData(authUuid),
        enabled: !!authUuid,
        staleTime: 10 * 60 * 1000, // 10 minutos
        retry: 1
    })
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para login
 */
export function useLogin() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: ({ email, password }) => authService.login(email, password),

        onSuccess: async (data) => {
            if (data.success && data.session) {
                // Atualizar store
                authStore.setSession(data.session)
                authStore.setUser(data.user)

                // Invalidar queries relacionadas
                await queryClient.invalidateQueries({ queryKey: authKeys.session() })

                if (data.user) {
                    await queryClient.invalidateQueries({
                        queryKey: authKeys.user(data.session.user.id)
                    })
                }
            }
        },

        onError: (error) => {
            console.error('Erro no login:', error)
        }
    })
}

/**
 * Hook para registro
 */
export function useRegister() {
    return useMutation({
        mutationFn: (userData) => authService.register(userData),

        onSuccess: (data) => {
            if (data.success) {
                console.log('Usuário registrado com sucesso:', data.user)
            }
        },

        onError: (error) => {
            console.error('Erro no registro:', error)
        }
    })
}

/**
 * Hook para logout
 */
export function useLogout() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: () => authService.logout(),

        onSuccess: async (data) => {
            if (data.success) {
                // Limpar store
                authStore.clearAuth()

                // Limpar TODAS as queries do cache (segurança)
                queryClient.clear()

                console.log('Logout realizado com sucesso')
            }
        },

        onError: (error) => {
            console.error('Erro no logout:', error)
        }
    })
}

/**
 * Hook para recuperação de senha
 */
export function useResetPassword() {
    return useMutation({
        mutationFn: (email) => authService.resetPassword(email),

        onSuccess: (data) => {
            if (data.success) {
                console.log(data.message)
            }
        },

        onError: (error) => {
            console.error('Erro ao resetar senha:', error)
        }
    })
}

/**
 * Hook para atualizar senha
 */
export function useUpdatePassword() {
    return useMutation({
        mutationFn: (newPassword) => authService.updatePassword(newPassword),

        onSuccess: (data) => {
            if (data.success) {
                console.log(data.message)
            }
        },

        onError: (error) => {
            console.error('Erro ao atualizar senha:', error)
        }
    })
}

/**
 * Hook para atualizar perfil
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: ({ userId, data }) => authService.updateProfile(userId, data),

        onSuccess: async (result) => {
            if (result.success) {
                // Atualizar store
                authStore.setUser(result.user)

                // Invalidar queries do usuário
                await queryClient.invalidateQueries({
                    queryKey: authKeys.user(result.user.auth_uuid)
                })
            }
        },

        onError: (error) => {
            console.error('Erro ao atualizar perfil:', error)
        }
    })
}

/**
 * Hook para renovar sessão
 */
export function useRefreshSession() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: () => authService.refreshSession(),

        onSuccess: async (data) => {
            if (data.success && data.session) {
                // Atualizar store
                authStore.setSession(data.session)

                // Invalidar query de sessão
                await queryClient.invalidateQueries({ queryKey: authKeys.session() })
            }
        },

        onError: (error) => {
            console.error('Erro ao renovar sessão:', error)
        }
    })
}