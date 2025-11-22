import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';

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

            return { success: true, data, count };
        } catch (err) {
            console.error('Erro ao buscar agentes:', err);
            setError('Erro ao carregar agentes.');
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

            // Busca bases de conhecimento associadas
            const { data: knowledgeBases, error: kbError } = await supabase
                .from('agents_knowledge_bases')
                .select(`
                    knowledge_base:knowledge_bases(
                        id,
                        name,
                        description
                    )
                `)
                .eq('agent_id', agentId);

            if (kbError) throw kbError;

            // Busca contatos recentes
            const { data: recentContacts, error: contactsError } = await supabase
                .from('contacts')
                .select('id, name, phone, status, created_at')
                .eq('agent_id', agentId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })
                .limit(10);

            if (contactsError) throw contactsError;

            // Busca oportunidades recentes
            const { data: recentOpportunities, error: oppError } = await supabase
                .from('opportunities')
                .select(`
                    id,
                    status,
                    opportunity_type,
                    value,
                    converted_value,
                    created_at,
                    contact:contacts(id, name)
                `)
                .eq('agent_id', agentId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })
                .limit(10);

            if (oppError) throw oppError;

            // Montar objeto completo
            const fullAgent = {
                ...agentData,
                knowledge_bases: knowledgeBases?.map(kb => kb.knowledge_base) || [],
                recent_contacts: recentContacts || [],
                recent_opportunities: recentOpportunities || []
            };

            currentAgent.value = fullAgent;

            return { success: true, data: fullAgent };
        } catch (err) {
            console.error('Erro ao buscar agente:', err);
            setError('Erro ao carregar detalhes do agente.');
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
            // Métricas de contatos
            const { count: totalContacts } = await supabase
                .from('contacts')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId)
                .is('deleted_at', null);

            const { count: convertedContacts } = await supabase
                .from('contacts')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId)
                .eq('status', 'converted')
                .is('deleted_at', null);

            const { count: engagedContacts } = await supabase
                .from('contacts')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId)
                .eq('status', 'engaged')
                .is('deleted_at', null);

            // Métricas de oportunidades
            const { count: totalOpportunities } = await supabase
                .from('opportunities')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId)
                .is('deleted_at', null);

            const { count: wonOpportunities } = await supabase
                .from('opportunities')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId)
                .eq('status', 'won')
                .is('deleted_at', null);

            const { count: activeOpportunities } = await supabase
                .from('opportunities')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId)
                .eq('status', 'active')
                .is('deleted_at', null);

            // Receita total
            const { data: revenueData } = await supabase
                .from('opportunities')
                .select('converted_value')
                .eq('agent_id', agentId)
                .eq('status', 'won')
                .is('deleted_at', null);

            const totalRevenue = revenueData?.reduce((sum, opp) =>
                sum + (parseFloat(opp.converted_value) || 0), 0) || 0;

            // Total de mensagens
            const { count: totalMessages } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('agent_id', agentId);

            // Tempo médio de conversão
            const { data: conversionTimes } = await supabase
                .from('opportunities')
                .select('conversion_time_minutes')
                .eq('agent_id', agentId)
                .eq('status', 'won')
                .not('conversion_time_minutes', 'is', null)
                .is('deleted_at', null);

            const avgConversionTime = conversionTimes?.length > 0
                ? Math.round(conversionTimes.reduce((sum, opp) =>
                    sum + opp.conversion_time_minutes, 0) / conversionTimes.length)
                : 0;

            // Taxa de conversão
            const conversionRate = totalOpportunities > 0
                ? ((wonOpportunities / totalOpportunities) * 100).toFixed(2)
                : 0;

            return {
                success: true,
                data: {
                    total_contacts: totalContacts || 0,
                    converted_contacts: convertedContacts || 0,
                    engaged_contacts: engagedContacts || 0,
                    total_opportunities: totalOpportunities || 0,
                    won_opportunities: wonOpportunities || 0,
                    active_opportunities: activeOpportunities || 0,
                    total_revenue: totalRevenue,
                    total_messages: totalMessages || 0,
                    avg_conversion_time_minutes: avgConversionTime,
                    conversion_rate: parseFloat(conversionRate)
                }
            };
        } catch (err) {
            console.error('Erro ao buscar métricas:', err);
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

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao criar agente:', err);
            setError('Erro ao criar agente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atualiza informações do agente
     */
    const updateAgent = async (agentId, updates) => {
        loading.value = true;
        clearError();

        try {
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

            // Atualizar na lista local
            const index = agents.value.findIndex(a => a.id === agentId);
            if (index !== -1) {
                agents.value[index] = { ...agents.value[index], ...data };
            }

            // Atualizar agente atual
            if (currentAgent.value?.id === agentId) {
                currentAgent.value = { ...currentAgent.value, ...data };
            }

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar agente:', err);
            setError('Erro ao atualizar agente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Deleta um agente (soft delete)
     */
    const deleteAgent = async (agentId) => {
        loading.value = true;
        clearError();

        try {
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

            return { success: true };
        } catch (err) {
            console.error('Erro ao deletar agente:', err);
            setError('Erro ao deletar agente.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Associa base de conhecimento ao agente
     */
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

            return { success: true };
        } catch (err) {
            console.error('Erro ao associar base de conhecimento:', err);
            setError('Erro ao associar base de conhecimento.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Remove associação de base de conhecimento
     */
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

            return { success: true };
        } catch (err) {
            console.error('Erro ao remover base de conhecimento:', err);
            setError('Erro ao remover base de conhecimento.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca usando função SQL otimizada
     */
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

    /**
     * Limpa dados da store
     */
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