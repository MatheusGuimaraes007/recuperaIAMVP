/**
 * useAuth Composable
 *
 * Composable para facilitar uso de autenticação em componentes.
 * Wrapper sobre TanStack Query mutations e Auth Store.
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.store'
import {
    useLogin,
    useLogout,
    useRegister,
    useResetPassword,
    useUpdatePassword,
    useUpdateProfile
} from '@/api/queries/auth.queries'
import { toast } from 'vue-sonner'

export function useAuth() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Mutations
    const loginMutation = useLogin()
    const logoutMutation = useLogout()
    const registerMutation = useRegister()
    const resetPasswordMutation = useResetPassword()
    const updatePasswordMutation = useUpdatePassword()
    const updateProfileMutation = useUpdateProfile()

    // ============================================================================
    // STATE
    // ============================================================================

    const user = computed(() => authStore.user)
    const session = computed(() => authStore.session)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)
    const userRole = computed(() => authStore.userRole)
    const userStatus = computed(() => authStore.userStatus)
    const isLoading = computed(() =>
        loginMutation.isPending.value ||
        logoutMutation.isPending.value
    )

    // ============================================================================
    // ACTIONS
    // ============================================================================

    /**
     * Login
     */
    const login = async (email, password) => {
        try {
            const result = await loginMutation.mutateAsync({ email, password })

            if (result.success) {
                return { success: true }
            }

            return {
                success: false,
                error: result.error
            }
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao fazer login'
            }
        }
    }

    /**
     * Logout
     */
    const logout = async () => {
        try {
            await logoutMutation.mutateAsync()

            toast.success('Logout realizado com sucesso!')

            // Redirecionar para login
            router.push({ name: 'login' })

            return { success: true }
        } catch (error) {
            toast.error('Erro ao fazer logout')
            return { success: false, error }
        }
    }

    /**
     * Register
     */
    const register = async (userData) => {
        try {
            const result = await registerMutation.mutateAsync(userData)

            if (result.success) {
                return { success: true }
            }

            return {
                success: false,
                error: result.error
            }
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao registrar usuário'
            }
        }
    }

    /**
     * Reset Password
     */
    const resetPassword = async (email) => {
        try {
            const result = await resetPasswordMutation.mutateAsync(email)

            if (result.success) {
                return { success: true, message: result.message }
            }

            return {
                success: false,
                error: result.error
            }
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao resetar senha'
            }
        }
    }

    /**
     * Update Password
     */
    const updatePassword = async (newPassword) => {
        try {
            const result = await updatePasswordMutation.mutateAsync(newPassword)

            if (result.success) {
                toast.success('Senha atualizada com sucesso!')
                return { success: true }
            }

            return {
                success: false,
                error: result.error
            }
        } catch (error) {
            toast.error('Erro ao atualizar senha')
            return {
                success: false,
                error: 'Erro ao atualizar senha'
            }
        }
    }

    /**
     * Update Profile
     */
    const updateProfile = async (data) => {
        try {
            if (!user.value?.id) {
                throw new Error('Usuário não encontrado')
            }

            const result = await updateProfileMutation.mutateAsync({
                userId: user.value.id,
                data
            })

            if (result.success) {
                toast.success('Perfil atualizado com sucesso!')
                return { success: true }
            }

            return {
                success: false,
                error: result.error
            }
        } catch (error) {
            toast.error('Erro ao atualizar perfil')
            return {
                success: false,
                error: 'Erro ao atualizar perfil'
            }
        }
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Verificar se usuário tem permissão
     */
    const hasPermission = (permission) => {
        return authStore.hasPermission(permission)
    }

    /**
     * Verificar se pode acessar rota
     */
    const canAccessRoute = (routeMeta) => {
        return authStore.canAccessRoute(routeMeta)
    }

    /**
     * Redirecionar se não autenticado
     */
    const requireAuth = () => {
        if (!isAuthenticated.value) {
            router.push({
                name: 'login',
                query: { redirect: router.currentRoute.value.fullPath }
            })
            return false
        }
        return true
    }

    /**
     * Redirecionar se não for admin
     */
    const requireAdmin = () => {
        if (!requireAuth()) return false

        if (!isAdmin.value) {
            router.push({ name: 'forbidden' })
            return false
        }
        return true
    }

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        // State
        user,
        session,
        isAuthenticated,
        isAdmin,
        userRole,
        userStatus,
        isLoading,

        // Actions
        login,
        logout,
        register,
        resetPassword,
        updatePassword,
        updateProfile,

        // Utilities
        hasPermission,
        canAccessRoute,
        requireAuth,
        requireAdmin
    }
}