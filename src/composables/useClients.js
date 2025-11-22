import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useClientsStore } from '../stores/useClientsStore.js';
import { formatPhone } from '../utils/formatters';

export const useClients = () => {
    const clientsStore = useClientsStore();

    // State refs da store
    const {
        contacts,
        currentContact,
        totalCount,
        loading,
        error
    } = storeToRefs(clientsStore);

    // Actions da store
    const {
        fetchContacts,
        fetchContactById,
        fetchContactMetrics,
        updateContactStatus,
        updateContact,
        searchContactsOptimized,
        clearContacts,
        clearCurrentContact,
        clearError
    } = clientsStore;

    // Computed: verifica se há contatos
    const hasContacts = computed(() => {
        return contacts.value && contacts.value.length > 0;
    });

    // Computed: verifica se há contato atual carregado
    const hasCurrentContact = computed(() => {
        return currentContact.value !== null;
    });

    /**
     * Configuração de cores e labels para status de contatos
     */
    const contactStatusConfig = (status) => {
        const configs = {
            new: {
                label: 'Novo',
                color: '#3b82f6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                icon: '🆕',
                description: 'Contato recém adicionado'
            },
            engaged: {
                label: 'Engajado',
                color: '#8b5cf6',
                bgColor: 'rgba(139, 92, 246, 0.1)',
                icon: '💬',
                description: 'Contato em conversa ativa'
            },
            qualified: {
                label: 'Qualificado',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                icon: '⭐',
                description: 'Lead qualificado para venda'
            },
            converted: {
                label: 'Convertido',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '✅',
                description: 'Cliente convertido'
            },
            lost: {
                label: 'Perdido',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '❌',
                description: 'Oportunidade perdida'
            },
            blocked: {
                label: 'Bloqueado',
                color: '#6b7280',
                bgColor: 'rgba(107, 114, 128, 0.1)',
                icon: '🚫',
                description: 'Contato bloqueado'
            }
        };

        return configs[status] || configs.new;
    };

    /**
     * Métricas agregadas dos contatos carregados
     * Calcula totais por status e taxa de conversão
     */
    const getContactMetrics = computed(() => {
        if (!hasContacts.value) {
            return {
                total: 0,
                new: 0,
                engaged: 0,
                qualified: 0,
                converted: 0,
                lost: 0,
                blocked: 0,
                conversionRate: 0
            };
        }

        const metrics = contacts.value.reduce((acc, contact) => {
            acc.total++;
            if (contact.status) {
                acc[contact.status] = (acc[contact.status] || 0) + 1;
            }
            return acc;
        }, {
            total: 0,
            new: 0,
            engaged: 0,
            qualified: 0,
            converted: 0,
            lost: 0,
            blocked: 0
        });

        // Taxa de conversão (convertidos / total)
        metrics.conversionRate = metrics.total > 0
            ? ((metrics.converted / metrics.total) * 100).toFixed(1)
            : 0;

        return metrics;
    });

    /**
     * Métricas do contato atual (da página de detalhes)
     * Calcula estatísticas baseadas nas oportunidades
     */
    const getCurrentContactMetrics = computed(() => {
        if (!hasCurrentContact.value || !currentContact.value.opportunities) {
            return {
                totalOpportunities: 0,
                wonOpportunities: 0,
                lostOpportunities: 0,
                activeOpportunities: 0,
                totalValue: 0,
                totalConverted: 0,
                conversionRate: 0,
                averageConversionTime: 0,
                totalMessages: 0
            };
        }

        const opps = currentContact.value.opportunities;
        
        const metrics = {
            totalOpportunities: opps.length,
            wonOpportunities: opps.filter(o => o.status === 'won').length,
            lostOpportunities: opps.filter(o => o.status === 'lost').length,
            activeOpportunities: opps.filter(o => o.status === 'active').length,
            totalValue: opps.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0),
            totalConverted: opps.reduce((sum, o) => sum + (parseFloat(o.converted_value) || 0), 0),
            totalMessages: currentContact.value.messages?.length || 0
        };

        // Taxa de conversão
        metrics.conversionRate = metrics.totalOpportunities > 0
            ? ((metrics.wonOpportunities / metrics.totalOpportunities) * 100).toFixed(1)
            : 0;

        // Tempo médio de conversão (apenas de oportunidades ganhas com tempo registrado)
        const wonWithTime = opps.filter(o => 
            o.status === 'won' && o.conversion_time_minutes
        );
        
        metrics.averageConversionTime = wonWithTime.length > 0
            ? Math.round(
                wonWithTime.reduce((sum, o) => sum + o.conversion_time_minutes, 0) / wonWithTime.length
            )
            : 0;

        return metrics;
    });

    /**
     * Opções de status para filtros
     */
    const statusOptions = [
        { value: 'all', label: 'Todos', count: 0 },
        { value: 'new', label: 'Novos', count: 0 },
        { value: 'engaged', label: 'Engajados', count: 0 },
        { value: 'qualified', label: 'Qualificados', count: 0 },
        { value: 'converted', label: 'Convertidos', count: 0 },
        { value: 'lost', label: 'Perdidos', count: 0 },
        { value: 'blocked', label: 'Bloqueados', count: 0 }
    ];

    /**
     * Opções de status com contadores atualizados
     */
    const statusOptionsWithCount = computed(() => {
        const metrics = getContactMetrics.value;
        
        return statusOptions.map(option => ({
            ...option,
            count: option.value === 'all' ? metrics.total : (metrics[option.value] || 0)
        }));
    });

    /**
     * Configuração de status para oportunidades
     */
    const opportunityStatusConfig = (status) => {
        const configs = {
            active: {
                label: 'Ativo',
                color: '#3b82f6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                icon: '🔵'
            },
            won: {
                label: 'Ganho',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '✅'
            },
            lost: {
                label: 'Perdido',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '❌'
            },
            paused: {
                label: 'Pausado',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                icon: '⏸️'
            }
        };

        return configs[status] || configs.active;
    };

    /**
     * Labels amigáveis para tipos de oportunidade
     */
    const getOpportunityTypeLabel = (type) => {
        const types = {
            'pix': 'PIX',
            'pix_gerado': 'PIX Gerado',
            'boleto': 'Boleto',
            'boleto_emitido': 'Boleto Emitido',
            'cartao': 'Cartão de Crédito',
            'cartao_recusado': 'Cartão Recusado',
            'carrinho': 'Carrinho',
            'carrinho_abandonado': 'Carrinho Abandonado'
        };

        return types[type] || type;
    };

    /**
     * Labels para motivos de perda
     */
    const getLostReasonLabel = (reason) => {
        const reasons = {
            'price': 'Preço Alto',
            'no_response': 'Sem Resposta',
            'competitor': 'Escolheu Concorrente',
            'not_interested': 'Não Interessado',
            'other': 'Outro Motivo'
        };

        return reasons[reason] || reason;
    };

    /**
     * Busca otimizada com fallback
     * Tenta usar a função SQL otimizada, se falhar usa a query normal
     */
    const searchContacts = async (filters = {}) => {
        try {
            // Tenta usar a versão otimizada primeiro
            const result = await searchContactsOptimized(filters);
            
            if (!result.success) {
                // Fallback para busca normal
                return await fetchContacts(filters);
            }
            
            return result;
        } catch (err) {
            console.warn('Busca otimizada falhou, usando busca padrão:', err);
            return await fetchContacts(filters);
        }
    };

    return {
        // State
        contacts,
        currentContact,
        totalCount,
        loading,
        error,
        
        // Computed
        hasContacts,
        hasCurrentContact,
        getContactMetrics,
        getCurrentContactMetrics,
        statusOptionsWithCount,
        
        // Configs
        contactStatusConfig,
        opportunityStatusConfig,
        statusOptions,
        
        // Helpers
        getOpportunityTypeLabel,
        getLostReasonLabel,
        formatPhone,
        
        // Actions
        fetchContacts,
        fetchContactById,
        fetchContactMetrics,
        updateContactStatus,
        updateContact,
        searchContacts,
        clearContacts,
        clearCurrentContact,
        clearError
    };
};