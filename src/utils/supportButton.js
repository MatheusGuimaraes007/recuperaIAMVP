/**
 * Configurações de Suporte da Plataforma
 *
 * Centralize aqui todas as informações de contato de suporte
 * para facilitar manutenção e atualização
 */
export const SUPPORT_WHATSAPP = '5511999999999'; // ⚠️ SUBSTITUA PELO NÚMERO REAL

/**
 * Mensagens pré-definidas para diferentes situações
 */
export const SUPPORT_MESSAGES = {
    default: 'Olá! Preciso de ajuda com a plataforma Recupera.ia',

    technical: 'Olá! Estou com um problema técnico na plataforma Recupera.ia',

    billing: 'Olá! Tenho uma dúvida sobre cobrança/faturamento',

    features: 'Olá! Gostaria de saber mais sobre as funcionalidades da plataforma',

    general: 'Olá! Preciso de ajuda com a Recupera.ia',

    opportunities: 'Olá! Preciso de ajuda com as oportunidades de venda',
    dashboard: 'Olá! Tenho dúvidas sobre o dashboard e métricas',
    agents: 'Olá! Preciso de ajuda para configurar meu agente',
    integrations: 'Olá! Tenho dúvidas sobre integrações',
    guarantee: 'Olá! Tenho dúvidas sobre a garantia Risco Zero',
};

/**
 * Horários de atendimento do suporte
 */
export const SUPPORT_HOURS = {
    weekdays: {
        start: '09:00',
        end: '18:00',
        timezone: 'America/Sao_Paulo'
    },
    weekend: {
        available: false,
        message: 'Atendimento disponível de segunda a sexta'
    }
};

/**
 * Verifica se o suporte está online agora
 * @returns {boolean}
 */
export const isSupportOnline = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 6 = sábado
    const hours = now.getHours();

    if (day === 0 || day === 6) {
        return SUPPORT_HOURS.weekend.available;
    }

    const startHour = parseInt(SUPPORT_HOURS.weekdays.start.split(':')[0]);
    const endHour = parseInt(SUPPORT_HOURS.weekdays.end.split(':')[0]);

    return hours >= startHour && hours < endHour;
};

/**
 * Gera URL do WhatsApp com mensagem pré-preenchida
 * @param {string} message - Mensagem a ser enviada
 * @returns {string} URL do WhatsApp
 */
export const getWhatsAppUrl = (message = SUPPORT_MESSAGES.default) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodedMessage}`;
};

/**
 * Abre o WhatsApp em nova aba
 * @param {string} message - Mensagem a ser enviada
 */
export const openWhatsApp = (message = SUPPORT_MESSAGES.default) => {
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
};

/**
 * Informações de contato alternativas
 */
export const SUPPORT_CONTACTS = {
    email: 'suporte@recupera.ia',
    phone: '+55 11 99999-9999',
    website: 'https://recupera.ia/suporte'
};

/**
 * Links úteis para documentação
 */
export const SUPPORT_LINKS = {
    faq: 'https://recupera.ia/faq',
    docs: 'https://docs.recupera.ia',
    video: 'https://www.youtube.com/@recupera-ia',
    status: 'https://status.recupera.ia'
};