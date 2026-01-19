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
                    return cached;
                }
            }

            const { data, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_uuid', authUuid)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (!data) {
                console.warn('⚠️ Usuário não encontrado na tabela public.users');
                // Não zeramos user.value aqui para evitar UI flickering se for um erro temporário de rede
                return null;
            }

            user.value = data;
            const cacheKey = `auth:user:${authUuid}`;
            storeCache.set(cacheKey, data, CacheTTL.SHORT);

            return data;

        } catch (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            return null;
        }
    };

    const initializeAuth = async () => {
        if (loading.value) return; // Evita múltiplas inicializações
        loading.value = true;

        try {
            console.log('🔐 Inicializando autenticação...');

            // 1. Obter sessão inicial
            const { data: { session: currentSession } } = await supabase.auth.getSession();

            if (currentSession) {
                session.value = currentSession;
                await fetchUserData(currentSession.user.id);
            }

            // 2. Configurar Listener de Mudança de Estado (Login, Logout, Token Refresh)
            supabase.auth.onAuthStateChange(async (event, newSession) => {
                console.log(`🔔 Auth event: ${event}`);
                
                // Ignora eventos que não mudam a sessão efetivamente para evitar re-render desnecessário
                if (event === 'initial_session' && session.value?.access_token === newSession?.access_token) {
                    return;
                }

                session.value = newSession;

                if (newSession) {
                    // Apenas busca dados do usuário se o ID mudou ou se não temos dados
                    if (!user.value || user.value.auth_uuid !== newSession.user.id) {
                        await fetchUserData(newSession.user.id, true);
                    } else if (event === 'TOKEN_REFRESHED') {
                        // Opcional: Atualizar cache silenciosamente no refresh
                        fetchUserData(newSession.user.id, true).catch(console.error);
                    }
                } else {
                    user.value = null;
                    storeCache.invalidateNamespace('auth');
                }
            });

            // 3. Lógica Simplificada de Visibilidade
            const ensureSessionOnVisible = async () => {
                if (document.visibilityState === 'visible') {
                    console.log('👀 Aba visível - verificando integridade da sessão...');
                    
                    // Apenas verifica se a sessão atual ainda é válida no servidor
                    const { data, error } = await supabase.auth.getSession();
                    
                    if (error || !data.session) {
                        // Se o servidor diz que não tem sessão, mas nós temos localmente, algo está errado.
                        // O onAuthStateChange (SIGNED_OUT) geralmente cuida disso, mas podemos forçar:
                        if (session.value) {
                            console.log('Sessão expirada no servidor. Fazendo logout local.');
                            session.value = null;
                            user.value = null;
                        }
                    } else if (data.session) {
                        // Sessão válida. Se o token mudou, atualizamos.
                        if (session.value?.access_token !== data.session.access_token) {
                            session.value = data.session;
                        }
                        
                        // Garante que temos os dados do usuário na memória
                        if (!user.value && data.session.user) {
                            await fetchUserData(data.session.user.id);
                        }
                    }
                }
            };

            if (!window.__recuperaEnsureSessionOnVisible) {
                window.__recuperaEnsureSessionOnVisible = ensureSessionOnVisible;
                document.addEventListener('visibilitychange', window.__recuperaEnsureSessionOnVisible);
            }

        } catch (err) {
            console.error('Erro fatal na autenticação:', err);
        } finally {
            loading.value = false;
        }
    };

    const login = async (email, password) => {
        loading.value = true;
        clearError();

        try {
            storeCache.invalidateNamespace('auth');
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;
            
            // O onAuthStateChange vai capturar isso, mas podemos adiantar
            session.value = data.session;
            await fetchUserData(data.user.id, true);

            return { success: true, data };
        } catch (err) {
            let friendlyMessage = 'Erro ao fazer login.';
            if (err.message?.includes('Invalid login')) friendlyMessage = 'Email ou senha incorretos.';
            
            setError(friendlyMessage);
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
                    data: { name: userData.name, phone: userData.phone }
                }
            });

            if (signUpError) throw signUpError;

            // Inserir na tabela pública de usuários
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

            // Criar assinatura se necessário
            if (userData.plan) {
                 // Lógica de plano simplificada para este snippet
                 await supabase.from('user_subscriptions').insert({
                    user_id: userRecord.id,
                    plan_id: userData.plan,
                    status: 'active'
                 });
            }

            return { success: true, data: userRecord };

        } catch (err) {
            setError(err.message || 'Erro no cadastro.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        loading.value = true;
        try {
            await supabase.auth.signOut();
            user.value = null;
            session.value = null;
            storeCache.clear();
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (email) => {
        loading.value = true;
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updatePassword = async (newPassword) => {
        loading.value = true;
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const refreshSession = async () => {
        const { data, error } = await supabase.auth.refreshSession();
        if (data.session) {
            session.value = data.session;
            return true;
        }
        return false;
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