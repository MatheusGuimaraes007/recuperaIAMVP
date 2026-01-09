/**
 * Auth Guard - Navigation Guard
 *
 * Protege rotas que requerem autenticação.
 * Redireciona para login se não autenticado.
 */

import { useAuthStore } from '@/stores/modules/auth.store'

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

    next()
}

export default authGuard