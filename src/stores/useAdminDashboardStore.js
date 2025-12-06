import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, createCacheKey, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

export const useAdminDashboardStore = defineStore('adminDashboard', () => {

    const stats = ref({
        monthlyRevenue: 0,
        monthlyBillings: 0,
        totalFilteredRevenue: 0,
        revenueGrowth: 0,
        billingGrowth: 0,
        totalGrowth: 0,
        historyTotalRevenue: 0,
        averageRecoveryRate: 0
    });

    const timelineData = ref([]);

    const leadsDistribution = ref({
        novos: 0,
        engajados: 0,
        qualificados: 0,
        convertidos: 0
    });

    const loading = ref(false);
    const error = ref(null);


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const calculateGrowth = (current, previous) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const growth = ((current - previous) / previous) * 100;
        return (growth > 0 ? "+" : "") + growth.toFixed(1) + "%";
    };

    /**
     * Retorna os dados formatados prontos para exibição na UI
     */
    const formattedStats = computed(() => ({
        monthlyRevenue: formatCurrency(stats.value.monthlyRevenue),
        monthlyBillings: formatCurrency(stats.value.monthlyBillings),
        totalFilteredRevenue: formatCurrency(stats.value.totalFilteredRevenue),
        historyTotalRevenue: formatCurrency(stats.value.historyTotalRevenue),
        revenueGrowth: stats.value.revenueGrowth,
        billingGrowth: stats.value.billingGrowth,
        totalGrowth: stats.value.totalGrowth,
        averageRecoveryRate: stats.value.averageRecoveryRate
    }));

    const setError = (message) => {
        error.value = message;
        setTimeout(() => { error.value = null; }, 5000);
    };

    const clearError = () => {
        error.value = null;
    };


    /**
     * Busca estatísticas principais via RPC (OTIMIZADO)
     * ✅ 1 Requisição ao invés de 6
     * ✅ Usa Cache
     */
    const fetchDashboardStats = async (filters = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            if (!authStore.isAdmin) throw new Error('Acesso negado.');

            const { startDate, endDate, isAllTime } = filters;

            const cacheKey = createCacheKey('admin_dashboard_stats', authStore.user.id, filters);

            const cached = storeCache.get(cacheKey);
            if (cached) {
                stats.value = cached;
                loading.value = false;
                console.log('✅ Dashboard Stats carregados do CACHE');
                return { success: true, data: cached, fromCache: true };
            }

            console.log('⏳ Buscando estatísticas via RPC...');

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : new Date();

            let prevStart = null;
            let prevEnd = null;

            if (start && !isAllTime) {
                const duration = end.getTime() - start.getTime();
                prevEnd = new Date(start.getTime());
                prevStart = new Date(prevEnd.getTime() - duration);
            }

            const { data, error: rpcError } = await supabase.rpc('get_admin_dashboard_stats', {
                p_start_date: start,
                p_end_date: end,
                p_prev_start_date: prevStart,
                p_prev_end_date: prevEnd
            });

            if (rpcError) throw rpcError;

            // CORREÇÃO: data agora é um objeto JSON direto, não um array
            console.log('📊 Dados recebidos da RPC:', data);

            const newStats = {
                monthlyRevenue: parseFloat(data.current_revenue) || 0,
                monthlyBillings: parseFloat(data.current_commissions) || 0,
                totalFilteredRevenue: (parseFloat(data.current_revenue) || 0) + (parseFloat(data.current_commissions) || 0),

                historyTotalRevenue: parseFloat(data.history_total_revenue) || 0,
                averageRecoveryRate: parseFloat(data.average_recovery_rate) || 0,

                revenueGrowth: isAllTime ? "-" : calculateGrowth(
                    parseFloat(data.current_revenue) || 0,
                    parseFloat(data.prev_revenue) || 0
                ),
                billingGrowth: isAllTime ? "-" : calculateGrowth(
                    parseFloat(data.current_commissions) || 0,
                    parseFloat(data.prev_commissions) || 0
                ),
                totalGrowth: isAllTime ? "-" : calculateGrowth(
                    (parseFloat(data.current_revenue) || 0) + (parseFloat(data.current_commissions) || 0),
                    (parseFloat(data.prev_revenue) || 0) + (parseFloat(data.prev_commissions) || 0)
                )
            };

            console.log('✅ Stats processadas:', newStats);

            stats.value = newStats;

            storeCache.set(cacheKey, newStats, CacheTTL.SHORT);

            return { success: true, data: newStats, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchDashboardStats', { filters });
            setError(friendlyMessage);
            console.error('❌ Erro ao buscar stats:', err);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca dados do gráfico de linha
     * Mantido via queries paralelas pois retorna array diário complexo
     */
    const fetchTimeline = async (filters = {}) => {

        try {
            const authStore = useAuthStore();
            const { startDate, endDate } = filters;

            const cacheKey = createCacheKey('admin_timeline', authStore.user.id, filters);

            const cached = storeCache.get(cacheKey);
            if (cached) {
                timelineData.value = cached;
                return { success: true, data: cached, fromCache: true };
            }

            const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();

            const [revResult, commResult] = await Promise.all([
                supabase.from('user_subscriptions')
                    .select('total_invested, created_at')
                    .gte('created_at', start.toISOString())
                    .lte('created_at', end.toISOString()),

                supabase.from('opportunities')
                    .select('value, converted_value, created_at')
                    .eq('status', 'won')
                    .is('deleted_at', null)
                    .gte('created_at', start.toISOString())
                    .lte('created_at', end.toISOString())
            ]);

            if (revResult.error) throw revResult.error;
            if (commResult.error) throw commResult.error;

            // Agrupamento por dia
            const dailyData = {};
            const addToDay = (dateStr, value) => {
                const day = dateStr.split('T')[0];
                if (!dailyData[day]) dailyData[day] = 0;
                dailyData[day] += value;
            };

            revResult.data?.forEach(r => addToDay(r.created_at, parseFloat(r.total_invested) || 0));
            commResult.data?.forEach(c => {
                const value = parseFloat(c.converted_value || c.value) || 0;
                addToDay(c.created_at, value * 0.20);
            });

            const timeline = [];
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                const dayStr = date.toISOString().split('T')[0];

                timeline.push({
                    date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date),
                    value: dailyData[dayStr] || 0
                });
            }

            timelineData.value = timeline;
            storeCache.set(cacheKey, timeline, CacheTTL.SHORT);

            return { success: true, data: timeline };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchTimeline');
            console.error(friendlyMessage);
            return { success: false, error: err };
        }
    };

    /**
     * Busca distribuição de leads (Pie Chart)
     */
    const fetchDistribution = async () => {
        try {
            const authStore = useAuthStore();
            const cacheKey = `admin_distribution:${authStore.user.id}`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                leadsDistribution.value = cached;
                return { success: true, data: cached };
            }

            const { data: opportunities, error } = await supabase
                .from('opportunities')
                .select('status')
                .is('deleted_at', null);

            if (error) throw error;

            if (!opportunities || opportunities.length === 0) {
                const emptyDist = { novos: 0, engajados: 0, qualificados: 0, convertidos: 0 };
                leadsDistribution.value = emptyDist;
                return { success: true, data: emptyDist };
            }

            const statusCount = { active: 0, lost: 0, paused: 0, won: 0 };
            const total = opportunities.length;

            opportunities.forEach(opp => {
                const s = opp.status?.toLowerCase() || 'active';
                if (statusCount[s] !== undefined) statusCount[s]++;
                else statusCount.active++;
            });

            const distribution = {
                novos: ((statusCount.active / total) * 100) || 0,
                engajados: ((statusCount.lost / total) * 100) || 0,
                qualificados: ((statusCount.paused / total) * 100) || 0,
                convertidos: ((statusCount.won / total) * 100) || 0
            };

            leadsDistribution.value = distribution;
            storeCache.set(cacheKey, distribution, CacheTTL.MEDIUM);

            return { success: true, data: distribution };

        } catch (err) {
            console.error('Erro fetchDistribution:', err);
            return { success: false, error: err };
        }
    };

    return {
        stats,
        timelineData,
        leadsDistribution,
        loading,
        error,

        formattedStats,

        fetchDashboardStats,
        fetchTimeline,
        fetchDistribution,
        clearError
    };
});