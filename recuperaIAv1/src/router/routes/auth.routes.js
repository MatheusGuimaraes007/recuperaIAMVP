/**
 * Auth Routes
 *
 * Rotas de autenticação: login, register, forgot password, reset password.
 */

export const authRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
            title: 'Login',
            guestOnly: true, // Apenas para não autenticados
            layout: 'auth'
        }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
        meta: {
            title: 'Recuperar Senha',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        meta: {
            title: 'Redefinir Senha',
            guestOnly: true,
            layout: 'auth'
        }
    }
]

export default authRoutes