import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, createCacheKey, createInvalidationPattern, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

export const useAdminClientsStore = defineStore('adminClients', () => {

    const clients = ref([]);
    const currentClient = ref(null);
    const totalCount = ref(0);
    const loading = ref(false);
    const error = ref(null);

    const setError = (message) => {
        error.value = message;
        setTimeout(() => {
            error.value = null;
        }, 5000);
    };

    const clearError = () => {
        error.value = null;
    };

    const fetchPlatformClients = async (filters = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const adminId = authStore.user?.id;

            if (!adminId) {
                throw new Error('Usuário não autenticado');
            }

            if (!authStore.isAdmin) {
                throw new Error('Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
            }

            const {
                page = 1,
                limit = 50,
                status = null,
                search = ''
            } = filters;

            const cacheKey = createCacheKey('admin-clients', adminId, { page, limit, status, search });

            const cached = storeCache.get(cacheKey);
            if (cached) {
                clients.value = cached.data;
                totalCount.value = cached.count;
                loading.value = false;

                console.log('✅ Clientes (admin) carregados do CACHE:', cacheKey);
                return { success: true, data: cached.data, count: cached.count, fromCache: true };
            }

            console.log('⏳ Cache MISS, tentando RPC otimizado...');

            const offset = (page - 1) * limit;

            try {
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_clients_with_metrics', {
                    p_admin_id: adminId,
                    p_status: status === 'all' ? null : status,
                    p_search: search || null,
                    p_limit: limit,
                    p_offset: offset
                });

                if (!rpcError && rpcData) {
                    const transformedData = rpcData.map(row => ({
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        phone: row.phone,
                        status: row.status,
                        role: row.role,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        metrics: {
                            totalOpportunities: row.total_opportunities || 0,
                            wonOpportunities: row.won_opportunities || 0,
                            lostOpportunities: row.lost_opportunities || 0,
                            activeOpportunities: row.active_opportunities || 0,
                            totalRecovered: row.total_recovered || 0,
                            conversionRate: row.conversion_rate || 0,
                            subscriptionStatus: row.subscription_status,
                            planName: row.plan_name,
                            monthlyFee: row.monthly_fee
                        }
                    }));

                    clients.value = transformedData;

                    const { count } = await supabase
                        .from('users')
                        .select('*', { count: 'exact', head: true })
                        .eq('role', 'user')
                        .is('deleted_at', null);

                    totalCount.value = count || 0;

                    storeCache.set(cacheKey, { data: transformedData, count }, CacheTTL.SHORT);
                    console.log('💾 Clientes (admin) salvos no CACHE via RPC');

                    return { success: true, data: transformedData, count, fromCache: false, source: 'rpc' };
                }
            } catch (rpcError) {
                console.warn('⚠️  RPC get_all_clients_with_metrics não disponível, usando fallback:', rpcError.message);
            }

            console.log('📋 Usando query normal (fallback)');

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            // Query base para buscar usuários
            let query = supabase
                .from('users')
                .select(`
                    id,
                    name,
                    email,
                    phone,
                    status,
                    role,
                    created_at,
                    updated_at
                `, { count: 'exact' })
                .eq('role', 'user')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            if (search && search.trim() !== '') {
                const searchTerm = search.trim();
                query = query.or(
                    `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
                );
            }

            query = query.range(from, to);

            const { data: clientsData, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            console.log('⚠️  Buscando métricas individualmente (lento - use RPC!)');

            const clientsWithMetrics = await Promise.all(
                (clientsData || []).map(async (client) => {
                    const metrics = await fetchClientMetrics(client.id);
                    return {
                        ...client,
                        metrics: metrics.data || {
                            totalOpportunities: 0,
                            wonOpportunities: 0,
                            lostOpportunities: 0,
                            activeOpportunities: 0,
                            totalRecovered: 0,
                            conversionRate: 0
                        }
                    };
                })
            );

            clients.value = clientsWithMetrics;
            totalCount.value = count || 0;

            storeCache.set(cacheKey, { data: clientsWithMetrics, count }, CacheTTL.SHORT);
            console.log('💾 Clientes (admin) salvos no CACHE via fallback');

            return { success: true, data: clientsWithMetrics, count, fromCache: false, source: 'fallback' };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchPlatformClients', { filters });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const fetchClientMetrics = async (clientId) => {
        try {
            const { data: opportunities, error: oppError } = await supabase
                .from('opportunities')
                .select('id, status, value, converted_value')
                .eq('user_id', clientId)
                .is('deleted_at', null);

            if (oppError) throw oppError;

            const opps = opportunities || [];

            const metrics = {
                totalOpportunities: opps.length,
                wonOpportunities: opps.filter(o => o.status === 'won').length,
                lostOpportunities: opps.filter(o => o.status === 'lost').length,
                activeOpportunities: opps.filter(o => o.status === 'active').length,
                totalRecovered: opps
                    .filter(o => o.status === 'won')
                    .reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0),
                conversionRate: opps.length > 0
                    ? ((opps.filter(o => o.status === 'won').length / opps.length) * 100).toFixed(1)
                    : 0
            };

            const { data: subscription } = await supabase
                .from('user_subscriptions')
                .select('status, plan_name, monthly_fee')
                .eq('user_id', clientId)
                .order('created_at', { ascending: false })
                .limit(1)

            if (subscription) {
                metrics.subscriptionStatus = subscription.status;
                metrics.planName = subscription.plan_name;
                metrics.monthlyFee = subscription.monthly_fee;
            }

            return { success: true, data: metrics };
        } catch (err) {
            console.error('Erro ao buscar métricas do cliente:', err);
            return { success: false, error: err, data: null };
        }
    };

    const fetchClientById = async (clientId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();

            if (!authStore.isAdmin) {
                throw new Error('Acesso negado.');
            }

            const found = clients.value.find(c => c.id === clientId);
            if (found && found.metrics) {
                currentClient.value = found;
                loading.value = false;
                console.log('✅ Cliente encontrado na lista local');
                return { success: true, data: found, source: 'local' };
            }

            const cacheKey = `admin-clients:${authStore.user.id}:detail:${clientId}`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                currentClient.value = cached;
                loading.value = false;
                console.log('✅ Cliente carregado do CACHE');
                return { success: true, data: cached, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco...');

            // Buscar dados do cliente
            const { data: clientData, error: clientError } = await supabase
                .from('users')
                .select(`
                    id,
                    name,
                    email,
                    phone,
                    status,
                    role,
                    created_at,
                    updated_at
                `)
                .eq('id', clientId)
                .eq('role', 'user')
                .is('deleted_at', null)
                .single();

            if (clientError) throw clientError;

            const metricsResult = await fetchClientMetrics(clientId);

            const fullClient = {
                ...clientData,
                metrics: metricsResult.data || {}
            };

            currentClient.value = fullClient;

            storeCache.set(cacheKey, fullClient, CacheTTL.SHORT);
            console.log('💾 Cliente salvo no CACHE');

            return { success: true, data: fullClient, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchClientById', { clientId });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updateClientStatus = async (clientId, newStatus) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();

            if (!authStore.isAdmin) {
                throw new Error('Acesso negado.');
            }

            const { data, error: updateError } = await supabase
                .from('users')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', clientId)
                .select()
                .single();

            if (updateError) throw updateError;

            const index = clients.value.findIndex(c => c.id === clientId);
            if (index !== -1) {
                clients.value[index] = { ...clients.value[index], ...data };
            }

            if (currentClient.value?.id === clientId) {
                currentClient.value = { ...currentClient.value, ...data };
            }

            const pattern = createInvalidationPattern('admin-clients', authStore.user.id);
            storeCache.invalidatePattern(pattern);
            console.log('🗑️  Cache invalidado após update status');

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateClientStatus', {
                clientId,
                newStatus
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    const fetchPlatformStats = async () => {
        try {
            const authStore = useAuthStore();

            if (!authStore.isAdmin) {
                throw new Error('Acesso negado.');
            }

            const cacheKey = `admin-clients:${authStore.user.id}:stats`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                console.log('✅ Stats da plataforma carregadas do CACHE');
                return { success: true, data: cached, fromCache: true };
            }

            console.log('⏳ Buscando stats da plataforma...');

            const [
                { count: totalClients },
                { count: activeClients },
                { count: trialClients },
                { count: totalOpportunities }
            ] = await Promise.all([
                supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'user')
                    .is('deleted_at', null),

                supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'user')
                    .eq('status', 'active')
                    .is('deleted_at', null),

                supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'user')
                    .eq('status', 'trial')
                    .is('deleted_at', null),

                supabase
                    .from('opportunities')
                    .select('*', { count: 'exact', head: true })
                    .is('deleted_at', null)
            ]);

            const stats = {
                totalClients: totalClients || 0,
                activeClients: activeClients || 0,
                trialClients: trialClients || 0,
                totalOpportunities: totalOpportunities || 0
            };

            storeCache.set(cacheKey, stats, CacheTTL.SHORT);
            console.log('💾 Stats da plataforma salvas no CACHE');

            return { success: true, data: stats, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchPlatformStats');
            console.error(friendlyMessage);
            return { success: false, error: err };
        }
    };


    const clearClients = () => {
        clients.value = [];
        totalCount.value = 0;
        clearError();
    };

    const clearCurrentClient = () => {
        currentClient.value = null;
    };


    return {
        clients,
        currentClient,
        totalCount,
        loading,
        error,

        fetchPlatformClients,
        fetchClientMetrics,
        fetchClientById,
        updateClientStatus,
        fetchPlatformStats,
        clearClients,
        clearCurrentClient,
        clearError
    };
});

