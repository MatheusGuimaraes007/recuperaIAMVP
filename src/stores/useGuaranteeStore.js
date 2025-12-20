import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

export const useGuaranteeStore = defineStore('guarantee', () => {
    const guarantee = ref(null);
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

    const fetchActiveGuarantee = async () => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const cacheKey = `guarantee:${userId}:active`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                guarantee.value = cached;
                loading.value = false;

                console.log('✅ Garantia carregada do CACHE');
                return { success: true, data: cached, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco...');

            const { data, error: fetchError } = await supabase
                .from('guarantees')
                .select(`
                    *,
                    subscription:user_subscriptions(
                        id,
                        plan_name,
                        monthly_fee,
                        status
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    guarantee.value = null;
                    console.log('ℹ️  Nenhuma garantia ativa encontrada');

                    storeCache.set(cacheKey, null, CacheTTL.MEDIUM);

                    return { success: true, data: null, fromCache: false };
                }
                throw fetchError;
            }

            guarantee.value = data;

            storeCache.set(cacheKey, data, CacheTTL.MEDIUM);
            console.log('💾 Garantia salva no CACHE');

            return { success: true, data, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchActiveGuarantee');
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    const updateRecoveredAmount = async (guaranteeId, newAmount) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error: updateError } = await supabase
                .from('guarantees')
                .update({
                    current_recovered_amount: newAmount,
                    updated_at: new Date().toISOString()
                })
                .eq('id', guaranteeId)
                .select()
                .single();

            if (updateError) throw updateError;

            guarantee.value = data;

            const cacheKey = `guarantee:${userId}:active`;
            storeCache.delete(cacheKey);
            console.log('🗑️  Cache da garantia invalidado');

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateRecoveredAmount', {
                guaranteeId,
                newAmount
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const calculateProgress = () => {
        if (!guarantee.value) return null;

        const goal = parseFloat(guarantee.value.goal_amount) || 0;
        const recovered = parseFloat(guarantee.value.current_recovered_amount) || 0;

        const percentage = goal > 0 ? (recovered / goal) * 100 : 0;
        const remaining = Math.max(0, goal - recovered);

        const now = new Date();
        const endDate = new Date(guarantee.value.end_date);
        const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

        return {
            goalAmount: goal,
            recoveredAmount: recovered,
            remainingAmount: remaining,
            percentage: parseFloat(percentage.toFixed(2)),
            daysRemaining,
            isExpired: now > endDate,
            isAchieved: recovered >= goal
        };
    };


    const getGuaranteeStatus = () => {
        const progress = calculateProgress();

        if (!progress) return null;

        const { percentage, daysRemaining, isExpired, isAchieved } = progress;

        if (isAchieved) {
            return { level: 'success', message: 'Meta atingida! 🎉' };
        }

        if (isExpired) {
            return { level: 'expired', message: 'Garantia expirada' };
        }

        if (daysRemaining <= 15 && percentage < 50) {
            return {
                level: 'critical',
                message: `Atenção! Apenas ${daysRemaining} dias e ${percentage.toFixed(1)}% da meta`
            };
        }

        if (daysRemaining <= 30 && percentage < 70) {
            return {
                level: 'warning',
                message: `Atenção: ${daysRemaining} dias restantes para atingir ${(100 - percentage).toFixed(1)}% da meta`
            };
        }

        return { level: 'ok', message: 'No caminho certo!' };
    };


    return {
        guarantee,
        loading,
        error,

        fetchActiveGuarantee,
        updateRecoveredAmount,
        clearError,

        calculateProgress,
        getGuaranteeStatus
    };
});
