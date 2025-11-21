import { STATUS_COLORS, OPPORTUNITY_TYPE_LABELS, LOST_REASON_LABELS } from './constants';

export const formatOpportunityStatus = (status) => {
    const statusMap = {
        active: 'Ativa',
        won: 'Ganha',
        lost: 'Perdida',
        paused: 'Pausada'
    };
    return statusMap[status] || status;
};

export const formatOpportunityType = (type) => {
    return OPPORTUNITY_TYPE_LABELS[type] || type;
};


export const formatLostReason = (reason) => {
    return LOST_REASON_LABELS[reason] || reason;
};

export const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};


export const groupOpportunitiesByStatus = (opportunities) => {
    if (!opportunities || opportunities.length === 0) {
        return { 
            active: [], 
            won: [], 
            lost: [], 
            paused: [] 
        };
    }

    const grouped = {
        active: [],
        won: [],
        lost: [],
        paused: []
    };

    for (const opp of opportunities) {
        const status = opp.status || 'active';
        if (grouped[status]) {
            grouped[status].push(opp);
        }
    }

    return grouped;
};


export const calculateTotalValue = (opportunities) => {
    if (!opportunities || opportunities.length === 0) return 0;
    
    return opportunities.reduce((sum, opp) => 
        sum + (parseFloat(opp.value) || 0), 0
    );
};


export const calculateConvertedValue = (opportunities) => {
    if (!opportunities || opportunities.length === 0) return 0;
    
    return opportunities
        .filter(opp => opp.status === 'won')
        .reduce((sum, opp) => 
            sum + (parseFloat(opp.converted_value || opp.value) || 0), 0
        );
};


export const calculateConversionRate = (opportunities) => {
    if (!opportunities || opportunities.length === 0) return 0;
    
    const total = opportunities.length;
    const won = opportunities.filter(opp => opp.status === 'won').length;
    
    return parseFloat(((won / total) * 100).toFixed(1));
};


export const validateOpportunity = (opportunityData) => {
    const errors = [];

    if (!opportunityData.contact_id) {
        errors.push('Contato é obrigatório');
    }

    if (!opportunityData.value || parseFloat(opportunityData.value) <= 0) {
        errors.push('Valor deve ser maior que zero');
    }

    if (!opportunityData.status) {
        errors.push('Status é obrigatório');
    }

    if (opportunityData.status === 'won' && !opportunityData.converted_value) {
        errors.push('Valor convertido é obrigatório para oportunidades ganhas');
    }

    if (opportunityData.status === 'lost' && !opportunityData.lost_reason) {
        errors.push('Razão da perda é obrigatória');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

export const filterOpportunitiesBySearch = (opportunities, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
        return opportunities;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return opportunities.filter(opp => {
        const contactName = opp.contact?.name?.toLowerCase() || '';
        const contactPhone = opp.contact?.phone?.toLowerCase() || '';
        const contactEmail = opp.contact?.email?.toLowerCase() || '';
        const notes = opp.notes?.toLowerCase() || '';
        const value = String(opp.value || '').toLowerCase();

        return contactName.includes(searchLower) ||
               contactPhone.includes(searchLower) ||
               contactEmail.includes(searchLower) ||
               notes.includes(searchLower) ||
               value.includes(searchLower);
    });
};