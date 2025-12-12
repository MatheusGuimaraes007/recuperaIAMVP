import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';

export const useAuthStore = defineStore('auth', () => {

    const user = ref(null);
    const session = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const isAuthenticated = computed(() => !!session.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const currentUser = computed(() => user.value);

    const setError = (message) => {
        error.value = message;
        setTimeout(() => {
            error.value = null;
        }, 5000);
    };

    const clearError = () => {
        error.value = null;
    };

    const fetchUserData = async (authUuid) => {
        try {
            const { data, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_uuid', authUuid)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (!data) {
                console.warn('Usuário não encontrado na tabela public.users');
                user.value = null;
                return null;
            }

            user.value = data;
            return data;
        } catch (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            user.value = null;
            return null;
        }
    };

    const initializeAuth = async () => {
        loading.value = true;
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();

            if (currentSession) {
                session.value = currentSession;
                await fetchUserData(currentSession.user.id);
            }

            supabase.auth.onAuthStateChange(async (event, newSession) => {
                session.value = newSession;

                if (newSession) {
                    await fetchUserData(newSession.user.id);
                } else {
                    user.value = null;
                }
            });
        } catch (err) {
            console.error('Erro ao inicializar autenticação:', err);
        } finally {
            loading.value = false;
        }
    };

    const login = async (email, password) => {
        loading.value = true;
        clearError();

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            session.value = data.session;
            await fetchUserData(data.user.id);

            return { success: true, data };
        } catch (err) {
            console.error('Erro no login:', err);
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const register = async (userData) => {
        loading.value = true;
        clearError();

        try {
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name,
                        phone: userData.phone,
                    }
                }
            });

            if (signUpError) throw signUpError;

            const { data: userRecord, error: insertError } = await supabase
                .from('users')
                .insert({
                    auth_uuid: authData.user.id,
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone,
                    role: userData.role || 'user',
                    status: 'trial',
                })
                .select()
                .single();

            if (insertError) throw insertError;

            return { success: true, data: userRecord };
        } catch (err) {
            console.error('Erro no cadastro:', err);
            setError(err.message || 'Erro ao criar usuário.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        loading.value = true;
        clearError();

        try {
            const { error: logoutError } = await supabase.auth.signOut();
            if (logoutError) throw logoutError;

            user.value = null;
            session.value = null;

            return { success: true };
        } catch (err) {
            console.error('Erro no logout:', err);
            setError('Erro ao fazer logout.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (email) => {
        loading.value = true;
        clearError();

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            return { success: true, message: 'Email de recuperação enviado!' };
        } catch (err) {
            console.error('Erro na recuperação de senha:', err);
            setError('Erro ao enviar email de recuperação.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updatePassword = async (newPassword) => {
        loading.value = true;
        clearError();

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            return { success: true, message: 'Senha atualizada com sucesso!' };
        } catch (err) {
            console.error('Erro ao atualizar senha:', err);
            setError('Erro ao atualizar senha.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const refreshSession = async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            
            if (error) throw error;
            
            if (data.session) {
                session.value = data.session;
                return true;
            }
            return false;
        } catch (err) {
            console.error('Erro ao renovar sessão:', err);
            return false;
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
        
        refreshSession // <--- EXPORTADA AQUI
    };
});