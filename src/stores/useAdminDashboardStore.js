import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, createCacheKey, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

const DEFAULT_COMMISSION_RATE = 0.20;

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

    const clampCommissionRate = (rate) => {
        if (Number.isNaN(rate) || rate < 0) return 0;
        if (rate > 1) return 1;
        return rate;
    };

    const resolveOpportunityCommissionRate = (opportunity) => {
        const candidate = opportunity?.product?.commission;
        const parsedCandidate = parseFloat(candidate);
        if (!Number.isNaN(parsedCandidate) && parsedCandidate >= 0) {
            return clampCommissionRate(parsedCandidate);
        }
        return DEFAULT_COMMISSION_RATE;
    };

    const getOpportunityCommissionValue = (opportunity) => {
        const baseValue = parseFloat(opportunity?.converted_value ?? opportunity?.value) || 0;
        if (baseValue <= 0) return 0;
        const commissionRate = resolveOpportunityCommissionRate(opportunity);
        return baseValue * commissionRate;
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

            // Recalcular comissões a partir de oportunidades RECOVERED (usar updated_at)
            let computedCurrentCommissions = null;
            let computedPrevCommissions = null;
            try {
                // current period recovered commissions
                let recQuery = supabase
                    .from('opportunities')
                    .select('converted_value, value, updated_at, product:products(commission)')
                    .eq('status', 'recovered')
                    .is('deleted_at', null);

                if (start && end) {
                    recQuery = recQuery.gte('updated_at', start.toISOString()).lte('updated_at', end.toISOString());
                }

                const { data: recCurr, error: recCurrError } = await recQuery;
                if (recCurrError) throw recCurrError;

                computedCurrentCommissions = (recCurr || []).reduce((sum, opp) => {
                    return sum + getOpportunityCommissionValue(opp);
                }, 0);

                // previous period recovered commissions
                if (prevStart && prevEnd) {
                    const recPrevQuery = await supabase
                        .from('opportunities')
                        .select('converted_value, value, updated_at, product:products(commission)')
                        .eq('status', 'recovered')
                        .is('deleted_at', null)
                        .gte('updated_at', prevStart.toISOString())
                        .lte('updated_at', prevEnd.toISOString());

                    if (recPrevQuery.error) throw recPrevQuery.error;

                    computedPrevCommissions = (recPrevQuery.data || []).reduce((sum, opp) => {
                        return sum + getOpportunityCommissionValue(opp);
                    }, 0);
                } else {
                    computedPrevCommissions = 0;
                }

                // sobrescrever os valores retornados pela RPC para usar recovered
                data.current_commissions = computedCurrentCommissions;
                data.prev_commissions = computedPrevCommissions;
            } catch (e) {
                console.error('Erro ao recalcular comissões recovered:', e);
                // fallback: manter valores da RPC
                data.current_commissions = data.current_commissions || 0;
                data.prev_commissions = data.prev_commissions || 0;
            }

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

                // buscar oportunidades RECOVERED (usaremos updated_at como referência de quando foi recuperada)
                supabase.from('opportunities')
                    .select('value, converted_value, updated_at, product:products(commission)')
                    .eq('status', 'recovered')
                    .is('deleted_at', null)
                    .gte('updated_at', start.toISOString())
                    .lte('updated_at', end.toISOString())
            ]);

            if (revResult.error) throw revResult.error;
            if (commResult.error) throw commResult.error;

            console.log('📊 Dados brutos:', {
                subscriptions: revResult.data?.length || 0,
                opportunities: commResult.data?.length || 0
            });

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let timeline;

            if (diffDays <= 31) {
                timeline = groupByDay(revResult.data, commResult.data, start, end);
            } else if (diffDays <= 90) {
                timeline = groupByWeek(revResult.data, commResult.data, start, end);
            } else {
                timeline = groupByMonth(revResult.data, commResult.data, start, end);
            }

            timelineData.value = timeline;
            storeCache.set(cacheKey, timeline, CacheTTL.SHORT);

            return { success: true, data: timeline };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchTimeline');
            console.error('❌ Erro fetchTimeline:', friendlyMessage);
            timelineData.value = [];
            return { success: false, error: err };
        }
    };

    /**
     * Agrupamento DIÁRIO (para períodos de até 31 dias)
     */
    function groupByDay(subscriptions, opportunities, startDate, endDate) {
        const dailyData = {};

        const addToDay = (dateStr, value) => {
            const day = dateStr.split('T')[0];
            if (!dailyData[day]) dailyData[day] = 0;
            dailyData[day] += value;
        };

        subscriptions?.forEach(r => {
            const value = parseFloat(r.total_invested) || 0;
            if (value > 0) addToDay(r.created_at, value);
        });

        // Processar opportunities usando a comissão configurada
        opportunities?.forEach(c => {
            const commissionValue = getOpportunityCommissionValue(c);
            if (commissionValue > 0) addToDay(c.updated_at, commissionValue);
        });

        const timeline = [];
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= diffDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayStr = date.toISOString().split('T')[0];

            timeline.push({
                date: new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'short'
                }).format(date),
                value: dailyData[dayStr] || 0
            });
        }

        return timeline;
    }

    /**
     * Agrupamento SEMANAL (para períodos de 32-90 dias)
     */
    function groupByWeek(subscriptions, opportunities, startDate, endDate) {
        const weeklyData = {};

        const getWeekKey = (dateStr) => {
            const date = new Date(dateStr);
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            return startOfWeek.toISOString().split('T')[0];
        };

        const addToWeek = (dateStr, value) => {
            const weekKey = getWeekKey(dateStr);
            if (!weeklyData[weekKey]) weeklyData[weekKey] = 0;
            weeklyData[weekKey] += value;
        };

        subscriptions?.forEach(r => {
            const value = parseFloat(r.total_invested) || 0;
            if (value > 0) addToWeek(r.created_at, value);
        });

        opportunities?.forEach(c => {
            const commissionValue = getOpportunityCommissionValue(c);
            if (commissionValue > 0) addToWeek(c.updated_at, commissionValue);
        });

        const timeline = [];
        const currentWeek = new Date(startDate);
        currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

        while (currentWeek <= endDate) {
            const weekKey = currentWeek.toISOString().split('T')[0];

            const weekEnd = new Date(currentWeek);
            weekEnd.setDate(currentWeek.getDate() + 6);

            const startLabel = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            }).format(currentWeek);

            const endLabel = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            }).format(weekEnd);

            timeline.push({
                date: `${startLabel}`,
                value: weeklyData[weekKey] || 0
            });

            currentWeek.setDate(currentWeek.getDate() + 7);
        }

        return timeline;
    }

    /**
     * Agrupamento MENSAL (para períodos maiores que 90 dias)
     */
    function groupByMonth(subscriptions, opportunities, startDate, endDate) {
        const monthlyData = {};

        const getMonthKey = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        };

        const addToMonth = (dateStr, value) => {
            const monthKey = getMonthKey(dateStr);
            if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
            monthlyData[monthKey] += value;
        };

        subscriptions?.forEach(r => {
            const value = parseFloat(r.total_invested) || 0;
            if (value > 0) addToMonth(r.created_at, value);
        });

        opportunities?.forEach(c => {
            const commissionValue = getOpportunityCommissionValue(c);
            if (commissionValue > 0) addToMonth(c.updated_at, commissionValue);
        });

        const timeline = [];
        const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        while (currentMonth <= endDate) {
            const monthKey = getMonthKey(currentMonth.toISOString());

            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const monthLabel = `${months[currentMonth.getMonth()]}/${String(currentMonth.getFullYear()).slice(-2)}`;

            timeline.push({
                date: monthLabel,
                value: monthlyData[monthKey] || 0
            });

            // Avançar para próximo mês
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        return timeline;
    }

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