import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from './useAuthStore';
import { storeCache, createInvalidationPattern } from '../utils/storeCache';
import ErrorHandler from '../utils/errorHandler';

export const useWhatsAppStore = defineStore('whatsapp', () => {
    const loading = ref(false);
    const error = ref(null);

    const setError = (message) => {
        error.value = message;
        setTimeout(() => { error.value = null; }, 5000);
    };

    const clearError = () => {
        error.value = null;
    };

    /**
     * Cria/Vincula um número oficial a um agente existente
     * 1. Cria o número na tabela official_whatsapp_numbers
     * 2. Atualiza a tabela agents com o ID do número criado
     */
    const createOfficialNumber = async (agentId, userId, numberData) => {
        loading.value = true;
        clearError();

        try {
            if (!agentId) throw new Error('ID do agente é obrigatório');
            if (!userId) throw new Error('ID do usuário é obrigatório');

            console.log('📱 1. Salvando WhatsApp para Agente:', agentId);

            // PASSO 1: Criar ou atualizar o número
            // Nota: Se sua tabela usa ID auto-incremento, remova o "id: agentId" abaixo
            // Se for relação 1:1 onde ID do numero = ID do agente, mantenha.
            // Pelo seu erro anterior, parece que ele aceitou o ID 8, então vou manter a lógica de ID = agentId
            const { data: wppData, error: upsertError } = await supabase
                .from('official_whatsapp_numbers')
                .upsert({
                    id: agentId, // Mantendo ID = AgentID (se sua tabela permitir)
                    user_id: userId,
                    phone_number: numberData.phone_number,
                    phone_number_id: numberData.phone_number_id,
                    display_name: numberData.display_name,
                    waba_id: numberData.waba_id,
                    api_token: numberData.api_token,
                    status: 'pending',
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (upsertError) throw upsertError;

            console.log('🔗 2. Vinculando número ao agente na tabela agents...');

            // PASSO 2: Atualizar a tabela AGENTS com o ID do número criado
            const { error: linkError } = await supabase
                .from('agents')
                .update({
                    official_whatsapp_number_id: wppData.id // ✅ O PULO DO GATO
                })
                .eq('id', agentId);

            if (linkError) {
                console.error('Erro ao vincular na tabela agents:', linkError);
                throw new Error('Número criado, mas falha ao vincular ao agente.');
            }

            // PASSO 3: Limpar Cache
            storeCache.delete(`agents:${userId}:detail:${agentId}`);
            const pattern = createInvalidationPattern('agents', userId);
            storeCache.invalidatePattern(pattern);

            // Se for admin logado, limpa o cache do admin também
            const authStore = useAuthStore();
            const loggedUserId = authStore.user?.id;
            if (loggedUserId && loggedUserId !== userId) {
                storeCache.delete(`agents:${loggedUserId}:detail:${agentId}`);
                storeCache.invalidatePattern(createInvalidationPattern('agents', loggedUserId));
            }

            return { success: true, data: wppData };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'createOfficialNumber');
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const updateOfficialNumber = async (agentId, updates) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            const { data, error: updateError } = await supabase
                .from('official_whatsapp_numbers')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', agentId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Invalida caches
            if (userId) {
                storeCache.delete(`agents:${userId}:detail:${agentId}`);
                storeCache.invalidatePattern(createInvalidationPattern('agents', userId));
            }

            return { success: true, data };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'updateOfficialNumber');
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const deleteOfficialNumber = async (agentId) => {
        loading.value = true;
        clearError();

        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;

            // 1. Remove vínculo primeiro
            await supabase.from('agents').update({ official_whatsapp_number_id: null }).eq('id', agentId);

            // 2. Deleta o número
            const { error: deleteError } = await supabase
                .from('official_whatsapp_numbers')
                .delete()
                .eq('id', agentId);

            if (deleteError) throw deleteError;

            if (userId) {
                storeCache.delete(`agents:${userId}:detail:${agentId}`);
                storeCache.invalidatePattern(createInvalidationPattern('agents', userId));
            }

            return { success: true };

        } catch (err) {
            const friendlyMessage = ErrorHandler.handle(err, 'deleteOfficialNumber');
            setError(friendlyMessage);
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        createOfficialNumber,
        updateOfficialNumber,
        deleteOfficialNumber,
        clearError
    };
});