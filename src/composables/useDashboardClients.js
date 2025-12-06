import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { formatCurrency } from '../utils/formatters';

export const useDashboardClients = () => {
    const localLoading = ref(true);
    const clientsWithGuarantee = ref([]);
    const error = ref(null);

    /**
     * Configuração de status para clientes
     */
    const clientStatusConfig = (status) => {
        const configs = {
            active: {
                label: 'Ativo',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '✅'
            },
            trial: {
                label: 'Trial',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                icon: '🔄'
            },
            suspended: {
                label: 'Suspenso',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '⏸️'
            },
            canceled: {
                label: 'Cancelado',
                color: '#6b7280',
                bgColor: 'rgba(107, 114, 128, 0.1)',
                icon: '❌'
            }
        };

        return configs[status] || configs.trial;
    };

    /**
     * Busca métricas de garantia para um cliente específico
     */
    const fetchGuaranteeMetrics = async (clientId, guarantee) => {
        try {
            const { data: opps } = await supabase
                .from('opportunities')
                .select('id, status, value, converted_value')
                .eq('user_id', clientId)
                .gte('created_at', guarantee.start_date)
                .lte('created_at', guarantee.end_date)
                .is('deleted_at', null);

            const opportunities = opps || [];

            return {
                total_opportunities: opportunities.length,
                won_opportunities: opportunities.filter(o => o.status === 'won').length,
                total_value: opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0),
                converted_value: opportunities
                    .filter(o => o.status === 'won')
                    .reduce((sum, o) => sum + (parseFloat(o.converted_value || o.value) || 0), 0)
            };
        } catch (err) {
            console.warn(`Erro ao buscar métricas de garantia:`, err);
            return null;
        }
    };

    /**
     * Busca garantia ativa de um cliente
     */
    const fetchClientGuarantee = async (clientId) => {
        try {
            const { data: guarantee } = await supabase
                .from('guarantees')
                .select('*')
                .eq('user_id', clientId)
                .eq('status', 'active')
                .maybeSingle();

            if (!guarantee) return null;

            const metrics = await fetchGuaranteeMetrics(clientId, guarantee);

            return {
                ...guarantee,
                ...metrics
            };
        } catch (err) {
            console.warn(`Erro ao buscar garantia do cliente ${clientId}:`, err);
            return null;
        }
    };

    /**
     * Busca clientes da plataforma com métricas
     */
    const fetchPlatformClients = async () => {
        try {
            const { data: clientsData, error: clientsError } = await supabase
                .from('users')
                .select(`
                    id,
                    name,
                    email,
                    phone,
                    status,
                    annual_investment,
                    created_at,
                    cs_name
                `)
                .eq('role', 'user')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (clientsError) throw clientsError;

            const clientsWithMetrics = await Promise.all(
                (clientsData || []).map(async (client) => {
                    const { data: opps } = await supabase
                        .from('opportunities')
                        .select('id, status, value, converted_value')
                        .eq('user_id', client.id)
                        .is('deleted_at', null);

                    const opportunities = opps || [];
                    const wonOpps = opportunities.filter(o => o.status === 'won');
                    const totalRecovered = wonOpps.reduce((sum, o) =>
                        sum + (parseFloat(o.converted_value || o.value) || 0), 0
                    );

                    const conversionRate = opportunities.length > 0
                        ? (wonOpps.length / opportunities.length) * 100
                        : 0;

                    return {
                        ...client,
                        metrics: {
                            totalOpportunities: opportunities.length,
                            wonOpportunities: wonOpps.length,
                            totalRecovered,
                            conversionRate: conversionRate.toFixed(1),
                            roi: client.annual_investment > 0
                                ? ((totalRecovered / client.annual_investment) * 100).toFixed(1)
                                : 0
                        }
                    };
                })
            );

            return clientsWithMetrics;
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
            throw err;
        }
    };

    /**
     * Calcula meses ativos do cliente
     */
    const calculateActiveMonths = (createdAt) => {
        const createdDate = new Date(createdAt);
        const today = new Date();

        return Math.max(1,
            (today.getFullYear() - createdDate.getFullYear()) * 12 +
            (today.getMonth() - createdDate.getMonth())
        );
    };

    /**
     * Enriquece dados do cliente com garantia e meses ativos
     */
    const enrichClientData = async (client) => {
        try {
            const guarantee = await fetchClientGuarantee(client.id);
            const activeMonths = calculateActiveMonths(client.created_at);

            return {
                ...client,
                active_months: activeMonths,
                active_guarantee: guarantee
            };
        } catch (err) {
            console.warn(`Erro ao enriquecer dados do cliente ${client.id}:`, err);
            return {
                ...client,
                active_months: 1,
                active_guarantee: null
            };
        }
    };

    /**
     * Carrega todos os clientes com suas garantias
     */
    const loadClientsWithGuarantees = async () => {
        localLoading.value = true;
        error.value = null;

        try {
            const clients = await fetchPlatformClients();

            const enrichedClients = await Promise.all(
                clients.map(client => enrichClientData(client))
            );

            clientsWithGuarantee.value = enrichedClients;
        } catch (err) {
            console.error('Erro ao carregar clientes:', err);
            error.value = 'Erro ao carregar dados dos clientes';
        } finally {
            localLoading.value = false;
        }
    };

    /**
     * Calcula dias restantes da garantia
     */
    const getDaysRemaining = (guarantee) => {
        if (!guarantee?.end_date) return null;

        const today = new Date();
        const endDate = new Date(guarantee.end_date);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    };

    /**
     * Retorna status e aparência da garantia
     */
    const getGuaranteeStatus = (guarantee) => {
        if (!guarantee) return null;

        const statusMap = {
            achieved: { label: 'Cumprida', color: '#10b981', icon: '✅' },
            failed: { label: 'Expirada', color: '#ef4444', icon: '❌' }
        };

        if (statusMap[guarantee.status]) {
            return statusMap[guarantee.status];
        }

        const daysRemaining = getDaysRemaining(guarantee);

        if (daysRemaining === 0) {
            return { label: 'Não Cumprida', color: '#ef4444', icon: '⏰' };
        }

        return { label: 'Ativa', color: '#3b82f6', icon: '⏱️' };
    };

    /**
     * Retorna cor baseada no progresso da garantia
     */
    const getProgressColor = (guarantee) => {
        if (!guarantee) return '#6b7280';

        const progress = parseFloat(guarantee.progress_percentage || 0);
        const status = getGuaranteeStatus(guarantee);

        if (status.label === 'Cumprida') return '#10b981';
        if (status.label === 'Expirada' || status.label === 'Não Cumprida') return '#ef4444';

        if (progress >= 75) return '#10b981';
        if (progress >= 50) return '#f59e0b';
        if (progress >= 25) return '#3b82f6';

        return '#ef4444';
    };

    /**
     * Formata percentual
     */
    const formatPercent = (value) => {
        const num = parseFloat(value) || 0;
        return `${num.toFixed(1)}%`;
    };

    /**
     * Verifica se há clientes carregados
     */
    const hasClientsData = computed(() => {
        return clientsWithGuarantee.value && clientsWithGuarantee.value.length > 0;
    });

    /**
     * Retorna estatísticas gerais dos clientes
     */
    const clientsStats = computed(() => {
        if (!hasClientsData.value) {
            return {
                total: 0,
                withActiveGuarantee: 0,
                averageConversion: 0,
                totalRevenue: 0
            };
        }

        return clientsWithGuarantee.value.reduce((acc, client) => {
            acc.total++;

            if (client.active_guarantee) {
                acc.withActiveGuarantee++;
            }

            if (client.metrics?.conversionRate) {
                acc.conversionSum += parseFloat(client.metrics.conversionRate);
                acc.conversionCount++;
            }

            acc.totalRevenue += parseFloat(client.metrics?.totalRecovered || 0);

            return acc;
        }, {
            total: 0,
            withActiveGuarantee: 0,
            conversionSum: 0,
            conversionCount: 0,
            totalRevenue: 0,
            get averageConversion() {
                return this.conversionCount > 0
                    ? (this.conversionSum / this.conversionCount).toFixed(1)
                    : 0;
            }
        });
    });

    return {
        localLoading,
        clientsWithGuarantee,
        error,

        hasClientsData,
        clientsStats,

        loadClientsWithGuarantees,

        getDaysRemaining,
        getGuaranteeStatus,
        getProgressColor,
        formatPercent,
        clientStatusConfig,
        formatCurrency
    };
};