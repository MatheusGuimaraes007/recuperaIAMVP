/**
 * TanStack Query Client
 *
 * Configuração do QueryClient com defaults otimizados.
 */

import { QueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

// ============================================================================
// QUERY CLIENT
// ============================================================================

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (antigo cacheTime)

            // Retry
            retry: (failureCount, error) => {
                // Não retenta erros 4xx (erros do cliente)
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false
                }

                // Retenta até 3 vezes para outros erros
                return failureCount < 3
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: true,

            // Network mode
            networkMode: 'online',

            // Suspense (não usar por enquanto)
            suspense: false
        },

        mutations: {
            // Retry
            retry: (failureCount, error) => {
                // Não retenta mutations (por segurança)
                return false
            },

            // Network mode
            networkMode: 'online',

            // Error handling global
            onError: (error) => {
                console.error('Mutation Error:', error)

                // Toast de erro genérico (pode ser sobrescrito por mutation específica)
                const message = error?.response?.data?.message ||
                    error?.message ||
                    'Erro ao processar requisição'

                // Não mostrar toast aqui (deixar mutation específica lidar)
                // toast.error(message)
            }
        }
    }
})

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Invalidar todas queries de um namespace
 */
export const invalidateNamespace = (namespace) => {
    return queryClient.invalidateQueries({
        queryKey: [namespace]
    })
}

/**
 * Resetar query client (limpar todo cache)
 */
export const resetQueryClient = () => {
    queryClient.clear()
}

/**
 * Prefetch query
 */
export const prefetchQuery = (queryKey, queryFn) => {
    return queryClient.prefetchQuery({
        queryKey,
        queryFn
    })
}

/**
 * Set query data manualmente
 */
export const setQueryData = (queryKey, data) => {
    queryClient.setQueryData(queryKey, data)
}

/**
 * Get query data
 */
export const getQueryData = (queryKey) => {
    return queryClient.getQueryData(queryKey)
}

export default queryClient