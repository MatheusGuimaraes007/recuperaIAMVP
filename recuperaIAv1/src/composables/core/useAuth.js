import { computed } from 'vue' // ✅ Import corrigido
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// Store
import { useAuthStore } from '@/stores/modules/auth.store'

// TanStack Query mutations
import {
    useLogin,
    useLogout,
    useRegister,
    useResetPassword,
    useUpdatePassword,
    useUpdateProfile,
    useRefreshSession
} from '@/api/queries/auth'

/**
 * Composable useAuth
 *
 * @returns {object} Auth state e methods
 */
export function useAuth() {
    const router = useRouter()
    const authStore = useAuthStore()

    // ============================================================================
    // MUTATIONS
    // ============================================================================

    const loginMutation = useLogin()
    const logoutMutation = useLogout()
    const registerMutation = useRegister()
    const resetPasswordMutation = useResetPassword()
    const updatePasswordMutation = useUpdatePassword()
    const updateProfileMutation = useUpdateProfile()
    const refreshSessionMutation = useRefreshSession()

    // ============================================================================
    // STATE (do Store)
    // ============================================================================

    const user = computed(() => authStore.user)
    const session = computed(() => authStore.session)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)
    const userRole = computed(() => authStore.userRole)
    const userStatus = computed(() => authStore.userStatus)
    const isTrial = computed(() => authStore.isTrial)
    const isActive = computed(() => authStore.isActive)
    const userInitials = computed(() => authStore.userInitials)
    const displayName = computed(() => authStore.displayName)

    /**
     * Verifica se alguma mutation está em andamento
     */
    const isLoading = computed(() =>
        loginMutation.isPending.value ||
        logoutMutation.isPending.value ||
        registerMutation.isPending.value
    )

    // ============================================================================
    // ACTIONS - Login
    // ============================================================================

    const login = async (email, password, options = {}) => {
        const { redirectTo, showToast = true } = options

        try {
            const result = await loginMutation.mutateAsync({ email, password })

            if (result.success) {
                if (showToast) {
                    toast.success(`Bem-vindo, ${result.user?.name || 'Usuário'}! 🎉`)
                }

                if (redirectTo) {
                    router.push(redirectTo)
                } else {
                    const destination = result.user?.role === 'admin'
                        ? '/admin/dashboard'
                        : '/dashboard'
                    router.push(destination)
                }
                return { success: true }
            }

            if (showToast) {
                toast.error(result.error || 'Erro ao fazer login')
            }
            return { success: false, error: result.error }

        } catch (error) {
            if (showToast) {
                toast.error('Erro ao fazer login. Tente novamente.')
            }
            return { success: false, error: 'Erro ao fazer login' }
        }
    }

    // ============================================================================
    // ACTIONS - Logout
    // ============================================================================

    const logout = async (options = {}) => {
        const { redirectTo = '/login', showToast = true } = options

        try {
            await logoutMutation.mutateAsync()
            if (showToast) {
                toast.success('Logout realizado com sucesso!')
            }
            router.push(redirectTo)
            return { success: true }
        } catch (error) {
            if (showToast) {
                toast.error('Erro ao fazer logout')
            }
            authStore.clearAuth()
            return { success: false, error }
        }
    }

    // ============================================================================
    // ACTIONS - Register
    // ============================================================================

    const register = async (userData, options = {}) => {
        const { redirectTo = '/login', showToast = true } = options

        try {
            const result = await registerMutation.mutateAsync(userData)

            if (result.success) {
                if (showToast) {
                    toast.success('Conta criada com sucesso! 🎉 Faça login para continuar.')
                }
                router.push(redirectTo)
                return { success: true }
            }

            if (showToast) {
                toast.error(result.error || 'Erro ao criar conta')
            }
            return { success: false, error: result.error }

        } catch (error) {
            if (showToast) {
                toast.error('Erro ao criar conta. Tente novamente.')
            }
            return { success: false, error: 'Erro ao criar conta' }
        }
    }

    // ============================================================================
    // ACTIONS - Password & Profile
    // ============================================================================

    const resetPassword = async (email, options = {}) => {
        const { showToast = true } = options
        try {
            const result = await resetPasswordMutation.mutateAsync(email)
            if (result.success) {
                if (showToast) toast.success(result.message || 'Email enviado com sucesso!')
                return { success: true, message: result.message }
            }
            if (showToast) toast.error(result.error || 'Erro ao enviar email')
            return { success: false, error: result.error }
        } catch (error) {
            if (showToast) toast.error('Erro ao enviar email de recuperação')
            return { success: false, error: 'Erro ao enviar email' }
        }
    }

    const updatePassword = async (newPassword, options = {}) => {
        const { showToast = true } = options
        try {
            const result = await updatePasswordMutation.mutateAsync(newPassword)
            if (result.success) {
                if (showToast) toast.success('Senha atualizada com sucesso!')
                return { success: true }
            }
            if (showToast) toast.error(result.error || 'Erro ao atualizar senha')
            return { success: false, error: result.error }
        } catch (error) {
            if (showToast) toast.error('Erro ao atualizar senha')
            return { success: false, error: 'Erro ao atualizar senha' }
        }
    }

    const updateProfile = async (data, options = {}) => {
        const { showToast = true } = options
        try {
            if (!user.value?.id) throw new Error('Usuário não encontrado')
            const result = await updateProfileMutation.mutateAsync({
                userId: user.value.id,
                data
            })
            if (result.success) {
                if (showToast) toast.success('Perfil atualizado com sucesso!')
                return { success: true }
            }
            if (showToast) toast.error(result.error || 'Erro ao atualizar perfil')
            return { success: false, error: result.error }
        } catch (error) {
            if (showToast) toast.error('Erro ao atualizar perfil')
            return { success: false, error: 'Erro ao atualizar perfil' }
        }
    }

    const refreshSession = async () => {
        try {
            const result = await refreshSessionMutation.mutateAsync()
            return result.success
        } catch (error) {
            console.error('Erro ao renovar sessão:', error)
            return false
        }
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    const hasPermission = (permission) => authStore.hasPermission(permission)
    const hasRole = (roles) => authStore.hasRole(roles)
    const canAccessRoute = (routeMeta) => authStore.canAccessRoute(routeMeta)

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

    const requireAdmin = () => {
        if (!requireAuth()) return false
        if (!isAdmin.value) {
            router.push({ name: 'forbidden' })
            toast.error('Você não tem permissão para acessar esta página')
            return false
        }
        return true
    }

    return {
        user,
        session,
        isAuthenticated,
        isAdmin,
        userRole,
        userStatus,
        isTrial,
        isActive,
        userInitials,
        displayName,
        isLoading,
        login,
        logout,
        register,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshSession,
        hasPermission,
        hasRole,
        canAccessRoute,
        requireAuth,
        requireAdmin
    }
}