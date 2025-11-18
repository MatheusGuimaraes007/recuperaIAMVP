
import { storeToRefs } from 'pinia';
import {useAuthStore} from "../stores/useAuthStore.js";

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

    const validateEmail = (email) => {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validatePhone = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10 || cleaned.length === 11;
    };

    const formatPhone = (phone) => {
        const cleaned = phone.replace(/\D/g, '');

        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }

        return phone;
    };

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
    };
};