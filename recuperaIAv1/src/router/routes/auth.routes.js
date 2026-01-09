/**
 * Auth Routes
 *
 * Rotas de autenticação: login, register, forgot password, reset password.
 * Todas as rotas usam RAuthLayout como layout padrão.
 *
 * @version 3.0.0
 * @architecture Atomic Design + TanStack Query
 */

export const authRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
            title: 'Login - Recupera.IA',
            guestOnly: true, // Apenas para não autenticados
            layout: 'auth'
        }
    },
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: () => import('@/pages/auth/RegisterPage.vue'),
    //     meta: {
    //         title: 'Criar Conta - Recupera.IA',
    //         guestOnly: true,
    //         layout: 'auth'
    //     }
    // },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
        meta: {
            title: 'Recuperar Senha - Recupera.IA',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        meta: {
            title: 'Redefinir Senha - Recupera.IA',
            guestOnly: true,
            layout: 'auth'
        }
    },
    // {
    //     path: '/verify-email',
    //     name: 'verify-email',
    //     component: () => import('@/pages/auth/VerifyEmailPage.vue'),
    //     meta: {
    //         title: 'Verificar Email - Recupera.IA',
    //         layout: 'auth'
    //     }
    // }
]

export default authRoutes