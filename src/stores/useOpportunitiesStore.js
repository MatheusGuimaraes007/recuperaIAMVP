import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { getDateRangeFromPeriod } from '../utils/date';
import { storeCache, createCacheKey, createInvalidationPattern, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

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
     * ✅ COM CACHE: Segunda chamada é ~100x mais rápida
     * ✅ COM RPC: search_opportunities otimizado
     * ✅ COM ERROR HANDLER: Mensagens amigáveis
     */
    const fetchOpportunities = async (filterParams = {}) => {
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
     * ✅ TENTA RPC PRIMEIRO, fallback para query normal
     */
    const executeOpportunitiesQuery = async (filterParams = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            // Se houver sessão ativa mas `user` ainda não estiver populado,
            // inicializa auth para garantir `user` esteja disponível.
            if (!authStore.user && authStore.session) {
                await authStore.initializeAuth();
            }
            const authUserId = authStore.user?.id;

            // Permite sobrescrever o user id via filterParams (útil para views administrativas)
            const currentFilters = { ...filters.value, ...filterParams };
            // aceita tanto `userId` (camelCase) quanto `user_id` (snake_case) nos filtros
            const targetUserId = currentFilters.userId || currentFilters.user_id || authUserId;

            if (!targetUserId) {
                throw new Error('Usuário não autenticado');
            }

            const cacheKey = createCacheKey('opportunities', targetUserId, {
                page: currentFilters.page,
                limit: currentFilters.limit,
                status: currentFilters.status,
                search: currentFilters.search,
                period: currentFilters.period,
                startDate: currentFilters.startDate,
                endDate: currentFilters.endDate
            });

            const cached = storeCache.get(cacheKey);
            if (cached) {
                opportunities.value = cached.data;
                totalCount.value = cached.count;
                updateFilters(currentFilters);
                loading.value = false;

                console.log('✅ Oportunidades carregadas do CACHE:', cacheKey);
                return { success: true, data: cached.data, count: cached.count, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco...', cacheKey);

            // Calcular datas para query (normalizar para timezone America/Sao_Paulo)
            let startDate = currentFilters.startDate;
            let endDate = currentFilters.endDate;

            if (!startDate && !endDate && currentFilters.period && currentFilters.period !== 'all') {
                const dateRange = getDateRangeFromPeriod(currentFilters.period);
                startDate = dateRange.startDate;
                endDate = dateRange.endDate;
            }

            // Converter datas fornecidas (ex: YYYY-MM-DD) para ISO UTC no timezone desejado
            const { toZonedISOString } = await import('../utils/date.js');
            try {
                if (startDate) startDate = toZonedISOString(startDate, 'America/Sao_Paulo', true);
                if (endDate) endDate = toZonedISOString(endDate, 'America/Sao_Paulo', false);
            } catch (e) {
                console.warn('Não foi possível normalizar as datas para timezone:', e.message || e);
            }

            const page = currentFilters.page || 1;
            const limit = currentFilters.limit || 25;
            const offset = (page - 1) * limit;

            try {
                const { data: rpcData, error: rpcError } = await supabase.rpc('search_opportunities', {
                    // usa targetUserId para permitir buscas em nome de outro usuário (admin)
                    p_user_id: targetUserId,
                    p_search: currentFilters.search || null,
                    p_status: currentFilters.status === 'all' ? null : currentFilters.status,
                    p_start_date: startDate,
                    p_end_date: endDate,
                    p_limit: limit,
                    p_offset: offset
                });

                if (!rpcError && rpcData) {
                    const transformedData = rpcData.map(row => ({
                        id: row.id,
                        status: row.status,
                        value: row.value,
                        converted_value: row.converted_value,
                        opportunity_type: row.opportunity_type,
                        payment_method: row.payment_method,
                        message_count: row.message_count,
                        notes: row.notes,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        conversion_time_minutes: row.conversion_time_minutes,
                        recovery_time_minutes: row.recovery_time_minutes,
                        lost_reason: row.lost_reason,
                        contact: row.contact_id ? {
                            id: row.contact_id,
                            name: row.contact_name,
                            phone: row.contact_phone,
                            email: row.contact_email
                        } : null,
                        agent: row.agent_id ? {
                            id: row.agent_id,
                            name: row.agent_name
                        } : null,
                        product: row.product_id ? {
                            id: row.product_id,
                            name: row.product_name
                        } : null
                    }));

                    opportunities.value = transformedData;
                    totalCount.value = rpcData.length; // TODO: RPC should return count

                    storeCache.set(cacheKey, {
                        data: transformedData,
                        count: rpcData.length
                    }, CacheTTL.SHORT);

                    updateFilters(currentFilters);

                    console.log('💾 Oportunidades salvas no CACHE (via RPC):', cacheKey);
                    return { success: true, data: transformedData, fromCache: false, source: 'rpc' };
                }
            } catch (rpcError) {
                console.warn('⚠️  RPC search_opportunities não disponível, usando fallback:', rpcError.message);
            }

            console.log('📋 Usando query normal (fallback)');

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
                // filtra pelo user do cliente quando fornecido, caso contrário usa o usuário autenticado
                .eq('user_id', targetUserId)
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

            if (startDate && endDate) {
                query = query
                    .gte('created_at', startDate)
                    .lte('created_at', endDate);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            opportunities.value = data || [];
            totalCount.value = count || 0;

            storeCache.set(cacheKey, { data, count }, CacheTTL.SHORT);
            console.log('💾 Oportunidades salvas no CACHE (via query):', cacheKey);

            updateFilters(currentFilters);

            return { success: true, data: opportunities.value, count, fromCache: false, source: 'query' };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchOpportunities', {
                filters: filterParams
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca oportunidade por ID
     * ✅ BUSCA NA LISTA LOCAL PRIMEIRO (otimização)
     * ✅ CACHE individual por oportunidade
     */
    const fetchOpportunityById = async (id) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const found = opportunities.value.find(opp => opp.id === id);
            if (found) {
                currentOpportunity.value = found;
                loading.value = false;
                console.log('✅ Oportunidade encontrada na lista local');
                return { success: true, data: found, source: 'local' };
            }

            const cacheKey = `opportunities:${userId}:detail:${id}`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                currentOpportunity.value = cached;
                loading.value = false;
                console.log('✅ Oportunidade carregada do CACHE');
                return { success: true, data: cached, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco...');

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

            storeCache.set(cacheKey, data, CacheTTL.SHORT);
            console.log('💾 Oportunidade salva no CACHE');

            return { success: true, data, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchOpportunityById', { id });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    /**
     * Cria oportunidade
     * ✅ INVALIDA CACHE após criar
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

            const pattern = createInvalidationPattern('opportunities', userId);
            const invalidated = storeCache.invalidatePattern(pattern);
            console.log(`🗑️  Cache invalidado: ${invalidated} itens removidos`);

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'createOpportunity', { opportunityData });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    /**
     * Atualiza oportunidade
     * ✅ INVALIDA CACHE da lista + detalhe específico
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

            const pattern = createInvalidationPattern('opportunities', userId);
            storeCache.invalidatePattern(pattern);
            storeCache.delete(`opportunities:${userId}:detail:${id}`);
            console.log('🗑️  Cache invalidado após update');

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateOpportunity', { id, updates });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    /**
     * Deleta oportunidade (soft delete)
     * ✅ INVALIDA TODO O CACHE após deletar
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

            const pattern = createInvalidationPattern('opportunities', userId);
            const invalidated = storeCache.invalidatePattern(pattern);
            console.log(`🗑️  Cache invalidado: ${invalidated} itens removidos`);

            return { success: true };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'deleteOpportunity', { id });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atualização em lote
     * ✅ INVALIDA TODO O CACHE após update em lote
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

            const pattern = createInvalidationPattern('opportunities', userId);
            const invalidated = storeCache.invalidatePattern(pattern);
            console.log(`🗑️  Cache invalidado (bulk): ${invalidated} itens removidos`);

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'bulkUpdateOpportunities', {
                ids,
                updates
            });
            setError(friendlyMessage);
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
