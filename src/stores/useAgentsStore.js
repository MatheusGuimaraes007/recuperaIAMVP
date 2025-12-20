import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, createCacheKey, createInvalidationPattern, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

export const useAgentsStore = defineStore('agents', () => {
    const agents = ref([]);
    const currentAgent = ref(null);
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
     * Busca agentes com filtros
     * ✅ COM CACHE: Segunda chamada é ~100x mais rápida
     * ✅ COM ERROR HANDLER: Mensagens amigáveis para usuário
     */
    const fetchAgents = async (filters = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            // ✅ CRIAR CHAVE DE CACHE baseada em filtros
            const cacheKey = createCacheKey('agents', userId, filters);

            // ✅ TENTAR BUSCAR DO CACHE PRIMEIRO
            const cached = storeCache.get(cacheKey);
            if (cached) {
                agents.value = cached.data;
                totalCount.value = cached.count;
                loading.value = false;

                console.log('✅ Dados carregados do CACHE:', cacheKey);
                return { success: true, data: cached.data, count: cached.count, fromCache: true };
            }

            // ❌ NÃO ESTAVA NO CACHE, fazer query
            console.log('⏳ Cache MISS, buscando do banco...', cacheKey);

            const {
                page = 1,
                limit = 50,
                search = ''
            } = filters;

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            // Query otimizada com índices
            let query = supabase
                .from('agents')
                .select(`
                    id,
                    name,
                    prompt,
                    tone_of_voice,
                    function,
                    ai_model,
                    token_used,
                    created_at,
                    updated_at,
                    whatsapp_number:official_whatsapp_numbers(
                        id,
                        phone_number,
                        display_name,
                        status
                    )
                `, { count: 'exact' })
                .eq('user_id', userId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            // Busca por texto
            if (search && search.trim() !== '') {
                const searchTerm = search.trim();
                query = query.or(
                    `name.ilike.%${searchTerm}%,function.ilike.%${searchTerm}%`
                );
            }

            // Paginação
            query = query.range(from, to);

            const { data, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            agents.value = data || [];
            totalCount.value = count || 0;

            // ✅ SALVAR NO CACHE (TTL: 5 minutos)
            storeCache.set(cacheKey, { data, count }, CacheTTL.MEDIUM);
            console.log('💾 Dados salvos no CACHE:', cacheKey);

            return { success: true, data, count, fromCache: false };

        } catch (err) {
            // ✅ ERROR HANDLER - Mensagem amigável
            const friendlyMessage = ErrorHandler.handle(err, 'fetchAgents', { filters });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    // ============================================================
    // FETCH AGENT BY ID COM CACHE
    // ============================================================

    /**
     * Busca detalhes completos de um agente
     * ✅ COM CACHE individual por agente
     */
    const fetchAgentById = async (agentId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            // ✅ CACHE KEY específica do agente
            const cacheKey = `agents:${userId}:detail:${agentId}`;

            // ✅ TENTAR BUSCAR DO CACHE
            const cached = storeCache.get(cacheKey);
            if (cached) {
                currentAgent.value = cached;
                loading.value = false;
                return { success: true, data: cached, fromCache: true };
            }

            // Busca principal do agente
            const { data: agentData, error: agentError } = await supabase
                .from('agents')
                .select(`
                    *,
                    whatsapp_number:official_whatsapp_numbers(
                        id,
                        phone_number,
                        display_name,
                        status,
                        waba_id
                    )
                `)
                .eq('id', agentId)
                .eq('user_id', userId)
                .is('deleted_at', null)
                .single();

            if (agentError) throw agentError;

            // ✅ QUERIES EM PARALELO (otimização!)
            const [
                { data: knowledgeBases, error: kbError },
                { data: recentContacts, error: contactsError },
                { data: recentOpportunities, error: oppError }
            ] = await Promise.all([
                supabase
                    .from('agents_knowledge_bases')
                    .select(`knowledge_base:knowledge_bases(id, name, description)`)
                    .eq('agent_id', agentId),

                supabase
                    .from('contacts')
                    .select('id, name, phone, status, created_at')
                    .eq('agent_id', agentId)
                    .is('deleted_at', null)
                    .order('created_at', { ascending: false })
                    .limit(10),

                supabase
                    .from('opportunities')
                    .select(`
                        id, status, opportunity_type, value, converted_value, created_at,
                        contact:contacts(id, name)
                    `)
                    .eq('agent_id', agentId)
                    .is('deleted_at', null)
                    .order('created_at', { ascending: false })
                    .limit(10)
            ]);

            if (kbError) throw kbError;
            if (contactsError) throw contactsError;
            if (oppError) throw oppError;

            // Montar objeto completo
            const fullAgent = {
                ...agentData,
                knowledge_bases: knowledgeBases?.map(kb => kb.knowledge_base) || [],
                recent_contacts: recentContacts || [],
                recent_opportunities: recentOpportunities || []
            };

            currentAgent.value = fullAgent;

            // ✅ SALVAR NO CACHE (TTL: 3 minutos - dados mais voláteis)
            storeCache.set(cacheKey, fullAgent, CacheTTL.SHORT);

            return { success: true, data: fullAgent, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchAgentById', { agentId });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    // ============================================================
    // FETCH AGENT METRICS COM RPC (SEM CACHE - dados dinâmicos)
    // ============================================================

    /**
     * Busca métricas agregadas de um agente
     * ✅ USA RPC OTIMIZADO: 9 queries → 1 query
     * ❌ SEM CACHE: métricas mudam frequentemente
     */
    const fetchAgentMetrics = async (agentId) => {
        try {
            // ✅ USAR RPC (função SQL otimizada)
            const { data, error } = await supabase.rpc('get_agent_metrics', {
                p_agent_id: agentId
            });

            if (error) throw error;

            return { success: true, data };
        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchAgentMetrics', { agentId });
            console.error(friendlyMessage);
            return { success: false, error: err };
        }
    };

    const createAgent = async (agentData) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error: createError } = await supabase
                .from('agents')
                .insert({
                    user_id: userId,
                    ...agentData
                })
                .select()
                .single();

            if (createError) throw createError;

            // Adicionar à lista local
            agents.value.unshift(data);
            totalCount.value++;

            const pattern = createInvalidationPattern('agents', userId);
            const invalidated = storeCache.invalidatePattern(pattern);
            console.log(`🗑️  Cache invalidado: ${invalidated} itens removidos`);

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'createAgent', { agentData });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updateAgent = async (agentId, updates) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            const { data, error: updateError } = await supabase
                .from('agents')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', agentId)
                .select()
                .single();

            if (updateError) throw updateError;

            const index = agents.value.findIndex(a => a.id === agentId);
            if (index !== -1) {
                agents.value[index] = { ...agents.value[index], ...data };
            }

            if (currentAgent.value?.id === agentId) {
                currentAgent.value = { ...currentAgent.value, ...data };
            }

            const pattern = createInvalidationPattern('agents', userId);
            storeCache.invalidatePattern(pattern);
            storeCache.delete(`agents:${userId}:detail:${agentId}`);
            console.log('🗑️  Cache invalidado após update');

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateAgent', { agentId, updates });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };


    const deleteAgent = async (agentId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            const { error: deleteError } = await supabase
                .from('agents')
                .update({
                    deleted_at: new Date().toISOString()
                })
                .eq('id', agentId);

            if (deleteError) throw deleteError;

            agents.value = agents.value.filter(a => a.id !== agentId);
            totalCount.value--;

            if (currentAgent.value?.id === agentId) {
                currentAgent.value = null;
            }

            const pattern = createInvalidationPattern('agents', userId);
            storeCache.invalidatePattern(pattern);
            console.log('🗑️  Cache invalidado após delete');

            return { success: true };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'deleteAgent', { agentId });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const associateKnowledgeBase = async (agentId, knowledgeBaseId) => {
        loading.value = true;
        clearError();

        try {
            const { error: associateError } = await supabase
                .from('agents_knowledge_bases')
                .insert({
                    agent_id: agentId,
                    knowledge_base_id: knowledgeBaseId
                });

            if (associateError) throw associateError;

            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            storeCache.delete(`agents:${userId}:detail:${agentId}`);

            return { success: true };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'associateKnowledgeBase', {
                agentId,
                knowledgeBaseId
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const dissociateKnowledgeBase = async (agentId, knowledgeBaseId) => {
        loading.value = true;
        clearError();

        try {
            const { error: removeError } = await supabase
                .from('agents_knowledge_bases')
                .delete()
                .eq('agent_id', agentId)
                .eq('knowledge_base_id', knowledgeBaseId);

            if (removeError) throw removeError;

            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            storeCache.delete(`agents:${userId}:detail:${agentId}`);

            return { success: true };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'dissociateKnowledgeBase', {
                agentId,
                knowledgeBaseId
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const searchAgentsOptimized = async (filters = {}) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const {
                page = 1,
                limit = 50,
                search = ''
            } = filters;

            const offset = (page - 1) * limit;

            const { data, error: searchError } = await supabase
                .rpc('search_agents', {
                    p_user_id: userId,
                    p_search_term: search || null,
                    p_limit: limit,
                    p_offset: offset
                });

            if (searchError) {
                console.warn('Função search_agents não disponível, usando query padrão');
                return await fetchAgents(filters);
            }

            agents.value = data || [];
            totalCount.value = data?.length || 0;

            return { success: true, data };

        } catch (err) {
            console.error('Erro na busca otimizada:', err);
            return await fetchAgents(filters);
        } finally {
            loading.value = false;
        }
    };

    const clearAgents = () => {
        agents.value = [];
        totalCount.value = 0;
        clearError();
    };

    const clearCurrentAgent = () => {
        currentAgent.value = null;
    };

    return {
        agents,
        currentAgent,
        totalCount,
        loading,
        error,

        fetchAgents,
        fetchAgentById,
        fetchAgentMetrics,
        createAgent,
        updateAgent,
        deleteAgent,
        associateKnowledgeBase,
        dissociateKnowledgeBase,
        searchAgentsOptimized,
        clearAgents,
        clearCurrentAgent,
        clearError
    };
});
