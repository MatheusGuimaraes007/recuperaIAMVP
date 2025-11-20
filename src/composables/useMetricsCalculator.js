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
   * Calcula o ROI (Return on Investment)
   * @param {Array} opportunities - Lista de oportunidades
   * @param {number} investmentCost - Custo do investimento (opcional)
   * @returns {number} ROI em porcentagem
   */
  const calculateROI = (opportunities, investmentCost = null) => {
    if (!opportunities || opportunities.length === 0) return 0;
    
    let totalRevenue = 0;
    
    for (const opp of opportunities) {
      if (opp.status === 'won') {
        const value = parseFloat(opp.converted_value || opp.value || 0);
        totalRevenue += value;
      }
    }
    
    const cost = investmentCost || (totalRevenue * 0.2);
    
    if (cost === 0) return 0;
    
    const roi = ((totalRevenue - cost) / cost) * 100;
    return Math.round(roi);
  };

  /**
   * Calcula todas as métricas de uma vez
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
        totalValue: 0,
        convertedValue: 0,
        conversionRate: 0,
        roi: 0,
        averageMessages: 0,
        averageTime: '0min'
      };
    }

    let activeCount = 0;
    let wonCount = 0;
    let lostCount = 0;
    let totalValue = 0;
    let convertedValue = 0;
    let totalConversionMinutes = 0;
    let conversionCount = 0;
    let totalMessages = 0;
    let messageCount = 0;

    for (const opp of opportunities) {
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
          break;
      }
      
      totalValue += parseFloat(opp.value || 0);
    }


    const total = opportunities.length;
    const conversionRate = total > 0 ? parseFloat(((wonCount / total) * 100).toFixed(1)) : 0;
    const avgMessages = messageCount > 0 ? Math.round(totalMessages / messageCount) : 0;
    const avgMinutes = conversionCount > 0 ? Math.floor(totalConversionMinutes / conversionCount) : 0;
    const averageTime = formatTimeFromMinutes(avgMinutes);
    

    const cost = convertedValue * 0.2;
    const roi = cost > 0 ? Math.round(((convertedValue - cost) / cost) * 100) : 0;

    return {
      total,
      active: activeCount,
      won: wonCount,
      lost: lostCount,
      totalValue,
      convertedValue,
      conversionRate,
      roi,
      averageMessages: avgMessages,
      averageTime
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
        conversionRate: calculateChange(current.conversionRate, previous.conversionRate),
        totalValue: calculateChange(current.totalValue, previous.totalValue),
        convertedValue: calculateChange(current.convertedValue, previous.convertedValue)
      }
    };
  };

  return {
    calculateAverageConversionTime,
    calculateAverageMessages,
    calculateROI,
    calculateAllMetrics,
    
    calculateTrends,
    
    filterByDateRange,
    getDateRangeFromPeriod,
    groupByStatus: groupOpportunitiesByStatus
  };
};