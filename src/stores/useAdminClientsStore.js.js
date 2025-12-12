import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';

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

    /**
     * Busca todos os clientes da plataforma (usuários com role='user')
     * Inclui métricas agregadas de cada cliente
     */
    const fetchPlatformClients = async (filters = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const adminId = authStore.user?.id;

            if (!adminId) {
                throw new Error('Usuário não autenticado');
            }

            // Verificar se é admin
            if (!authStore.isAdmin) {
                throw new Error('Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
            }

            const {
                page = 1,
                limit = 50,
                status = null,
                search = ''
            } = filters;

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

            // Filtro por status
            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            // Filtro por busca (nome ou email)
            if (search && search.trim() !== '') {
                const searchTerm = search.trim();
                query = query.or(
                    `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
                );
            }

            // Paginação
            query = query.range(from, to);

            const { data: clientsData, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            // Buscar métricas para cada cliente
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

            return { success: true, data: clientsWithMetrics, count };
        } catch (err) {
            console.error('Erro ao buscar clientes da plataforma:', err);
            setError('Erro ao carregar clientes.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca métricas agregadas de um cliente específico
     */
    const fetchClientMetrics = async (clientId) => {
        try {
            // Buscar oportunidades do cliente
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

            // Buscar informações de assinatura
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
            return { success: false, error: err };
        }
    };

    /**
     * Busca detalhes completos de um cliente específico
     * Usado quando admin acessa o dashboard/oportunidades do cliente
     */
    const fetchClientById = async (clientId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();

            if (!authStore.isAdmin) {
                throw new Error('Acesso negado.');
            }

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

            // Buscar métricas
            const metricsResult = await fetchClientMetrics(clientId);

            const fullClient = {
                ...clientData,
                metrics: metricsResult.data || {}
            };

            currentClient.value = fullClient;

            return { success: true, data: fullClient };
        } catch (err) {
            console.error('Erro ao buscar cliente:', err);
            setError('Erro ao carregar detalhes do cliente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atualiza status de um cliente
     */
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

            // Atualizar no array de clientes
            const index = clients.value.findIndex(c => c.id === clientId);
            if (index !== -1) {
                clients.value[index] = { ...clients.value[index], ...data };
            }

            if (currentClient.value?.id === clientId) {
                currentClient.value = { ...currentClient.value, ...data };
            }

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar status do cliente:', err);
            setError('Erro ao atualizar status.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca estatísticas gerais da plataforma
     */
    const fetchPlatformStats = async () => {
        try {
            const authStore = useAuthStore();

            if (!authStore.isAdmin) {
                throw new Error('Acesso negado.');
            }

            // Total de clientes
            const { count: totalClients } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'user')
                .is('deleted_at', null);

            // Clientes ativos
            const { count: activeClients } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'user')
                .eq('status', 'active')
                .is('deleted_at', null);

            // Clientes em trial
            const { count: trialClients } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'user')
                .eq('status', 'trial')
                .is('deleted_at', null);

            // Total de oportunidades
            const { count: totalOpportunities } = await supabase
                .from('opportunities')
                .select('*', { count: 'exact', head: true })
                .is('deleted_at', null);

            return {
                success: true,
                data: {
                    totalClients: totalClients || 0,
                    activeClients: activeClients || 0,
                    trialClients: trialClients || 0,
                    totalOpportunities: totalOpportunities || 0
                }
            };
        } catch (err) {
            console.error('Erro ao buscar estatísticas da plataforma:', err);
            return { success: false, error: err };
        }
    };

    /**
     * Limpa dados da store
     */
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