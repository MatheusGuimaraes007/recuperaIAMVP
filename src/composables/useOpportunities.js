import { storeToRefs } from 'pinia';
import { useOpportunitiesStore } from '../stores/useOpportunitiesStore.js';

export const useOpportunities = () => {
    const opportunitiesStore = useOpportunitiesStore();

    const {
        opportunities,
        currentOpportunity,
        loading,
        error,
        totalCount,
        filters
    } = storeToRefs(opportunitiesStore);

    const {
        fetchOpportunities,
        fetchOpportunityById,
        createOpportunity,
        updateOpportunity,
        deleteOpportunity,
        updateFilters,
        clearFilters,
        clearError
    } = opportunitiesStore;

    const getOpportunitiesByStatus = (status) => {
        return opportunities.value.filter(opp => opp.status === status);
    };

    const getActiveOpportunities = () => {
        return opportunities.value.filter(opp => opp.status === 'active');
    };

    const getWonOpportunities = () => {
        return opportunities.value.filter(opp => opp.status === 'won');
    };

    const getLostOpportunities = () => {
        return opportunities.value.filter(opp => opp.status === 'lost');
    };

    const calculateTotalValue = (opportunitiesList = opportunities.value) => {
        return opportunitiesList.reduce((sum, opp) => sum + (parseFloat(opp.value) || 0), 0);
    };

    const calculateConvertedValue = (opportunitiesList = opportunities.value) => {
        return opportunitiesList
            .filter(opp => opp.status === 'won')
            .reduce((sum, opp) => sum + (parseFloat(opp.converted_value) || 0), 0);
    };

    const calculateConversionRate = () => {
        const total = opportunities.value.length;
        if (total === 0) return 0;

        const won = opportunities.value.filter(opp => opp.status === 'won').length;
        return ((won / total) * 100).toFixed(2);
    };

    const getOpportunityMetrics = () => {
        return {
            total: opportunities.value.length,
            active: getActiveOpportunities().length,
            won: getWonOpportunities().length,
            lost: getLostOpportunities().length,
            totalValue: calculateTotalValue(),
            convertedValue: calculateConvertedValue(),
            conversionRate: calculateConversionRate()
        };
    };

    const formatOpportunityStatus = (status) => {
        const statusMap = {
            active: 'Ativa',
            won: 'Ganha',
            lost: 'Perdida',
            paused: 'Pausada'
        };
        return statusMap[status] || status;
    };

    const formatOpportunityType = (type) => {
        const typeMap = {
            boleto: 'Boleto',
            pix: 'PIX',
            carrinho: 'Carrinho'
        };
        return typeMap[type] || type;
    };

    const formatLostReason = (reason) => {
        const reasonMap = {
            price: 'Preço',
            no_response: 'Sem resposta',
            competitor: 'Concorrente',
            not_interested: 'Não interessado',
            other: 'Outros'
        };
        return reasonMap[reason] || reason;
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
        updateFilters,
        clearFilters,
        clearError,

        getOpportunitiesByStatus,
        getActiveOpportunities,
        getWonOpportunities,
        getLostOpportunities,
        calculateTotalValue,
        calculateConvertedValue,
        calculateConversionRate,
        getOpportunityMetrics,

        formatOpportunityStatus,
        formatOpportunityType,
        formatLostReason
    };
};