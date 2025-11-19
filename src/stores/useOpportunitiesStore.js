import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';

export const useOpportunitiesStore = defineStore('opportunities', () => {
    const opportunities = ref([]);
    const currentOpportunity = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const totalCount = ref(0);
    const filters = ref({
        status: null,
        search: null,
        page: 1,
        limit: 25
    });

    const setError = (message) => {
        error.value = message;
        setTimeout(() => {
            error.value = null;
        }, 5000);
    };

    const clearError = () => {
        error.value = null;
    };

    const updateFilters = (newFilters) => {
        filters.value = { ...filters.value, ...newFilters };
    };

    const clearFilters = () => {
        filters.value = {
            status: null,
            search: null,
            page: 1,
            limit: 25
        };
    };

    const fetchOpportunities = async (filterParams = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            let query = supabase
                .from('opportunities')
                .select(`
          *,
          contact:contacts(id, name, phone, email),
          agent:agents(id, name),
          product:products(id, name)
        `, { count: 'exact' })
                .eq('user_id', userId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (filterParams.status) {
                query = query.eq('status', filterParams.status);
            }

            if (filterParams.search) {
                query = query.or(`
          contact.name.ilike.%${filterParams.search}%,
          contact.phone.ilike.%${filterParams.search}%
        `);
            }

            const page = filterParams.page || filters.value.page;
            const limit = filterParams.limit || filters.value.limit;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            opportunities.value = data || [];
            totalCount.value = count || 0;

            updateFilters(filterParams);

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao buscar oportunidades:', err);
            setError('Erro ao carregar oportunidades. Tente novamente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const fetchOpportunityById = async (id) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error: fetchError } = await supabase
                .from('opportunities')
                .select(`
          *,
          contact:contacts(id, name, phone, email, status),
          agent:agents(id, name),
          product:products(id, name, description),
          integration:user_integrations(id, name)
        `)
                .eq('id', id)
                .eq('user_id', userId)
                .is('deleted_at', null)
                .single();

            if (fetchError) throw fetchError;

            currentOpportunity.value = data;
            return { success: true, data };
        } catch (err) {
            console.error('Erro ao buscar oportunidade:', err);
            setError('Erro ao carregar detalhes da oportunidade.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const createOpportunity = async (opportunityData) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error: createError } = await supabase
                .from('opportunities')
                .insert({
                    user_id: userId,
                    ...opportunityData
                })
                .select()
                .single();

            if (createError) throw createError;

            opportunities.value.unshift(data);
            totalCount.value += 1;

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao criar oportunidade:', err);
            setError('Erro ao criar oportunidade. Tente novamente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updateOpportunity = async (id, updates) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error: updateError } = await supabase
                .from('opportunities')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError) throw updateError;

            const index = opportunities.value.findIndex(opp => opp.id === id);
            if (index !== -1) {
                opportunities.value[index] = { ...opportunities.value[index], ...data };
            }

            if (currentOpportunity.value?.id === id) {
                currentOpportunity.value = { ...currentOpportunity.value, ...data };
            }

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar oportunidade:', err);
            setError('Erro ao atualizar oportunidade. Tente novamente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const deleteOpportunity = async (id) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { error: deleteError } = await supabase
                .from('opportunities')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id)
                .eq('user_id', userId);

            if (deleteError) throw deleteError;

            opportunities.value = opportunities.value.filter(opp => opp.id !== id);
            totalCount.value -= 1;

            if (currentOpportunity.value?.id === id) {
                currentOpportunity.value = null;
            }

            return { success: true };
        } catch (err) {
            console.error('Erro ao excluir oportunidade:', err);
            setError('Erro ao excluir oportunidade. Tente novamente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    return {
        opportunities,
        currentOpportunity,
        loading,
        error,
        totalCount,
        filters,

        fetchOpportunities,
        fetchOpportunityById,
        createOpportunity,
        updateOpportunity,
        deleteOpportunity,
        updateFilters,
        clearFilters,
        clearError
    };
});