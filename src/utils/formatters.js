export const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatDate = (date, showTime = false) => {
    if (!date) return '-';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return '-';
    
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(showTime && {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    return dateObj.toLocaleString('pt-BR', options);
};


export const formatDateShort = (date) => {
    if (!date) return '-';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};


export const formatPhone = (phone) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 13 && cleaned.startsWith('55')) {
        const ddd = cleaned.slice(2, 4);
        const part1 = cleaned.slice(4, 9);
        const part2 = cleaned.slice(9);
        return `(${ddd}) ${part1}-${part2}`;
    }

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
};


export const cleanPhone = (phone) => {
    return phone.replace(/\D/g, '');
};


export const formatDocument = (doc) => {
    if (!doc) return '-';
    const cleaned = doc.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return doc;
};

export const formatTimeFromMinutes = (minutes) => {
    if (!minutes || minutes < 0) return '0min';
    
    if (minutes < 60) {
        return `${minutes}min`;
    }
    
    if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    

    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    
    let result = `${days}d`;
    if (hours > 0) result += ` ${hours}h`;
    
    return result;
};


export const formatNumber = (number) => {
    if (!number) return '0';
    return new Intl.NumberFormat('pt-BR').format(number);
};

export const formatPercentage = (value, decimals = 1) => {
    if (!value) return '0%';
    return `${parseFloat(value).toFixed(decimals)}%`;
};