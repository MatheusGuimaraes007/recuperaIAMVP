import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/useAuthStore.js';
import {validateEmail, validatePassword, validatePhone} from '../utils/validators.js';
import { formatPhone } from '../utils/formatters.js';

export const useAuth = () => {
    const authStore = useAuthStore();
    const {
        user,
        session,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        currentUser
    } = storeToRefs(authStore);

    const {
        initializeAuth,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        clearError,
    } = authStore;

    const requireAdmin = () => {
        if (!isAdmin.value) {
            throw new Error('Acesso negado. Apenas administradores podem realizar esta ação.');
        }
    };

    const requireAuth = () => {
        if (!isAuthenticated.value) {
            throw new Error('Você precisa estar autenticado para realizar esta ação.');
        }
    };

    async function isAdminUser() {
        await initializeAuth();
        return isAdmin.value;
    }

    return {
        user,
        session,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        currentUser,

        initializeAuth,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        clearError,

        validateEmail,
        validatePassword,
        validatePhone,

        formatPhone,

        requireAdmin,
        requireAuth,

        isAdminUser,
    };
};