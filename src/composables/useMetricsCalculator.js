import { getMinutesDifference, getDateRangeFromPeriod, filterByDateRange } from '../utils/date';
import { formatTimeFromMinutes } from '../utils/formatters';
import { groupOpportunitiesByStatus } from '../utils/opportunityUtils.js';

export const useMetricsCalculator = () => {

    /**
     * Calcula o tempo médio até conversão
     * @param {Array} opportunities - Lista de oportunidades
     * @returns {string} Tempo médio formatado
     */
    const calculateAverageConversionTime = (opportunities) => {
        if (!opportunities || opportunities.length === 0) return '0min';

        let totalMinutes = 0;
        let count = 0;

        for (const opp of opportunities) {
            if (opp.status !== 'won') continue;

            if (opp.conversion_time_minutes) {
                totalMinutes += opp.conversion_time_minutes;
                count++;
                continue;
            }

            if (opp.created_at && opp.updated_at) {
                const minutes = getMinutesDifference(opp.created_at, opp.updated_at);
                if (minutes > 0) {
                    totalMinutes += minutes;
                    count++;
                }
            }
        }

        if (count === 0) return '0min';

        const avgMinutes = Math.floor(totalMinutes / count);
        return formatTimeFromMinutes(avgMinutes);
    };

    /**
     * ✅ NOVO: Calcula o tempo médio até recuperação
     * @param {Array} opportunities - Lista de oportunidades
     * @returns {string} Tempo médio formatado
     */
    const calculateAverageRecoveryTime = (opportunities) => {
        if (!opportunities || opportunities.length === 0) return '0min';

        let totalMinutes = 0;
        let count = 0;

        for (const opp of opportunities) {
            if (opp.status !== 'recovered') continue;

            if (opp.recovery_time_minutes) {
                totalMinutes += opp.recovery_time_minutes;
                count++;
                continue;
            }

            if (opp.created_at && opp.updated_at) {
                const minutes = getMinutesDifference(opp.created_at, opp.updated_at);
                if (minutes > 0) {
                    totalMinutes += minutes;
                    count++;
                }
            }
        }

        if (count === 0) return '0min';

        const avgMinutes = Math.floor(totalMinutes / count);
        return formatTimeFromMinutes(avgMinutes);
    };

    /**
     * Calcula a média de mensagens para conversões
     * @param {Array} opportunities - Lista de oportunidades
     * @returns {number} Média de mensagens
     */
    const calculateAverageMessages = (opportunities) => {
        if (!opportunities || opportunities.length === 0) return 0;

        let totalMessages = 0;
        let count = 0;

        for (const opp of opportunities) {
            if (opp.status === 'won' && opp.message_count > 0) {
                totalMessages += opp.message_count;
                count++;
            }
        }

        return count > 0 ? Math.round(totalMessages / count) : 0;
    };

    /**
     * ✅ NOVO: Calcula a média de mensagens até recuperação
     * @param {Array} opportunities - Lista de oportunidades
     * @returns {number} Média de mensagens
     */
    const calculateAverageRecoveryMessages = (opportunities) => {
        if (!opportunities || opportunities.length === 0) return 0;

        let totalMessages = 0;
        let count = 0;

        for (const opp of opportunities) {
            if (opp.status === 'recovered' && opp.message_count > 0) {
                totalMessages += opp.message_count;
                count++;
            }
        }

        return count > 0 ? Math.round(totalMessages / count) : 0;
    };

    /**
     * ✅ ATUALIZADO: Calcula o ROI (Return on Investment)
     * Agora considera oportunidades recuperadas também
     * @param {Array} opportunities - Lista de oportunidades
     * @param {number} investmentCost - Custo do investimento (opcional)
     * @returns {number} ROI em porcentagem
     */
    const calculateROI = (opportunities, investmentCost = null) => {
        if (!opportunities || opportunities.length === 0) return 0;

        let totalRevenue = 0;

        for (const opp of opportunities) {
            if (opp.status === 'won' || opp.status === 'recovered') {
                const value = parseFloat(opp.converted_value || opp.value || 0);
                totalRevenue += value;
            }
        }

        const cost = investmentCost || (totalRevenue * 0.2);

        if (cost === 0) return 0;

        const roi = ((totalRevenue - cost) / cost);
        return roi > 0 ? parseFloat(roi.toFixed(2)) : 0;
    };

    /**
     * ✅ ATUALIZADO: Calcula todas as métricas de uma vez
     * Agora inclui métricas de recuperação
     * Otimizado: single-pass algorithm
     * @param {Array} opportunities - Lista de oportunidades
     * @returns {Object} Objeto com todas as métricas
     */
    const calculateAllMetrics = (opportunities) => {
        if (!opportunities || opportunities.length === 0) {
            return {
                total: 0,
                active: 0,
                won: 0,
                lost: 0,
                recovered: 0,
                totalValue: 0,
                convertedValue: 0,
                lostValue: 0,
                recoveredValue: 0,
                conversionRate: 0,
                recoveryRate: 0,
                roi: 0,
                averageMessages: 0,
                averageRecoveryMessages: 0,
                averageTime: '0min',
                averageRecoveryTime: '0min'
            };
        }

        let activeCount = 0;
        let wonCount = 0;
        let lostCount = 0;
        let recoveredCount = 0;
        let totalValue = 0;
        let convertedValue = 0;
        let lostValue = 0;
        let recoveredValue = 0;
        let totalConversionMinutes = 0;
        let conversionCount = 0;
        let totalRecoveryMinutes = 0;
        let recoveryCount = 0;
        let totalMessages = 0;
        let messageCount = 0;
        let totalRecoveryMessages = 0;
        let recoveryMessageCount = 0;

        for (const opp of opportunities) {
            const oppValue = parseFloat(opp.value || 0);
            totalValue += oppValue;

            switch (opp.status) {
                case 'active':
                    activeCount++;
                    break;

                case 'won':
                    wonCount++;

                    const converted = parseFloat(opp.converted_value || opp.value || 0);
                    convertedValue += converted;

                    if (opp.conversion_time_minutes) {
                        totalConversionMinutes += opp.conversion_time_minutes;
                        conversionCount++;
                    } else if (opp.created_at && opp.updated_at) {
                        const minutes = getMinutesDifference(opp.created_at, opp.updated_at);
                        if (minutes > 0) {
                            totalConversionMinutes += minutes;
                            conversionCount++;
                        }
                    }

                    if (opp.message_count > 0) {
                        totalMessages += opp.message_count;
                        messageCount++;
                    }
                    break;

                case 'lost':
                    lostCount++;
                    lostValue += oppValue;
                    break;

                case 'recovered':
                    recoveredCount++;

                    const recoveredVal = parseFloat(opp.converted_value || opp.value || 0);
                    recoveredValue += recoveredVal;

                    if (opp.recovery_time_minutes) {
                        totalRecoveryMinutes += opp.recovery_time_minutes;
                        recoveryCount++;
                    } else if (opp.created_at && opp.updated_at) {
                        const minutes = getMinutesDifference(opp.created_at, opp.updated_at);
                        if (minutes > 0) {
                            totalRecoveryMinutes += minutes;
                            recoveryCount++;
                        }
                    }

                    if (opp.message_count > 0) {
                        totalRecoveryMessages += opp.message_count;
                        recoveryMessageCount++;
                    }
                    break;
            }
        }

        const originalTotal = opportunities.length;
        const nonWonTotal = Math.max(0, originalTotal - wonCount);
        const conversionRate = originalTotal > 0 ? parseFloat(((wonCount / originalTotal) * 100).toFixed(1)) : 0;
        // Recovery rate: recovered / (total_non_won) as requested
        const recoveryRate = nonWonTotal > 0 ? parseFloat(((recoveredCount / nonWonTotal) * 100).toFixed(1)) : 0;

        const avgMessages = messageCount > 0 ? Math.round(totalMessages / messageCount) : 0;
        const avgRecoveryMessages = recoveryMessageCount > 0 ? Math.round(totalRecoveryMessages / recoveryMessageCount) : 0;

        const avgMinutes = conversionCount > 0 ? Math.floor(totalConversionMinutes / conversionCount) : 0;
        const avgRecoveryMinutes = recoveryCount > 0 ? Math.floor(totalRecoveryMinutes / recoveryCount) : 0;

        const averageTime = formatTimeFromMinutes(avgMinutes);
        const averageRecoveryTime = formatTimeFromMinutes(avgRecoveryMinutes);

        const totalRevenue = convertedValue + recoveredValue;
        const cost = totalRevenue * 0.2;
        const roi = cost > 0 && totalRevenue > cost ? Math.round(((totalRevenue - cost) / cost)) : 0;

        return {
            // `total` represents non-won opportunities per product/UX request
            total: nonWonTotal,
            active: activeCount,
            won: wonCount,
            lost: lostCount,
            recovered: recoveredCount,
            totalValue,
            convertedValue,
            lostValue,
            recoveredValue,
            conversionRate,
            recoveryRate,
            roi,
            averageMessages: avgMessages,
            averageRecoveryMessages: avgRecoveryMessages,
            averageTime,
            averageRecoveryTime
        };
    };

    /**
     * Calcula métricas de tendência (comparação com período anterior)
     * @param {Array} currentOpportunities - Oportunidades do período atual
     * @param {Array} previousOpportunities - Oportunidades do período anterior
     * @returns {Object} Métricas com tendências
     */
    const calculateTrends = (currentOpportunities, previousOpportunities) => {
        const current = calculateAllMetrics(currentOpportunities);
        const previous = calculateAllMetrics(previousOpportunities);

        const calculateChange = (currentValue, previousValue) => {
            if (previousValue === 0) return currentValue > 0 ? 100 : 0;
            return parseFloat((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
        };

        return {
            ...current,
            trends: {
                total: calculateChange(current.total, previous.total),
                won: calculateChange(current.won, previous.won),
                lost: calculateChange(current.lost, previous.lost),
                recovered: calculateChange(current.recovered, previous.recovered),
                conversionRate: calculateChange(current.conversionRate, previous.conversionRate),
                recoveryRate: calculateChange(current.recoveryRate, previous.recoveryRate),
                totalValue: calculateChange(current.totalValue, previous.totalValue),
                convertedValue: calculateChange(current.convertedValue, previous.convertedValue),
                recoveredValue: calculateChange(current.recoveredValue, previous.recoveredValue)
            }
        };
    };

    return {
        calculateAverageConversionTime,
        calculateAverageRecoveryTime,
        calculateAverageMessages,
        calculateAverageRecoveryMessages,
        calculateROI,
        calculateAllMetrics,
        calculateTrends,

        filterByDateRange,
        getDateRangeFromPeriod,
        groupByStatus: groupOpportunitiesByStatus
    };
};