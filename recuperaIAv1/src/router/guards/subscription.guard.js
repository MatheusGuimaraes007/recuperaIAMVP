/**
 * Subscription Guard - Navigation Guard
 *
 * Protege rotas que requerem assinatura ativa.
 * Redireciona para página de upgrade se assinatura inativa.
 */

import { useAuthStore } from '@/stores/modules/auth.store'

export const subscriptionGuard = (to, from, next) => {
    const authStore = useAuthStore()

    // Verificar se a rota requer assinatura ativa
    if (to.meta.requiresSubscription) {
        if (!authStore.isAuthenticated) {
            console.log('🚫 Acesso negado: usuário não autenticado')

            next({
                name: 'login',
                query: { redirect: to.fullPath }
            })
            return
        }

        if (!authStore.isActive && !authStore.isTrial) {
            console.log('🚫 Acesso negado: assinatura inativa')

            next({
                name: 'upgrade',
                query: {
                    from: to.name,
                    message: 'Esta funcionalidade requer uma assinatura ativa.'
                }
            })
            return
        }

        console.log('✅ Acesso permitido: assinatura ativa')
    }

    next()
}

export default subscriptionGuard