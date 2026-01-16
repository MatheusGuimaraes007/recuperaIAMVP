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
 * Converte uma data (YYYY-MM-DD ou ISO) para um ISO UTC considerando um timezone específico.
 * Para datas no formato apenas data (YYYY-MM-DD) ajusta para início/fim do dia na timezone passada.
 * Retorna string ISO UTC pronta para ser usada em queries no backend.
 */
export const toZonedISOString = (dateInput, timeZone = 'America/Sao_Paulo', startOfDay = true) => {
    if (!dateInput) return null;

    // If a Date object is passed, treat it as a date-only (wall-clock) value
    if (dateInput instanceof Date) {
        const y = dateInput.getFullYear();
        const m = String(dateInput.getMonth() + 1).padStart(2, '0');
        const d = String(dateInput.getDate()).padStart(2, '0');
        dateInput = `${y}-${m}-${d}`;
    }

    // Se for apenas YYYY-MM-DD
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateInput);

    if (!isDateOnly) {
        // Assume ISO-like input já com timezone ou local; normaliza para ISO UTC
        const parsed = new Date(dateInput);
        if (isNaN(parsed.getTime())) return null;
        // If startOfDay/ endOfDay requested and input contains date+time, adjust to day bounds
        if (startOfDay === true || startOfDay === false) {
            const dt = new Date(parsed);
            if (startOfDay) {
                dt.setHours(0, 0, 0, 0);
            } else {
                dt.setHours(23, 59, 59, 999);
            }
            return dt.toISOString();
        }
        return parsed.toISOString();
    }

    const year = parseInt(dateInput.slice(0, 4), 10);
    const month = parseInt(dateInput.slice(5, 7), 10);
    const day = parseInt(dateInput.slice(8, 10), 10);

    const hour = startOfDay ? 0 : 23;
    const minute = startOfDay ? 0 : 59;
    const second = startOfDay ? 0 : 59;

    // Construct a Date object treating the wall-clock as if in UTC
    const utcMillisFromWallClock = Date.UTC(year, month - 1, day, hour, minute, second);

    // Use Intl to get how that instant appears in the target timezone
    const f = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    const parts = f.formatToParts(new Date(utcMillisFromWallClock));
    const partValues = {};
    for (const p of parts) partValues[p.type] = p.value;

    const fmtYear = parseInt(partValues.year, 10);
    const fmtMonth = parseInt(partValues.month, 10);
    const fmtDay = parseInt(partValues.day, 10);
    const fmtHour = parseInt(partValues.hour, 10);
    const fmtMinute = parseInt(partValues.minute, 10);
    const fmtSecond = parseInt(partValues.second, 10);

    const intendedMillis = Date.UTC(year, month - 1, day, hour, minute, second);
    const formattedMillisAsIfUTC = Date.UTC(fmtYear, fmtMonth - 1, fmtDay, fmtHour, fmtMinute, fmtSecond);

    const delta = intendedMillis - formattedMillisAsIfUTC;

    const realUtcMillis = utcMillisFromWallClock + delta;

    return new Date(realUtcMillis).toISOString();
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