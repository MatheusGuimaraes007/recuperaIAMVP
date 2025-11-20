import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useOpportunitiesStore } from '../stores/useOpportunitiesStore.js';
import { useMetricsCalculator } from './useMetricsCalculator.js';
import { 
    formatOpportunityStatus, 
    formatOpportunityType, 
    formatLostReason,
    getStatusColor,
    validateOpportunity,
    groupOpportunitiesByStatus
} from '../utils/opportunityUtils.js';
import { formatCurrency, formatDate } from '../utils/formatters';

export const useOpportunities = () => {
    const opportunitiesStore = useOpportunitiesStore();
    const metricsCalculator = useMetricsCalculator();

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
        bulkUpdateOpportunities,
        updateFilters,
        clearFilters,
        clearError
    } = opportunitiesStore;


    /**
     * Oportunidades agrupadas por status
     */
    const opportunitiesByStatus = computed(() => 
        groupOpportunitiesByStatus(opportunities.value)
    );

    const activeOpportunities = computed(() => 
        opportunitiesByStatus.value.active
    );

    const wonOpportunities = computed(() => 
        opportunitiesByStatus.value.won
    );

    const lostOpportunities = computed(() => 
        opportunitiesByStatus.value.lost
    );

    const pausedOpportunities = computed(() => 
        opportunitiesByStatus.value.paused
    );

    /**
     * Valores totais
     */
    const totalValue = computed(() => {
        return opportunities.value.reduce((sum, opp) => 
            sum + (parseFloat(opp.value) || 0), 0
        );
    });

    const convertedValue = computed(() => {
        return wonOpportunities.value.reduce((sum, opp) => 
            sum + (parseFloat(opp.converted_value || opp.value) || 0), 0
        );
    });

    const conversionRate = computed(() => {
        const total = opportunities.value.length;
        if (total === 0) return 0;
        const won = wonOpportunities.value.length;
        return parseFloat(((won / total) * 100).toFixed(1));
    });

    /**
     * Helpers de estado
     */
    const hasOpportunities = computed(() => 
        opportunities.value.length > 0
    );

    const hasActiveFilters = computed(() => {
        return filters.value.status !== null ||
               filters.value.search !== null ||
               filters.value.period !== 'last7days' ||
               filters.value.startDate !== null ||
               filters.value.endDate !== null;
    });


    const getOpportunitiesByStatus = (status) => {
        return opportunitiesByStatus.value[status] || [];
    };

    const getOpportunityById = (id) => {
        return opportunities.value.find(opp => opp.id === id) || null;
    };


    const getOpportunityMetrics = () => {
        return metricsCalculator.calculateAllMetrics(opportunities.value);
    };

    const getMetricsByPeriod = (period) => {
        if (period === 'all') {
            return metricsCalculator.calculateAllMetrics(opportunities.value);
        }
        
        const { startDate, endDate } = metricsCalculator.getDateRangeFromPeriod(period);
        const filteredOpps = metricsCalculator.filterByDateRange(
            opportunities.value, 
            startDate, 
            endDate
        );
        
        return metricsCalculator.calculateAllMetrics(filteredOpps);
    };

    const getMetricsByDateRange = (startDate, endDate) => {
        const filteredOpps = metricsCalculator.filterByDateRange(
            opportunities.value,
            startDate,
            endDate
        );
        
        return metricsCalculator.calculateAllMetrics(filteredOpps);
    };

    const getMetricsTrends = (currentPeriod = 'last7days') => {
        const current = getMetricsByPeriod(currentPeriod);
        return current;
    };



    const markAsWon = async (id, convertedValue) => {
        return updateOpportunity(id, {
            status: 'won',
            converted_value: convertedValue,
            updated_at: new Date().toISOString()
        });
    };

    const markAsLost = async (id, reason, notes = null) => {
        const updates = {
            status: 'lost',
            lost_reason: reason,
            updated_at: new Date().toISOString()
        };
        
        if (notes) {
            updates.notes = notes;
        }
        
        return updateOpportunity(id, updates);
    };

    const reactivateOpportunity = async (id) => {
        return updateOpportunity(id, {
            status: 'active',
            lost_reason: null,
            updated_at: new Date().toISOString()
        });
    };

    const bulkUpdateStatus = async (ids, newStatus) => {
        return bulkUpdateOpportunities(ids, { status: newStatus });
    };


    return {
        opportunities,
        currentOpportunity,
        loading,
        error,
        totalCount,
        filters,


        opportunitiesByStatus,
        activeOpportunities,
        wonOpportunities,
        lostOpportunities,
        pausedOpportunities,
        totalValue,
        convertedValue,
        conversionRate,
        hasOpportunities,
        hasActiveFilters,

        fetchOpportunities,
        fetchOpportunityById,
        createOpportunity,
        updateOpportunity,
        deleteOpportunity,
        bulkUpdateOpportunities,
        updateFilters,
        clearFilters,
        clearError,


        getOpportunitiesByStatus,
        getOpportunityById,
        
        getOpportunityMetrics,
        getMetricsByPeriod,
        getMetricsByDateRange,
        getMetricsTrends,

        markAsWon,
        markAsLost,
        reactivateOpportunity,
        bulkUpdateStatus,

        formatOpportunityStatus,
        formatOpportunityType,
        formatLostReason,
        formatCurrency,
        formatDate,
        getStatusColor,
        validateOpportunity
    };
};