/**
 * Auth Guard - Navigation Guard
 *
 * Protege rotas que requerem autenticação.
 * Redireciona para login se não autenticado.
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 */

import { useAuthStore } from '@/stores/modules/auth.store'

/**
 * Guard de autenticação
 * Verifica se usuário está autenticado antes de permitir acesso
 *
 * @param {object} to - Rota de destino
 * @param {object} from - Rota de origem
 * @param {Function} next - Função de navegação
 */
export const authGuard = (to, from, next) => {
    const authStore = useAuthStore()

    // Verificar se a rota requer autenticação
    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated) {
            console.log('🚫 Acesso negado: usuário não autenticado')

            // Salvar URL pretendida para redirecionar após login
            const redirectPath = to.fullPath

            // Redirecionar para login
            next({
                name: 'login',
                query: { redirect: redirectPath }
            })
            return
        }

        console.log('✅ Acesso permitido: usuário autenticado')
    }

    // Verificar se a rota requer role admin
    if (to.meta.requiresAdmin) {
        if (!authStore.isAdmin) {
            console.log('🚫 Acesso negado: requer permissão de admin')

            next({ name: 'forbidden' })
            return
        }

        console.log('✅ Acesso permitido: usuário é admin')
    }

    // Verificar se a rota requer assinatura ativa
    if (to.meta.requiresSubscription) {
        if (!authStore.isActive) {
            console.log('🚫 Acesso negado: assinatura inativa')

            next({ name: 'subscription-required' })
            return
        }

        console.log('✅ Acesso permitido: assinatura ativa')
    }

    // Verificar roles específicas
    if (to.meta.roles) {
        const hasRole = authStore.hasRole(to.meta.roles)

        if (!hasRole) {
            console.log('🚫 Acesso negado: role não permitida')

            next({ name: 'forbidden' })
            return
        }

        console.log('✅ Acesso permitido: role autorizada')
    }

    // Verificar permissões específicas
    if (to.meta.permissions) {
        const permissions = Array.isArray(to.meta.permissions)
            ? to.meta.permissions
            : [to.meta.permissions]

        const hasAllPermissions = permissions.every(permission =>
            authStore.hasPermission(permission)
        )

        if (!hasAllPermissions) {
            console.log('🚫 Acesso negado: permissão insuficiente')

            next({ name: 'forbidden' })
            return
        }

        console.log('✅ Acesso permitido: permissões verificadas')
    }

    next()
}

export default authGuard