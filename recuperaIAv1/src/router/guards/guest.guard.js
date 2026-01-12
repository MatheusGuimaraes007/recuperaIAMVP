/**
 * Guest Guard - Navigation Guard
 *
 * Protege rotas que são apenas para visitantes (não autenticados).
 * Redireciona usuários autenticados para dashboard.
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 */

import { useAuthStore } from '@/stores/modules/auth.store'

/**
 * Guard para visitantes
 * Redireciona usuários autenticados para dashboard
 *
 * @param {object} to - Rota de destino
 * @param {object} from - Rota de origem
 * @param {Function} next - Função de navegação
 */
export const guestGuard = (to, from, next) => {
    const authStore = useAuthStore()

    // Verificar se a rota é apenas para visitantes
    if (to.meta.guestOnly) {
        if (authStore.isAuthenticated) {
            console.log('🔄 Usuário já autenticado, redirecionando...')

            // ⚠️ CORREÇÃO: Evitar redirect infinito
            // Se já estamos no dashboard, não redirecionar
            if (from.path === '/dashboard' || from.path === '/admin/dashboard') {
                next(false) // Cancelar navegação
                return
            }

            // Redirecionar baseado em role
            const destination = authStore.isAdmin ? '/admin/dashboard' : '/dashboard'

            next({ path: destination, replace: true })
            return
        }

        console.log('✅ Acesso permitido: visitante')
    }

    next()
}

export default guestGuard