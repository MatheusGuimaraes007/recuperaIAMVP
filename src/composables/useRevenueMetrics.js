import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../stores/useAuthStore';

export const useRevenueMetrics = () => {
    const loading = ref(false);
    const error = ref(null);
    const platformRevenue = ref(0);
    const recoveredRevenue = ref(0);

    /**
     * Busca métricas de faturamento total
     * - Faturamento da plataforma: TODAS as oportunidades won (independente se foram recuperadas)
     * - Faturamento recuperado: Apenas oportunidades com status 'recovered'
     */
    const fetchRevenueMetrics = async (filters = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            // Calcular range de datas se necessário
            let startDate = filters.startDate;
            let endDate = filters.endDate;

            if (filters.period && filters.period !== 'all') {
                const dateRange = getDateRangeFromPeriod(filters.period);
                startDate = dateRange.startDate;
                endDate = dateRange.endDate;
            }

            // Query para TODAS as oportunidades won (faturamento total da plataforma)
            let platformQuery = supabase
                .from('opportunities')
                .select('converted_value, value, status')
                .eq('user_id', userId)
                .eq('status', 'won')
                .is('deleted_at', null);

            if (startDate && endDate) {
                platformQuery = platformQuery
                    .gte('created_at', startDate)
                    .lte('created_at', endDate);
            }

            const { data: platformData, error: platformError } = await platformQuery;

            if (platformError) throw platformError;

            // Calcular faturamento total da plataforma
            platformRevenue.value = (platformData || []).reduce((sum, opp) => {
                return sum + (parseFloat(opp.converted_value || opp.value) || 0);
            }, 0);

            // Query para oportunidades RECUPERADAS (status = 'recovered')
            let recoveredQuery = supabase
                .from('opportunities')
                .select('converted_value, value, status')
                .eq('user_id', userId)
                .eq('status', 'recovered')
                .is('deleted_at', null);

            if (startDate && endDate) {
                recoveredQuery = recoveredQuery
                    .gte('updated_at', startDate) // updated_at = quando foi recuperado
                    .lte('updated_at', endDate);
            }

            const { data: recoveredData, error: recoveredError } = await recoveredQuery;

            if (recoveredError) throw recoveredError;

            // Calcular faturamento recuperado
            recoveredRevenue.value = (recoveredData || []).reduce((sum, opp) => {
                return sum + (parseFloat(opp.converted_value || opp.value) || 0);
            }, 0);

            console.log(`💰 Faturamento Plataforma: R$ ${platformRevenue.value.toFixed(2)}`);
            console.log(`🔄 Faturamento Recuperado: R$ ${recoveredRevenue.value.toFixed(2)}`);

            return {
                success: true,
                platformRevenue: platformRevenue.value,
                recoveredRevenue: recoveredRevenue.value
            };

        } catch (err) {
            console.error('Erro ao buscar métricas de faturamento:', err);
            error.value = 'Erro ao carregar métricas de faturamento';
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Converte período em range de datas
     */
    const getDateRangeFromPeriod = (period) => {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'last7days':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'all':
                startDate = null;
                break;
        }

        return {
            startDate: startDate ? startDate.toISOString() : null,
            endDate: now.toISOString()
        };
    };

    /**
     * Percentual de recuperação sobre o faturamento total
     */
    const recoveryPercentage = computed(() => {
        if (platformRevenue.value === 0) return 0;
        return ((recoveredRevenue.value / platformRevenue.value) * 100).toFixed(1);
    });

    /**
     * Faturamento da plataforma sem considerar recuperação
     */
    const platformOnlyRevenue = computed(() => {
        return platformRevenue.value - recoveredRevenue.value;
    });

    return {
        loading,
        error,
        platformRevenue,
        recoveredRevenue,
        recoveryPercentage,
        platformOnlyRevenue,
        fetchRevenueMetrics
    };
};