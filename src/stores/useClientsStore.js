import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';

export const useClientsStore = defineStore('clients', () => {
    const contacts = ref([]);
    const currentContact = ref(null);
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
     * Busca contatos com filtros - OTIMIZADA
     * Usa índices compostos para melhor performance
     */
    const fetchContacts = async (filters = {}) => {
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
                status = null,
                search = ''
            } = filters;

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let query = supabase
                .from('contacts')
                .select(`
                    id,
                    name,
                    phone,
                    email,
                    status,
                    tags,
                    created_at,
                    updated_at,
                    agent:agents(id, name)
                `, { count: 'exact' })
                .eq('user_id', userId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            if (search && search.trim() !== '') {
                const searchTerm = search.trim();
                query = query.or(
                    `name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
                );
            }

            query = query.range(from, to);

            const { data, error: fetchError, count } = await query;

            if (fetchError) throw fetchError;

            contacts.value = data || [];
            totalCount.value = count || 0;

            return { success: true, data, count };
        } catch (err) {
            console.error('Erro ao buscar contatos:', err);
            setError('Erro ao carregar contatos.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca detalhes completos de um contato - NOVA VERSÃO OTIMIZADA
     * Inclui oportunidades, métricas e últimas mensagens
     */
    const fetchContactById = async (contactId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const { data: contactData, error: contactError } = await supabase
                .from('contacts')
                .select(`
                    *,
                    agent:agents(id, name)
                `)
                .eq('id', contactId)
                .eq('user_id', userId)
                .is('deleted_at', null)
                .single();

            if (contactError) throw contactError;

            const { data: opportunities, error: oppError } = await supabase
                .from('opportunities')
                .select(`
                    id,
                    status,
                    opportunity_type,
                    payment_method,
                    value,
                    converted_value,
                    message_count,
                    conversion_time_minutes,
                    conversation_summary,
                    lost_reason,
                    source,
                    created_at,
                    closed_at,
                    updated_at,
                    product:products(id, name, description)
                `)
                .eq('contact_id', contactId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (oppError) throw oppError;

            const { data: messages, error: msgError } = await supabase
                .from('messages')
                .select(`
                    id,
                    content,
                    direction,
                    created_at,
                    metadata
                `)
                .eq('contact_id', contactId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (msgError) throw msgError;

            const fullContact = {
                ...contactData,
                opportunities: opportunities || [],
                messages: messages || []
            };

            currentContact.value = fullContact;

            return { success: true, data: fullContact };
        } catch (err) {
            console.error('Erro ao buscar contato:', err);
            setError('Erro ao carregar detalhes do contato.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca métricas agregadas de um contato - OTIMIZADA
     * Calcula estatísticas sem carregar todos os dados
     */
    const fetchContactMetrics = async (contactId) => {
        try {
            const { data, error } = await supabase
                .rpc('get_contact_metrics', { p_contact_id: contactId });

            if (error) throw error;

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao buscar métricas:', err);
            return { success: false, error: err };
        }
    };

    /**
     * Atualiza status do contato
     */
    const updateContactStatus = async (contactId, newStatus) => {
        loading.value = true;
        clearError();

        try {
            const { data, error: updateError } = await supabase
                .from('contacts')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', contactId)
                .select()
                .single();

            if (updateError) throw updateError;

            const index = contacts.value.findIndex(c => c.id === contactId);
            if (index !== -1) {
                contacts.value[index] = { ...contacts.value[index], ...data };
            }

            if (currentContact.value?.id === contactId) {
                currentContact.value = { ...currentContact.value, ...data };
            }

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            setError('Erro ao atualizar status do contato.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atualiza informações do contato
     */
    const updateContact = async (contactId, updates) => {
        loading.value = true;
        clearError();

        try {
            const { data, error: updateError } = await supabase
                .from('contacts')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', contactId)
                .select()
                .single();

            if (updateError) throw updateError;

            const index = contacts.value.findIndex(c => c.id === contactId);
            if (index !== -1) {
                contacts.value[index] = { ...contacts.value[index], ...data };
            }

            if (currentContact.value?.id === contactId) {
                currentContact.value = { ...currentContact.value, ...data };
            }

            return { success: true, data };
        } catch (err) {
            console.error('Erro ao atualizar contato:', err);
            setError('Erro ao atualizar contato.');
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca usando a função SQL otimizada (se disponível)
     * Usa a função search_contacts do SQL para melhor performance
     */
    const searchContactsOptimized = async (filters = {}) => {
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
                status = null,
                search = ''
            } = filters;

            const offset = (page - 1) * limit;

            const { data, error: searchError } = await supabase
                .rpc('search_contacts', {
                    p_user_id: userId,
                    p_search_term: search || null,
                    p_status: status === 'all' ? null : status,
                    p_limit: limit,
                    p_offset: offset
                });

            if (searchError) {
                console.warn('Função search_contacts não disponível, usando query padrão');
                return await fetchContacts(filters);
            }

            contacts.value = data || [];
            totalCount.value = data?.length || 0;

            return { success: true, data };
        } catch (err) {
            console.error('Erro na busca otimizada:', err);
            return await fetchContacts(filters);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Limpa dados da store
     */
    const clearContacts = () => {
        contacts.value = [];
        totalCount.value = 0;
        clearError();
    };

    const clearCurrentContact = () => {
        currentContact.value = null;
    };

    return {
        contacts,
        currentContact,
        totalCount,
        loading,
        error,

        fetchContacts,
        fetchContactById,
        fetchContactMetrics,
        updateContactStatus,
        updateContact,
        searchContactsOptimized,
        clearContacts,
        clearCurrentContact,
        clearError
    };
});