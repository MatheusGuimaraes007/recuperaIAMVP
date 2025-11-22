import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAgentsStore } from '../stores/useAgentsStore.js';
import { formatPhone } from '../utils/formatters';

export const useAgents = () => {
    const agentsStore = useAgentsStore();

    const {
        agents,
        currentAgent,
        totalCount,
        loading,
        error
    } = storeToRefs(agentsStore);

    const {
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
    } = agentsStore;

    const hasAgents = computed(() => {
        return agents.value && agents.value.length > 0;
    });

    const hasCurrentAgent = computed(() => {
        return currentAgent.value !== null;
    });

    /**
     * Modelos de IA disponíveis
     */
    const aiModels = [
        { value: 'gpt-4', label: 'GPT-4 (Mais Inteligente)', icon: '🧠' },
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Rápido)', icon: '⚡' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Econômico)', icon: '💰' },
        { value: 'claude-3', label: 'Claude 3 (Alternativo)', icon: '🤖' }
    ];

    /**
     * Opções de tom de voz
     */
    const toneOfVoiceOptions = [
        { value: 'professional', label: 'Profissional', icon: '💼' },
        { value: 'friendly', label: 'Amigável', icon: '😊' },
        { value: 'casual', label: 'Casual', icon: '👋' },
        { value: 'persuasive', label: 'Persuasivo', icon: '🎯' },
        { value: 'empathetic', label: 'Empático', icon: '❤️' },
        { value: 'technical', label: 'Técnico', icon: '🔧' }
    ];

    /**
     * Configuração de status do número WhatsApp
     */
    const whatsappStatusConfig = (status) => {
        const configs = {
            active: {
                label: 'Ativo',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '✅'
            },
            pending: {
                label: 'Pendente',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                icon: '⏳'
            },
            inactive: {
                label: 'Inativo',
                color: '#6b7280',
                bgColor: 'rgba(107, 114, 128, 0.1)',
                icon: '⭕'
            },
            error: {
                label: 'Erro',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '❌'
            }
        };

        return configs[status] || configs.pending;
    };

    /**
     * Formata tokens usados para exibição
     */
    const formatTokens = (tokens) => {
        if (!tokens) return '0';

        if (tokens >= 1000000) {
            return `${(tokens / 1000000).toFixed(1)}M`;
        }
        if (tokens >= 1000) {
            return `${(tokens / 1000).toFixed(1)}K`;
        }
        return tokens.toString();
    };

    /**
     * Calcula custo estimado baseado em tokens
     * GPT-4: ~$0.03 por 1K tokens
     * GPT-3.5: ~$0.002 por 1K tokens
     */
    const calculateTokenCost = (tokens, model = 'gpt-4') => {
        if (!tokens) return 0;

        const costs = {
            'gpt-4': 0.03,
            'gpt-4-turbo': 0.01,
            'gpt-3.5-turbo': 0.002,
            'claude-3': 0.015
        };

        const costPerK = costs[model] || 0.03;
        return ((tokens / 1000) * costPerK).toFixed(2);
    };

    /**
     * Métricas agregadas dos agentes carregados
     */
    const getAgentsMetrics = computed(() => {
        if (!hasAgents.value) {
            return {
                total: 0,
                totalTokens: 0,
                totalCost: 0,
                activeAgents: 0
            };
        }

        const metrics = agents.value.reduce((acc, agent) => {
            acc.total++;
            acc.totalTokens += agent.token_used || 0;

            if (agent.whatsapp_number?.status === 'active') {
                acc.activeAgents++;
            }

            return acc;
        }, {
            total: 0,
            totalTokens: 0,
            totalCost: 0,
            activeAgents: 0
        });

        // Calcular custo total (média entre modelos)
        metrics.totalCost = agents.value.reduce((sum, agent) => {
            return sum + parseFloat(calculateTokenCost(agent.token_used, agent.ai_model));
        }, 0).toFixed(2);

        return metrics;
    });

    /**
     * Métricas do agente atual
     */
    const getCurrentAgentMetrics = computed(() => {
        if (!hasCurrentAgent.value) {
            return {
                total_contacts: 0,
                converted_contacts: 0,
                engaged_contacts: 0,
                total_opportunities: 0,
                won_opportunities: 0,
                active_opportunities: 0,
                total_revenue: 0,
                total_messages: 0,
                avg_conversion_time_minutes: 0,
                conversion_rate: 0,
                token_cost: 0
            };
        }

        const agent = currentAgent.value;
        const tokenCost = calculateTokenCost(agent.token_used, agent.ai_model);

        return {
            total_contacts: agent.recent_contacts?.length || 0,
            total_opportunities: agent.recent_opportunities?.length || 0,
            token_cost: tokenCost,
        };
    });

    /**
     * Valida dados do agente antes de salvar
     */
    const validateAgentData = (agentData) => {
        const errors = [];

        if (!agentData.name || agentData.name.trim() === '') {
            errors.push('Nome do agente é obrigatório');
        }

        if (!agentData.prompt || agentData.prompt.trim() === '') {
            errors.push('Prompt é obrigatório');
        }

        if (!agentData.tone_of_voice) {
            errors.push('Tom de voz é obrigatório');
        }

        if (!agentData.ai_model) {
            errors.push('Modelo de IA é obrigatório');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    };

    /**
     * Busca otimizada com fallback
     */
    const searchAgents = async (filters = {}) => {
        try {
            const result = await searchAgentsOptimized(filters);

            if (!result.success) {
                return await fetchAgents(filters);
            }

            return result;
        } catch (err) {
            console.warn('Busca otimizada falhou, usando busca padrão:', err);
            return await fetchAgents(filters);
        }
    };

    /**
     * Label amigável para modelo de IA
     */
    const getAIModelLabel = (model) => {
        const found = aiModels.find(m => m.value === model);
        return found ? found.label : model;
    };

    /**
     * Label amigável para tom de voz
     */
    const getToneOfVoiceLabel = (tone) => {
        const found = toneOfVoiceOptions.find(t => t.value === tone);
        return found ? found.label : tone;
    };

    /**
     * Formata número WhatsApp para exibição
     */
    const formatWhatsappNumber = (number) => {
        if (!number) return 'Não configurado';
        return formatPhone(number);
    };

    /**
     * Calcula taxa de resposta do agente
     */
    const calculateResponseRate = (metrics) => {
        if (!metrics || !metrics.total_messages) return 0;

        // Supondo que 50% das mensagens são outbound
        const estimatedSent = Math.floor(metrics.total_messages / 2);
        const estimatedReceived = metrics.total_messages - estimatedSent;

        if (estimatedSent === 0) return 0;

        return ((estimatedReceived / estimatedSent) * 100).toFixed(1);
    };

    /**
     * Status de saúde do agente baseado em métricas
     */
    const getAgentHealth = (metrics) => {
        if (!metrics) return { status: 'unknown', label: 'Desconhecido', color: '#6b7280' };

        const conversionRate = parseFloat(metrics.conversion_rate) || 0;
        const activeOpps = metrics.active_opportunities || 0;

        if (conversionRate >= 20 && activeOpps > 0) {
            return { status: 'excellent', label: 'Excelente', color: '#10b981', icon: '🌟' };
        }
        if (conversionRate >= 10) {
            return { status: 'good', label: 'Bom', color: '#7cba10', icon: '✅' };
        }
        if (conversionRate >= 5) {
            return { status: 'average', label: 'Médio', color: '#f59e0b', icon: '⚠️' };
        }
        return { status: 'poor', label: 'Baixo', color: '#ef4444', icon: '🔴' };
    };

    return {
        agents,
        currentAgent,
        totalCount,
        loading,
        error,

        hasAgents,
        hasCurrentAgent,
        getAgentsMetrics,
        getCurrentAgentMetrics,

        aiModels,
        toneOfVoiceOptions,
        whatsappStatusConfig,

        formatTokens,
        calculateTokenCost,
        validateAgentData,
        getAIModelLabel,
        getToneOfVoiceLabel,
        formatWhatsappNumber,
        calculateResponseRate,
        getAgentHealth,

        fetchAgents,
        fetchAgentById,
        fetchAgentMetrics,
        createAgent,
        updateAgent,
        deleteAgent,
        associateKnowledgeBase,
        dissociateKnowledgeBase,
        searchAgents,
        clearAgents,
        clearCurrentAgent,
        clearError
    };
};