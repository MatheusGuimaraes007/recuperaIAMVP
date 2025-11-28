import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, createCacheKey, createInvalidationPattern, CacheTTL } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

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

            const cacheKey = createCacheKey('contacts', userId, { page, limit, status, search });

            const cached = storeCache.get(cacheKey);
            if (cached) {
                contacts.value = cached.data;
                totalCount.value = cached.count;
                loading.value = false;

                console.log('✅ Contatos carregados do CACHE:', cacheKey);
                return { success: true, data: cached.data, count: cached.count, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco...', cacheKey);

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

            storeCache.set(cacheKey, { data, count }, CacheTTL.MEDIUM);
            console.log('💾 Contatos salvos no CACHE:', cacheKey);

            return { success: true, data, count, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchContacts', { filters });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const fetchContactById = async (contactId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            const found = contacts.value.find(c => c.id === contactId);
            if (found && found.opportunities) {
                currentContact.value = found;
                loading.value = false;
                console.log('✅ Contato encontrado na lista local');
                return { success: true, data: found, source: 'local' };
            }

            const cacheKey = `contacts:${userId}:detail:${contactId}`;

            const cached = storeCache.get(cacheKey);
            if (cached) {
                currentContact.value = cached;
                loading.value = false;
                console.log('✅ Contato carregado do CACHE');
                return { success: true, data: cached, fromCache: true };
            }

            console.log('⏳ Cache MISS, buscando do banco (3 queries em PARALELO)...');
            const [
                { data: contactData, error: contactError },
                { data: opportunities, error: oppError },
                { data: messages, error: msgError }
            ] = await Promise.all([
                supabase
                    .from('contacts')
                    .select(`
                        *,
                        agent:agents(id, name)
                    `)
                    .eq('id', contactId)
                    .eq('user_id', userId)
                    .is('deleted_at', null)
                    .single(),

                supabase
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
                    .order('created_at', { ascending: false }),

                supabase
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
                    .limit(50)
            ]);

            if (contactError) throw contactError;
            if (oppError) throw oppError;
            if (msgError) throw msgError;

            const fullContact = {
                ...contactData,
                opportunities: opportunities || [],
                messages: messages || []
            };

            currentContact.value = fullContact;

            storeCache.set(cacheKey, fullContact, CacheTTL.SHORT);
            console.log('💾 Contato salvo no CACHE');

            return { success: true, data: fullContact, fromCache: false };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchContactById', { contactId });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const fetchContactMetrics = async (contactId) => {
        try {
            const { data, error } = await supabase.rpc('get_contact_metrics', {
                p_contact_id: contactId
            });

            if (error) throw error;

            return { success: true, data };
        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'fetchContactMetrics', { contactId });
            console.error(friendlyMessage);
            return { success: false, error: err };
        }
    };

    const updateContactStatus = async (contactId, newStatus) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

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

            const pattern = createInvalidationPattern('contacts', userId);
            storeCache.invalidatePattern(pattern);
            storeCache.delete(`contacts:${userId}:detail:${contactId}`);
            console.log('🗑️  Cache invalidado após update status');

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateContactStatus', {
                contactId,
                newStatus
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updateContact = async (contactId, updates) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

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

            const pattern = createInvalidationPattern('contacts', userId);
            storeCache.invalidatePattern(pattern);
            storeCache.delete(`contacts:${userId}:detail:${contactId}`);
            console.log('🗑️  Cache invalidado após update');

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateContact', {
                contactId,
                updates
            });
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

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

            try {
                const { data, error: searchError } = await supabase.rpc('search_contacts', {
                    p_user_id: userId,
                    p_search_term: search || null,
                    p_status: status === 'all' ? null : status,
                    p_limit: limit,
                    p_offset: offset
                });

                if (!searchError && data) {
                    contacts.value = data || [];
                    totalCount.value = data?.length || 0;

                    console.log('✅ Busca via RPC otimizado');
                    return { success: true, data, source: 'rpc' };
                }
            } catch (rpcError) {
                console.warn('⚠️  RPC search_contacts não disponível, usando fallback');
            }

            console.log('📋 Usando query normal (fallback)');
            return await fetchContacts(filters);

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'searchContactsOptimized', { filters });
            console.error(friendlyMessage);
            return await fetchContacts(filters);
        } finally {
            loading.value = false;
        }
    };

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
