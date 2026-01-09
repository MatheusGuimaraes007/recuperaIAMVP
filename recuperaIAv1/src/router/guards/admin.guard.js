/**
 * Admin Guard - Navigation Guard
 *
 * Protege rotas que requerem permissões de administrador.
 * Redireciona para 403 (Forbidden) se não for admin.
 */

import { useAuthStore } from '@/stores/modules/auth.store'

export const adminGuard = (to, from, next) => {
    const authStore = useAuthStore()

    // Verificar se a rota requer admin
    if (to.meta.requiresAdmin) {
        if (!authStore.isAuthenticated) {
            console.log('🚫 Acesso negado: usuário não autenticado')

            next({
                name: 'login',
                query: { redirect: to.fullPath }
            })
            return
        }

        if (!authStore.isAdmin) {
            console.log('🚫 Acesso negado: usuário não é admin')

            next({
                name: 'forbidden',
                params: {
                    message: 'Você não tem permissão para acessar esta página.'
                }
            })
            return
        }

        console.log('✅ Acesso permitido: usuário é admin')
    }

    next()
}

export default adminGuard