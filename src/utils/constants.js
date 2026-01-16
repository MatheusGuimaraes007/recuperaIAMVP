/**
 * Status de oportunidades
 */
export const OPPORTUNITY_STATUS = {
    ALL: 'all',
    ACTIVE: 'active',
    WON: 'won',
    LOST: 'lost',
    PAUSED: 'paused',
    RECOVERED: 'recovered'
};

/**
 * Opções de status com labels
 */
export const STATUS_OPTIONS = [
    { value: OPPORTUNITY_STATUS.ALL, label: 'Todos os status', count: 0 },
    { value: OPPORTUNITY_STATUS.ACTIVE, label: 'Ativo', count: 0, color: 'blue' },
    { value: OPPORTUNITY_STATUS.WON, label: 'Ganho', count: 0, color: 'green' },
    { value: OPPORTUNITY_STATUS.LOST, label: 'Perdido', count: 0, color: 'red' },
    { value: OPPORTUNITY_STATUS.RECOVERED, label: 'Recuperado', count: 0, color: 'primary' },
    { value: OPPORTUNITY_STATUS.PAUSED, label: 'Pausada', count: 0, color: 'yellow' }
];

/**
 * Tipos de oportunidade
 * ✅ CORRIGIDO: Baseado nos dados reais do banco
 */
export const OPPORTUNITY_TYPES = {
    BOLETO: 'boleto_emitido',
    PIX: 'pix_emitido',
    CART: 'abandono_de_carrinho',
    REFUSED_CARD: 'cartao_recusado'
};

/**
 * Labels de tipos de oportunidade
 * ✅ CORRIGIDO: Mapeamento completo
 */
export const OPPORTUNITY_TYPE_LABELS = {
    'boleto_emitido': 'Boleto emitido',
    'pix_emitido': 'PIX emitido',
    'abandono_de_carrinho': 'Abandono de carrinho',
    'cartao_recusado': 'Cartão recusado',
    // Fallbacks para valores antigos (se existirem)
    'boleto': 'Boleto',
    'pix': 'PIX',
    'carrinho': 'Carrinho'
};

/**
 * Motivos de perda
 */
export const LOST_REASONS = {
    PRICE: 'price',
    NO_RESPONSE: 'no_response',
    COMPETITOR: 'competitor',
    NOT_INTERESTED: 'not_interested',
    OTHER: 'other'
};

/**
 * Labels de motivos de perda
 */
export const LOST_REASON_LABELS = {
    [LOST_REASONS.PRICE]: 'Preço',
    [LOST_REASONS.NO_RESPONSE]: 'Sem resposta',
    [LOST_REASONS.COMPETITOR]: 'Concorrente',
    [LOST_REASONS.NOT_INTERESTED]: 'Não interessado',
    [LOST_REASONS.OTHER]: 'Outros'
};

/**
 * Cores de status
 */
export const STATUS_COLORS = {
    [OPPORTUNITY_STATUS.ACTIVE]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [OPPORTUNITY_STATUS.WON]: 'bg-green-500/10 text-green-400 border-green-500/20',
    [OPPORTUNITY_STATUS.LOST]: 'bg-red-500/10 text-red-400 border-red-500/20',
    [OPPORTUNITY_STATUS.RECOVERED]: 'bg-primary/10 text-primary border-primary/20',
    [OPPORTUNITY_STATUS.PAUSED]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
};

/**
 * Paginação
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    ITEMS_PER_PAGE: 25,
    PAGE_RANGE: 2
};

/**
 * Roles de usuário
 */
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

/**
 * Status de usuário
 */
export const USER_STATUS = {
    TRIAL: 'trial',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    CANCELLED: 'cancelled'
};