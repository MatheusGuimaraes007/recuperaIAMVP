/**
 * Guest Guard - Navigation Guard
 *
 * Redireciona usuários autenticados para dashboard.
 * Usado em páginas de login/register.
 */

import { useAuthStore } from '@/stores/modules/auth.store'

export const guestGuard = (to, from, next) => {
    const authStore = useAuthStore()

    // Verificar se a rota é apenas para guests
    if (to.meta.guestOnly) {
        if (authStore.isAuthenticated) {
            console.log('ℹ️ Usuário já autenticado, redirecionando para dashboard')

            next({ name: 'dashboard' })
            return
        }
    }

    next()
}

export default guestGuard