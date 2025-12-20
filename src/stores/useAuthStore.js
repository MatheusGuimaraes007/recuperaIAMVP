import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { storeCache, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

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


    const fetchUserData = async (authUuid, skipCache = false) => {
        try {
            if (!skipCache) {
                const cacheKey = `auth:user:${authUuid}`;
                const cached = storeCache.get(cacheKey);

                if (cached) {
                    user.value = cached;
                    console.log('✅ User data carregado do CACHE');
                    return cached;
                }
            }

            console.log('⏳ Buscando user data do banco...');

            const { data, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_uuid', authUuid)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (!data) {
                console.warn('⚠️  Usuário não encontrado na tabela public.users');
                user.value = null;
                return null;
            }

            user.value = data;

            const cacheKey = `auth:user:${authUuid}`;
            storeCache.set(cacheKey, data, CacheTTL.SHORT);
            console.log('💾 User data salvo no CACHE');

            return data;

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchUserData', { authUuid });
            console.error(friendlyMessage);
            user.value = null;
            return null;
        }
    };


    const initializeAuth = async () => {
        loading.value = true;

        try {
            console.log('🔐 Inicializando autenticação...');

            const { data: { session: currentSession } } = await supabase.auth.getSession();

            if (currentSession) {
                session.value = currentSession;

                await fetchUserData(currentSession.user.id);

                console.log('✅ Autenticação inicializada com sucesso');
            } else {
                console.log('ℹ️  Nenhuma sessão ativa');
            }

            supabase.auth.onAuthStateChange(async (event, newSession) => {
                console.log(`🔔 Auth event: ${event}`);

                session.value = newSession;

                if (newSession) {
                    await fetchUserData(newSession.user.id, true);
                } else {
                    user.value = null;

                    storeCache.invalidateNamespace('auth');
                    console.log('🗑️  Cache de auth limpo');
                }
            });

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'initializeAuth');
            console.error(friendlyMessage);
        } finally {
            loading.value = false;
        }
    };

    const login = async (email, password) => {
        loading.value = true;
        clearError();

        try {
            console.log('🔑 Tentando fazer login...');

            storeCache.invalidateNamespace('auth');

            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            session.value = data.session;

            await fetchUserData(data.user.id, true);

            console.log('✅ Login realizado com sucesso');
            return { success: true, data };

        } catch (err) {
            let friendlyMessage;

            if (err.message?.includes('Invalid login credentials')) {
                friendlyMessage = 'Email ou senha incorretos. Tente novamente.';
            } else if (err.message?.includes('Email not confirmed')) {
                friendlyMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
            } else if (err.message?.includes('User not found')) {
                friendlyMessage = 'Usuário não encontrado. Verifique o email digitado.';
            } else {
                friendlyMessage = ErrorHandler.handle(err, 'login', { email });
            }

            setError(friendlyMessage);
            console.error('❌ Erro no login:', friendlyMessage);

            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const register = async (userData) => {
        loading.value = true;
        clearError();

        try {
            console.log('📝 Tentando registrar usuário...');

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

            console.log('✅ Usuário registrado com sucesso');
            return { success: true, data: userRecord };

        } catch (err) {
            let friendlyMessage;

            // Detectar erros específicos de registro
            if (err.code === '23505' || err.message?.includes('already registered')) {
                friendlyMessage = 'Este email já está cadastrado. Tente fazer login.';
            } else if (err.message?.includes('Password should be at least')) {
                friendlyMessage = 'A senha deve ter no mínimo 6 caracteres.';
            } else if (err.message?.includes('Invalid email')) {
                friendlyMessage = 'Email inválido. Verifique o formato.';
            } else {
                friendlyMessage = ErrorHandler.handle(err, 'register', {
                    email: userData.email,
                    name: userData.name
                });
            }

            setError(friendlyMessage);
            console.error('❌ Erro no registro:', friendlyMessage);

            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    const logout = async () => {
        loading.value = true;
        clearError();

        try {
            console.log('🚪 Fazendo logout...');

            const { error: logoutError } = await supabase.auth.signOut();
            if (logoutError) throw logoutError;

            user.value = null;
            session.value = null;

            storeCache.clear();
            console.log('🗑️  TODO o cache foi limpo (segurança)');

            console.log('✅ Logout realizado com sucesso');
            return { success: true };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'logout');
            setError(friendlyMessage);
            console.error('❌ Erro no logout:', friendlyMessage);

            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };



    const resetPassword = async (email) => {
        loading.value = true;
        clearError();

        try {
            console.log('📧 Enviando email de recuperação...');

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            console.log('✅ Email de recuperação enviado');
            return { success: true, message: 'Email de recuperação enviado! Verifique sua caixa de entrada.' };

        } catch (err) {
            let friendlyMessage;

            if (err.message?.includes('User not found')) {
                friendlyMessage = 'Email não encontrado. Verifique se está correto.';
            } else if (err.message?.includes('Email rate limit exceeded')) {
                friendlyMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
            } else {
                friendlyMessage = ErrorHandler.handle(err, 'resetPassword', { email });
            }

            setError(friendlyMessage);
            console.error('❌ Erro ao resetar senha:', friendlyMessage);

            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    const updatePassword = async (newPassword) => {
        loading.value = true;
        clearError();

        try {
            console.log('🔒 Atualizando senha...');

            if (newPassword.length < 6) {
                throw new Error('A senha deve ter no mínimo 6 caracteres.');
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            console.log('✅ Senha atualizada com sucesso');
            return { success: true, message: 'Senha atualizada com sucesso!' };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updatePassword');
            setError(friendlyMessage);
            console.error('❌ Erro ao atualizar senha:', friendlyMessage);

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

        refreshSession 
    };
});