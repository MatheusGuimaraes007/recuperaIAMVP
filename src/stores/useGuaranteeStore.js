import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';

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
                    return { success: true, data: null };
                }
                throw fetchError;
            }

            guarantee.value = data;
            return { success: true, data };
        } catch (err) {
            console.error('Erro ao buscar garantia:', err);
            setError('Erro ao carregar informações da garantia.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    const updateRecoveredAmount = async (guaranteeId, newAmount) => {
        loading.value = true;
        clearError();

        try {
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
            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar valor recuperado:', err);
            setError('Erro ao atualizar progresso da garantia.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    return {
        guarantee,
        loading,
        error,

        fetchActiveGuarantee,
        updateRecoveredAmount,
        clearError
    };
});