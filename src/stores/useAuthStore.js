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

            console.log('⏳ Buscando user data do banco...', { authUuid, skipCache });
            const start = Date.now();

            const { data, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_uuid', authUuid)
                .maybeSingle();

            const duration = Date.now() - start;
            console.log('fetchUserData: query finished', { authUuid, duration, fetchError, dataExists: !!data });

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
                    const fetched = await fetchUserData(newSession.user.id, true);

                    // Se não achou user no banco, tentar criar automaticamente usando user_metadata
                    if (!fetched) {
                        try {
                            console.log('initializeAuth: user não encontrado — tentando criar a partir de auth metadata');
                            const metadata = newSession.user.user_metadata || {};
                            const toInsert = {
                                auth_uuid: newSession.user.id,
                                email: newSession.user.email,
                                name: metadata.name || null,
                                phone: metadata.phone || null,
                                role: metadata.role || 'user',
                                status: 'trial'
                            };

                            const { data: createdUser, error: createError } = await supabase
                                .from('users')
                                .insert(toInsert)
                                .select()
                                .single();

                            if (createError) {
                                console.warn('initializeAuth: falha ao criar user automático', createError);
                            } else {
                                user.value = createdUser;
                                const cacheKey = `auth:user:${newSession.user.id}`;
                                storeCache.set(cacheKey, createdUser, CacheTTL.SHORT);
                                console.log('initializeAuth: user criado e salvo no cache', createdUser);
                            }
                        } catch (err) {
                            console.error('initializeAuth: erro ao tentar criar user automaticamente', err);
                        }
                    }
                } else {
                    user.value = null;

                    storeCache.invalidateNamespace('auth');
                    console.log('🗑️  Cache de auth limpo');
                }
            });

            // Quando o usuário volta para a aba (visibilitychange) ou a janela ganha foco,
            // assegurar que a sessão está ativa/atualizada e reobter user data se necessário.
            const ensureSessionOnVisible = async () => {
                try {
                    if (document.visibilityState === 'visible') {
                        console.log('👀 Aba visível — verificando sessão...');

                        console.log('ensureSessionOnVisible: session.value (store) =', session.value);

                        // tentar renovar sessão primeiro e logar resultado
                        try {
                            const refreshed = await refreshSession();
                            console.log('ensureSessionOnVisible: refreshSession result =', refreshed);
                        } catch (refreshErr) {
                            console.warn('ensureSessionOnVisible: refreshSession threw', refreshErr);
                        }

                        const { data: { session: freshSession } } = await supabase.auth.getSession();
                        console.log('ensureSessionOnVisible: getSession freshSession =', freshSession);

                        if (freshSession) {
                            // se mudou ou não existe em memória, atualizar e buscar user
                            if (!session.value || session.value?.user?.id !== freshSession.user.id || session.value?.access_token !== freshSession.access_token) {
                                console.log('ensureSessionOnVisible: sessão diferente — atualizando e buscando user');
                                session.value = freshSession;
                                try {
                                    // proteger fetchUserData com timeout para evitar hangs
                                    const fetchWithTimeout = (p, ms) => {
                                        return Promise.race([
                                            p,
                                            new Promise((_, rej) => setTimeout(() => rej(new Error('fetchUserData timeout')), ms))
                                        ]);
                                    };

                                    await fetchWithTimeout(fetchUserData(freshSession.user.id, true), 6000);
                                    console.log('🔄 Sessão renovada e user reobtido ao voltar à aba');
                                } catch (fetchErr) {
                                    console.error('ensureSessionOnVisible: erro ou timeout ao fetchUserData após refresh', fetchErr);
                                    // fallback: recarregar a página para reinicializar estado do app
                                    try {
                                        // tentar re-inicializar a autenticação antes de recarregar
                                        console.log('ensureSessionOnVisible: tentando re-inicializar auth como fallback');
                                        try {
                                            await initializeAuth();
                                            console.log('ensureSessionOnVisible: initializeAuth retornou (fallback)');
                                            return;
                                        } catch (initErr) {
                                            console.warn('ensureSessionOnVisible: initializeAuth falhou', initErr);
                                        }

                                        // evitar reloads infinitos
                                        window.__recuperaReloadAttempts = (window.__recuperaReloadAttempts || 0) + 1;
                                        console.log('ensureSessionOnVisible: reload attempts =', window.__recuperaReloadAttempts);
                                        if (window.__recuperaReloadAttempts > 1) {
                                            console.warn('ensureSessionOnVisible: já tentou recarregar antes — abortando reload para evitar loop');
                                            // como último recurso, encerrar sessão local e notificar usuário
                                            try {
                                                await supabase.auth.signOut();
                                            } catch (signErr) {
                                                console.warn('ensureSessionOnVisible: signOut também falhou', signErr);
                                            }
                                            user.value = null;
                                            session.value = null;
                                            storeCache.clear();
                                            setError('Sessão inconsistente. Recarregue a página e faça login novamente.');
                                        } else {
                                            console.log('ensureSessionOnVisible: recarregando a página como fallback');
                                            window.location.reload();
                                        }
                                    } catch (reloadErr) {
                                        console.error('ensureSessionOnVisible: falha ao tentar recarregar', reloadErr);
                                    }
                                }
                            } else {
                                console.log('ensureSessionOnVisible: sessão igual — nada a fazer');
                            }
                        } else {
                            console.log('ensureSessionOnVisible: nenhuma sessão ativa após visible check — limpando estado local');
                            user.value = null;
                            session.value = null;
                            storeCache.invalidateNamespace('auth');
                            // se não houver sessão, recarregar a página para evitar estado inconsistente
                            try {
                                window.__recuperaReloadAttempts = (window.__recuperaReloadAttempts || 0) + 1;
                                if (window.__recuperaReloadAttempts > 1) {
                                    console.warn('ensureSessionOnVisible: já tentou recarregar antes — abortando reload para evitar loop');
                                } else {
                                    window.location.reload();
                                }
                            } catch (reloadErr) {
                                console.error('ensureSessionOnVisible: falha ao tentar recarregar após sessão ausente', reloadErr);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Erro ao garantir sessão na visibilidade:', err);
                }
            };

            // Registrar listeners para visibilidade e foco (apenas uma vez)
            if (!window.__recuperaEnsureSessionOnVisible) {
                window.__recuperaEnsureSessionOnVisible = ensureSessionOnVisible;
                document.addEventListener('visibilitychange', window.__recuperaEnsureSessionOnVisible);
                window.addEventListener('focus', window.__recuperaEnsureSessionOnVisible);
            }

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

            console.log('register: before signUp')
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

            console.log('register: after signUp', { authData, signUpError });

            if (signUpError) {
                console.error('register: signUpError', signUpError);
                throw signUpError;
            }

            console.log('register: before insert users')
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

            console.log('register: after insert users', { userRecord, insertError })

            if (insertError) {
                console.error('register: insertError', insertError);
                throw insertError;
            }

            // Se foi passado um plano ao criar o usuário, criar subscription ativa
            let createdSubscription = null;
            if (userData.plan) {
                try {
                    const planId = userData.plan;

                    // Tentar obter dados do plano para popular name/fee
                    const { data: planRow, error: planError } = await supabase
                        .from('plans')
                        .select('id, name, monthly_maintenance_fee')
                        .eq('id', planId)
                        .maybeSingle();

                    if (planError) throw planError;

                    const { data: subData, error: subError } = await supabase
                        .from('user_subscriptions')
                        .insert({
                            user_id: userRecord.id,
                            plan_id: planRow?.id || planId,
                            status: 'active',
                            plan_name: planRow?.name || null,
                            monthly_fee: planRow?.monthly_maintenance_fee || null
                        })
                        .select()
                        .single();

                    if (subError) throw subError;
                    createdSubscription = subData;
                    console.log('✅ Assinatura do usuário criada com sucesso', createdSubscription);
                } catch (subErr) {
                    // Não falhar todo o registro por causa da assinatura — logar e prosseguir
                    console.error('❌ Erro ao criar user_subscription:', subErr);
                }
            }

            console.log('✅ Usuário registrado com sucesso');
            return { success: true, data: { user: userRecord, subscription: createdSubscription } };

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

            // remover listeners de visibilidade/foco se existirem
            try {
                if (window.__recuperaEnsureSessionOnVisible) {
                    document.removeEventListener('visibilitychange', window.__recuperaEnsureSessionOnVisible);
                    window.removeEventListener('focus', window.__recuperaEnsureSessionOnVisible);
                    delete window.__recuperaEnsureSessionOnVisible;
                }
            } catch (e) {
                console.warn('Erro ao remover listeners de visibilidade:', e);
            }

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