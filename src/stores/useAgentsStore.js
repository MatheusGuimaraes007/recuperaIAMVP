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
     * Inclui dados do usuário (dono) e do número de WhatsApp
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

            const cacheKey = createCacheKey('agents', userId, filters);

            const cached = storeCache.get(cacheKey);
            if (cached) {
                agents.value = cached.data;
                totalCount.value = cached.count;
                loading.value = false;
                console.log('✅ Dados carregados do CACHE:', cacheKey);
                return { success: true, data: cached.data, count: cached.count, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco...', cacheKey);

            const {
                page = 1,
                limit = 50,
                search = ''
            } = filters;

            const from = (page - 1) * limit;
            const to = from + limit - 1;

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
                    user_id,
                    user:users(id, name, email),
                    whatsapp_number:official_whatsapp_numbers(
                        id,
                        phone_number,
                        display_name,
                        status
                    )
                `, { count: 'exact' })
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

            storeCache.set(cacheKey, { data, count }, CacheTTL.MEDIUM);
            console.log('💾 Dados salvos no CACHE:', cacheKey);

            return { success: true, data, count, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchAgents', { filters });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca detalhes completos de um agente
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

            const cacheKey = `agents:${userId}:detail:${agentId}`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                currentAgent.value = cached;
                loading.value = false;
                return { success: true, data: cached, fromCache: true };
            }

            const { data: agentData, error: agentError } = await supabase
                .from('agents')
                .select(`
                    *,
                    user:users(id, name, email),
                    whatsapp_number:official_whatsapp_numbers(
                        id,
                        phone_number,
                        display_name,
                        status,
                        waba_id
                    )
                `)
                .eq('id', agentId)
                .is('deleted_at', null)
                .single();

            if (agentError) throw agentError;

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

            const fullAgent = {
                ...agentData,
                knowledge_bases: knowledgeBases?.map(kb => kb.knowledge_base) || [],
                recent_contacts: recentContacts || [],
                recent_opportunities: recentOpportunities || []
            };

            currentAgent.value = fullAgent;

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

    /**
     * Busca métricas agregadas de um agente
     */
    const fetchAgentMetrics = async (agentId) => {
        try {
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

    /**
     * Cria um novo agente
     */
    const createAgent = async (agentData) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const targetUserId = agentData.user_id || authStore.user?.id;

            if (!targetUserId) {
                throw new Error('Usuário proprietário não identificado');
            }

            // Separar dados do WhatsApp para não dar erro na tabela agents
            const { whatsapp_number, ...agentPayload } = agentData;

            const { data: newAgent, error: createError } = await supabase
                .from('agents')
                .insert({
                    ...agentPayload,
                    user_id: targetUserId
                })
                .select()
                .single();

            if (createError) throw createError;

            // Se houver dados de WhatsApp, tenta criar (mas não falha se der erro)
            let createdNumber = null;
            if (whatsapp_number && whatsapp_number.phone_number) {
                try {
                    const { data: numData, error: numError } = await supabase
                        .from('official_whatsapp_numbers')
                        .insert({
                            id: newAgent.id,
                            user_id: targetUserId,
                            phone_number: whatsapp_number.phone_number,
                            display_name: whatsapp_number.display_name,
                            waba_id: whatsapp_number.waba_id,
                            status: 'pending',
                            updated_at: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (!numError) {
                        createdNumber = numData;
                        // Vincula o ID na tabela agents
                        await supabase
                            .from('agents')
                            .update({ official_whatsapp_number_id: numData.id })
                            .eq('id', newAgent.id);
                    }
                } catch (wppErr) {
                    console.error('Erro ao criar número automático:', wppErr);
                }
            }

            const finalAgent = {
                ...newAgent,
                whatsapp_number: createdNumber
            };

            agents.value.unshift(finalAgent);
            totalCount.value++;

            const pattern = createInvalidationPattern('agents', targetUserId);
            storeCache.invalidatePattern(pattern);
            
            return { success: true, data: finalAgent };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'createAgent', { agentData });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atualiza um agente existente
     */
    const updateAgent = async (agentId, updates) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            // Remove whatsapp_number para o update em agents
            const { whatsapp_number, ...agentUpdates } = updates;

            const { data: updatedAgent, error: updateError } = await supabase
                .from('agents')
                .update({
                    ...agentUpdates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', agentId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Se houver update de whatsapp via este método
            let updatedNumber = null;
            if (whatsapp_number && whatsapp_number.id) {
                const { data: numData, error: numError } = await supabase
                    .from('official_whatsapp_numbers')
                    .update({
                        phone_number: whatsapp_number.phone_number,
                        display_name: whatsapp_number.display_name,
                        status: whatsapp_number.status,
                        waba_id: whatsapp_number.waba_id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', whatsapp_number.id)
                    .select()
                    .single();
                
                if (!numError) updatedNumber = numData;
            }

            const finalData = { 
                ...updatedAgent, 
                whatsapp_number: updatedNumber || whatsapp_number 
            };

            const index = agents.value.findIndex(a => a.id === agentId);
            if (index !== -1) {
                agents.value[index] = { ...agents.value[index], ...finalData };
            }

            if (currentAgent.value?.id === agentId) {
                currentAgent.value = { ...currentAgent.value, ...finalData };
            }

            const pattern = createInvalidationPattern('agents', userId);
            storeCache.invalidatePattern(pattern);
            storeCache.delete(`agents:${userId}:detail:${agentId}`);

            return { success: true, data: finalData };

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