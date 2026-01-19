import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { formatCurrency, formatDate, formatPhone } from '../utils/formatters';
import {useAdminClientsStore} from "../stores/useAdminClientsStore.js.js";

export const useAdminClients = () => {
    const adminClientsStore = useAdminClientsStore();

    const {
        clients,
        currentClient,
        totalCount,
        loading,
        error,
        platformStats
    } = storeToRefs(adminClientsStore);

    const {
        fetchPlatformClients,
        fetchClientMetrics,
        fetchClientById,
        updateClientStatus,
        fetchPlatformStats,
        clearClients,
        clearCurrentClient,
        clearError
    } = adminClientsStore;

    /**
     * Verifica se há clientes carregados
     */
    const hasClients = computed(() => {
        return clients.value && clients.value.length > 0;
    });

    /**
     * Verifica se há cliente atual selecionado
     */
    const hasCurrentClient = computed(() => {
        return currentClient.value !== null;
    });

    /**
     * Configuração de status para clientes
     */
    const clientStatusConfig = (status) => {
        const configs = {
            active: {
                label: 'Ativo',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '✅',
                description: 'Cliente com assinatura ativa'
            },
            trial: {
                label: 'Trial',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                icon: '🔄',
                description: 'Cliente em período de teste'
            },
            suspended: {
                label: 'Suspenso',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '⏸️',
                description: 'Assinatura suspensa'
            },
            canceled: {
                label: 'Cancelado',
                color: '#6b7280',
                bgColor: 'rgba(107, 114, 128, 0.1)',
                icon: '❌',
                description: 'Assinatura cancelada'
            }
        };

        return configs[status] || configs.trial;
    };

    /**
     * Opções de status para filtros
     */
    const statusOptions = [
        { value: 'all', label: 'Todos', count: 0 },
        { value: 'active', label: 'Ativos', count: 0 },
        { value: 'trial', label: 'Trial', count: 0 },
        { value: 'suspended', label: 'Suspensos', count: 0 },
        { value: 'canceled', label: 'Cancelados', count: 0 }
    ];

    /**
     * Métricas agregadas dos clientes
     */
    const getClientsMetrics = computed(() => {
        if (!hasClients.value) {
            return {
                total: 0,
                active: 0,
                trial: 0,
                suspended: 0,
                canceled: 0,
                totalOpportunities: 0,
                totalRecovered: 0,
                averageConversionRate: 0
            };
        }

        const metrics = clients.value.reduce((acc, client) => {
            acc.total++;
            if (client.status) {
                acc[client.status] = (acc[client.status] || 0) + 1;
            }
            
            // Agregar métricas de oportunidades
            if (client.metrics) {
                acc.totalOpportunities += client.metrics.totalOpportunities || 0;
                acc.totalRecovered += client.metrics.totalRecovered || 0;
                
                if (client.metrics.conversionRate > 0) {
                    acc.conversionRateSum += parseFloat(client.metrics.conversionRate);
                    acc.conversionRateCount++;
                }
            }
            
            return acc;
        }, {
            total: 0,
            active: 0,
            trial: 0,
            suspended: 0,
            canceled: 0,
            totalOpportunities: 0,
            totalRecovered: 0,
            conversionRateSum: 0,
            conversionRateCount: 0
        });

        metrics.averageConversionRate = metrics.conversionRateCount > 0
            ? (metrics.conversionRateSum / metrics.conversionRateCount).toFixed(1)
            : 0;

        return metrics;
    });

    const platformCardsMetrics = computed(() => {
        if (platformStats.value?.lastUpdated) {
            return {
                total: platformStats.value.totalClients || 0,
                active: platformStats.value.activeClients || 0,
                trial: platformStats.value.trialClients || 0,
                suspended: 0,
                canceled: 0,
                totalOpportunities: platformStats.value.totalOpportunities || 0,
                totalRecovered: platformStats.value.totalRecovered || 0,
                averageConversionRate: getClientsMetrics.value.averageConversionRate || 0
            };
        }

        return getClientsMetrics.value;
    });

    /**
     * Opções de status com contadores atualizados
     */
    const statusOptionsWithCount = computed(() => {
        const metrics = getClientsMetrics.value;
        
        return statusOptions.map(option => ({
            ...option,
            count: option.value === 'all' ? metrics.total : (metrics[option.value] || 0)
        }));
    });

    /**
     * Formata dados de um cliente para exibição
     */
    const formatClientForDisplay = (client) => {
        if (!client) return null;

        return {
            ...client,
            formattedPhone: formatPhone(client.phone),
            formattedCreatedAt: formatDate(client.created_at),
            formattedUpdatedAt: formatDate(client.updated_at),
            statusConfig: clientStatusConfig(client.status),
            formattedRecovered: formatCurrency(client.metrics?.totalRecovered || 0)
        };
    };

    /**
     * Retorna cor baseada no status
     */
    const getStatusColor = (status) => {
        return clientStatusConfig(status).color;
    };

    /**
     * Retorna badge de status formatado
     */
    const getStatusBadge = (status) => {
        const config = clientStatusConfig(status);
        return {
            label: config.label,
            color: config.color,
            bgColor: config.bgColor,
            icon: config.icon
        };
    };

    /**
     * Calcula crescimento percentual
     */
    const calculateGrowth = (current, previous) => {
        if (!previous || previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    return {
        // State
        clients,
        currentClient,
        totalCount,
        loading,
        error,
        platformStats,

        // Computed
        hasClients,
        hasCurrentClient,
        getClientsMetrics,
        platformCardsMetrics,
        statusOptionsWithCount,

        // Actions
        fetchPlatformClients,
        fetchClientMetrics,
        fetchClientById,
        updateClientStatus,
        fetchPlatformStats,
        clearClients,
        clearCurrentClient,
        clearError,

        // Helpers
        clientStatusConfig,
        statusOptions,
        formatClientForDisplay,
        getStatusColor,
        getStatusBadge,
        calculateGrowth,

        // Formatters
        formatCurrency,
        formatDate,
        formatPhone
    };
};