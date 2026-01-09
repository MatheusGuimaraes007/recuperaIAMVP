/**
 * TanStack Query Hooks - Auth
 *
 * Hooks de autenticação usando TanStack Query para data fetching e cache.
 * Integrado com Pinia store para state management global.
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import authService from '@/api/services/AuthService'
import { useAuthStore } from '@/stores/modules/auth.store'

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

/**
 * Query keys hierárquicos para auth
 * Facilita invalidação em cascata
 */
export const authKeys = {
    all: ['auth'],
    session: () => [...authKeys.all, 'session'],
    users: () => [...authKeys.all, 'users'],
    user: (authUuid) => [...authKeys.users(), authUuid]
}

// ============================================================================
// QUERIES (Read Operations)
// ============================================================================

/**
 * Hook para obter sessão atual
 *
 * @returns {UseQueryResult} TanStack Query result
 *
 * @example
 * const { data: session, isLoading, error } = useSession()
 */
export function useSession() {
    return useQuery({
        queryKey: authKeys.session(),
        queryFn: async () => {
            const result = await authService.getSession()
            return result.session
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
        retry: false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    })
}

/**
 * Hook para obter dados do usuário
 *
 * @param {string} authUuid - UUID do usuário no Auth
 * @returns {UseQueryResult} TanStack Query result
 *
 * @example
 * const { data: user, isLoading } = useUserData('uuid-123')
 */
export function useUserData(authUuid) {
    return useQuery({
        queryKey: authKeys.user(authUuid),
        queryFn: async () => {
            return await authService.fetchUserData(authUuid)
        },
        enabled: !!authUuid, // Só executa se authUuid existir
        staleTime: 10 * 60 * 1000, // 10 minutos
        gcTime: 15 * 60 * 1000, // 15 minutos
        retry: 1
    })
}

// ============================================================================
// MUTATIONS (Write Operations)
// ============================================================================

/**
 * Hook para login
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const loginMutation = useLogin()
 * loginMutation.mutate({ email, password })
 */
export function useLogin() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: async ({ email, password }) => {
            return await authService.login(email, password)
        },

        onMutate: async () => {
            // Pode adicionar loading state aqui se necessário
            console.log('🔄 Login em andamento...')
        },

        onSuccess: async (result) => {
            if (result.success && result.session) {
                console.log('✅ Login bem-sucedido')

                // 1. Atualizar store com session e user
                authStore.setSession(result.session)
                authStore.setUser(result.user)

                // 2. Invalidar e refetch queries relacionadas
                await queryClient.invalidateQueries({
                    queryKey: authKeys.session()
                })

                if (result.user?.auth_uuid) {
                    await queryClient.invalidateQueries({
                        queryKey: authKeys.user(result.user.auth_uuid)
                    })
                }

                // 3. Prefetch dados que o usuário provavelmente precisará
                // (dashboard, perfil, etc)
                // await queryClient.prefetchQuery(...)
            }
        },

        onError: (error) => {
            console.error('❌ Erro no login:', error)
        }
    })
}

/**
 * Hook para registro
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const registerMutation = useRegister()
 * registerMutation.mutate({ email, password, name })
 */
export function useRegister() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userData) => {
            return await authService.register(userData)
        },

        onSuccess: (result) => {
            if (result.success) {
                console.log('✅ Usuário registrado com sucesso')

                // Invalidar lista de usuários (se houver)
                queryClient.invalidateQueries({
                    queryKey: authKeys.users()
                })
            }
        },

        onError: (error) => {
            console.error('❌ Erro no registro:', error)
        }
    })
}

/**
 * Hook para logout
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const logoutMutation = useLogout()
 * logoutMutation.mutate()
 */
export function useLogout() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: async () => {
            return await authService.logout()
        },

        onSuccess: async (result) => {
            if (result.success) {
                console.log('✅ Logout bem-sucedido')

                // 1. Limpar store
                authStore.clearAuth()

                // 2. Limpar TODO o cache (segurança)
                queryClient.clear()

                // Alternativa: Invalidar apenas queries sensíveis
                // await queryClient.invalidateQueries({ queryKey: authKeys.all })
            }
        },

        onError: (error) => {
            console.error('❌ Erro no logout:', error)

            // Mesmo com erro, limpar localmente por segurança
            authStore.clearAuth()
        }
    })
}

/**
 * Hook para recuperação de senha
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const resetPasswordMutation = useResetPassword()
 * resetPasswordMutation.mutate('user@email.com')
 */
export function useResetPassword() {
    return useMutation({
        mutationFn: async (email) => {
            return await authService.resetPassword(email)
        },

        onSuccess: (result) => {
            if (result.success) {
                console.log('✅ Email de recuperação enviado')
            }
        },

        onError: (error) => {
            console.error('❌ Erro ao resetar senha:', error)
        }
    })
}

/**
 * Hook para atualizar senha
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const updatePasswordMutation = useUpdatePassword()
 * updatePasswordMutation.mutate('newPassword123')
 */
