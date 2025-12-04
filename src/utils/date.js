/**
 * Calcula a diferença em minutos entre duas datas
 */
export const getMinutesDifference = (start, end) => {
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 0;
    }

    const diffMs = endDate - startDate;
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
};

/**
 * Calcula a diferença em dias entre duas datas
 */
export const getDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
    }

    const diffMs = end - start;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Retorna o range de datas baseado em um período predefinido
 */
export const getDateRangeFromPeriod = (period) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let startDate = null;

    switch (period) {
        case 'last7days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            break;

        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
            break;

        case 'last30days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30);
            startDate.setHours(0, 0, 0, 0);
            break;

        case 'year':
            startDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
            break;

        case 'all':
            return { startDate: null, endDate: null };

        default:
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
    }

    return {
        startDate: startDate.toISOString(),
        endDate: today.toISOString()
    };
};

/**
 * Filtra itens por range de datas
 */
export const filterByDateRange = (items, startDate, endDate, dateField = 'created_at') => {
    if (!items || items.length === 0) return [];
    if (!startDate || !endDate) return items;

    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn('Invalid date range provided');
        return items;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const startTime = start.getTime();
    const endTime = end.getTime();

    return items.filter(item => {
        if (!item[dateField]) return false;

        const itemDate = new Date(item[dateField]);
        if (isNaN(itemDate.getTime())) return false;

        const itemTime = itemDate.getTime();
        return itemTime >= startTime && itemTime <= endTime;
    });
};

/**
 * Verifica se uma data é válida
 */
export const isValidDate = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return !isNaN(dateObj.getTime());
};

/**
 * Converte string em objeto Date
 */
export const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
};