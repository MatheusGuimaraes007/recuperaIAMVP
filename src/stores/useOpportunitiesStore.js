import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { getDateRangeFromPeriod } from '../utils/date';

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
        limit: 25,
        period: 'last7days',
        startDate: null,
        endDate: null
    });

    let abortController = null;
    let searchDebounceTimer = null;

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
            limit: 25,
            period: 'last7days',
            startDate: null,
            endDate: null
        };
    };

    /**
     * Busca oportunidades com debounce automático para search
     */
    const fetchOpportunities = async (filterParams = {}) => {
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        if (filterParams.search !== undefined) {
            return new Promise((resolve) => {
                if (searchDebounceTimer) {
                    clearTimeout(searchDebounceTimer);
                }
                
                searchDebounceTimer = setTimeout(async () => {
                    const result = await executeOpportunitiesQuery(filterParams);
                    resolve(result);
                }, 300);
            });
        }

        return executeOpportunitiesQuery(filterParams);
    };

    /**
     * Executa a query de oportunidades
     */
    const executeOpportunitiesQuery = async (filterParams = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const currentFilters = { ...filters.value, ...filterParams };

            let contactIds = [];
            
            if (currentFilters.search && currentFilters.search.trim() !== '') {
                const searchTerm = currentFilters.search.trim();
                
                const { data: matchingContacts } = await supabase
                    .from('contacts')
                    .select('id')
                    .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
                    .limit(100);

                if (matchingContacts && matchingContacts.length > 0) {
                    contactIds = matchingContacts.map(c => c.id);
                }
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

            if (contactIds.length > 0) {
                query = query.in('contact_id', contactIds);
            } else if (currentFilters.search && currentFilters.search.trim() !== '') {
                const searchTerm = currentFilters.search.trim();
                query = query.or(`notes.ilike.%${searchTerm}%,value::text.ilike.%${searchTerm}%`);
            }

            if (currentFilters.status && currentFilters.status !== 'all') {
                query = query.eq('status', currentFilters.status);
            }

            if (currentFilters.startDate && currentFilters.endDate) {
                query = query
                    .gte('created_at', currentFilters.startDate)
                    .lte('created_at', currentFilters.endDate);
            } else if (currentFilters.period && currentFilters.period !== 'all') {
                const { startDate, endDate } = getDateRangeFromPeriod(currentFilters.period);
                if (startDate) {
                    query = query
                        .gte('created_at', startDate)
                        .lte('created_at', endDate);
                }
            }

            const page = currentFilters.page || 1;
            const limit = currentFilters.limit || 25;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            opportunities.value = data || [];
            totalCount.value = count || 0;

            updateFilters(currentFilters);

            return { success: true, data: opportunities.value };
        } catch (err) {
            if (err.name === 'AbortError') {
                return { success: false, error: 'cancelled' };
            }

            console.error('Erro ao buscar oportunidades:', err);
            setError('Erro ao carregar oportunidades. Tente novamente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
            abortController = null;
        }
    };

    /**
     * Busca oportunidade por ID
     */
    const fetchOpportunityById = async (id) => {
        loading.value = true;
        clearError();

        try {
            const found = opportunities.value.find(opp => opp.id === id);
            if (found) {
                currentOpportunity.value = found;
                loading.value = false;
                return { success: true, data: found };
            }

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

    /**
     * Cria oportunidade
     */
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
                .select(`
                    *,
                    contact:contacts(id, name, phone, email),
                    agent:agents(id, name),
                    product:products(id, name)
                `)
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

    /**
     * Atualiza oportunidade
     */
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
                .select(`
                    *,
                    contact:contacts(id, name, phone, email),
                    agent:agents(id, name),
                    product:products(id, name)
                `)
                .single();

            if (updateError) throw updateError;

            const index = opportunities.value.findIndex(opp => opp.id === id);
            if (index !== -1) {
                opportunities.value[index] = data;
            }

            if (currentOpportunity.value?.id === id) {
                currentOpportunity.value = data;
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

    /**
     * Deleta oportunidade (soft delete)
     */
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

    /**
     * Atualização em lote
     */
    const bulkUpdateOpportunities = async (ids, updates) => {
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
                .in('id', ids)
                .eq('user_id', userId)
                .select();

            if (updateError) throw updateError;

            data.forEach(updatedOpp => {
                const index = opportunities.value.findIndex(opp => opp.id === updatedOpp.id);
                if (index !== -1) {
                    opportunities.value[index] = updatedOpp;
                }
            });

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar oportunidades:', err);
            setError('Erro ao atualizar oportunidades em lote.');
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
        bulkUpdateOpportunities,
        updateFilters,
        clearFilters,
        clearError
    };
});