export function useUpdatePassword() {
    return useMutation({
        mutationFn: async (newPassword) => {
            return await authService.updatePassword(newPassword)
        },

        onSuccess: (result) => {
            if (result.success) {
                console.log('✅ Senha atualizada')
            }
        },

        onError: (error) => {
            console.error('❌ Erro ao atualizar senha:', error)
        }
    })
}

/**
 * Hook para atualizar perfil
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const updateProfileMutation = useUpdateProfile()
 * updateProfileMutation.mutate({ userId: 1, data: { name: 'New Name' } })
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: async ({ userId, data }) => {
            return await authService.updateProfile(userId, data)
        },

        // Optimistic update: atualiza UI antes da resposta do servidor
        onMutate: async ({ userId, data }) => {
            // Cancelar queries em andamento
            await queryClient.cancelQueries({
                queryKey: authKeys.user(authStore.user?.auth_uuid)
            })

            // Snapshot do valor anterior (para rollback)
            const previousUser = queryClient.getQueryData(
                authKeys.user(authStore.user?.auth_uuid)
            )

            // Atualizar cache otimisticamente
            if (authStore.user) {
                const optimisticUser = { ...authStore.user, ...data }

                queryClient.setQueryData(
                    authKeys.user(authStore.user.auth_uuid),
                    optimisticUser
                )

                authStore.setUser(optimisticUser)
            }

            // Retornar contexto para rollback se necessário
            return { previousUser }
        },

        onSuccess: async (result) => {
            if (result.success && result.user) {
                console.log('✅ Perfil atualizado')

                // Atualizar store com dados do servidor
                authStore.setUser(result.user)

                // Invalidar queries relacionadas
                await queryClient.invalidateQueries({
                    queryKey: authKeys.user(result.user.auth_uuid)
                })
            }
        },

        onError: (error, variables, context) => {
            console.error('❌ Erro ao atualizar perfil:', error)

            // Rollback: restaurar dados anteriores
            if (context?.previousUser) {
                queryClient.setQueryData(
                    authKeys.user(authStore.user?.auth_uuid),
                    context.previousUser
                )
                authStore.setUser(context.previousUser)
            }
        },

        onSettled: () => {
            // Sempre refetch após mutation (success ou error)
            if (authStore.user?.auth_uuid) {
                queryClient.invalidateQueries({
                    queryKey: authKeys.user(authStore.user.auth_uuid)
                })
            }
        }
    })
}

/**
 * Hook para renovar sessão
 *
 * @returns {UseMutationResult} TanStack Query mutation
 *
 * @example
 * const refreshSessionMutation = useRefreshSession()
 * refreshSessionMutation.mutate()
 */
export function useRefreshSession() {
    const queryClient = useQueryClient()
    const authStore = useAuthStore()

    return useMutation({
        mutationFn: async () => {
            return await authService.refreshSession()
        },

        onSuccess: async (result) => {
            if (result.success && result.session) {
                console.log('✅ Sessão renovada')

                // Atualizar store
                authStore.setSession(result.session)

                // Invalidar query de sessão
                await queryClient.invalidateQueries({
                    queryKey: authKeys.session()
                })
            }
        },

        onError: (error) => {
            console.error('❌ Erro ao renovar sessão:', error)

            // Se falhar ao renovar, fazer logout
            authStore.clearAuth()
            queryClient.clear()
        }
    })
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Invalidar todas as queries de autenticação
 * Útil para forçar refetch de todos os dados de auth
 *
 * @param {QueryClient} queryClient - TanStack Query client
 * @returns {Promise<void>}
 *
 * @example
 * import { useQueryClient } from '@tanstack/vue-query'
 * const queryClient = useQueryClient()
 * await invalidateAuthQueries(queryClient)
 */
export async function invalidateAuthQueries(queryClient) {
    await queryClient.invalidateQueries({
        queryKey: authKeys.all
    })
}

/**
 * Limpar cache de autenticação
 * Remove todos os dados de auth do cache
 *
 * @param {QueryClient} queryClient - TanStack Query client
 *
 * @example
 * clearAuthCache(queryClient)
 */
export function clearAuthCache(queryClient) {
    queryClient.removeQueries({
        queryKey: authKeys.all
    })
}

/**
 * Prefetch de dados de autenticação
 * Carrega dados antes do usuário precisar
 *
 * @param {QueryClient} queryClient - TanStack Query client
 * @param {string} authUuid - UUID do usuário
 * @returns {Promise<void>}
 *
 * @example
 * await prefetchAuthData(queryClient, 'uuid-123')
 */
export async function prefetchAuthData(queryClient, authUuid) {
    if (!authUuid) return

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: authKeys.session(),
            queryFn: async () => {
                const result = await authService.getSession()
                return result.session
            }
        }),
        queryClient.prefetchQuery({
            queryKey: authKeys.user(authUuid),
            queryFn: async () => {
                return await authService.fetchUserData(authUuid)
            }
        })
    ])
}