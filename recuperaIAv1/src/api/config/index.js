/**
 * API Configuration
 *
 * Configurações centralizadas da API
 */

/**
 * Modo da API (qual adapter usar)
 */
export const API_MODE = import.meta.env.VITE_API_MODE || 'supabase'

/**
 * Configuração Supabase
 */
export const SUPABASE_CONFIG = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
}

/**
 * Configuração Backend
 */
export const BACKEND_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    headers: {
        'Content-Type': 'application/json'
    }
}

/**
 * Nomes das tabelas/recursos
 */
export const RESOURCES = {
    CLIENTS: 'clients',
    OPPORTUNITIES: 'opportunities',
    AGENTS: 'agents',
    PRODUCTS: 'products',
    INTERACTIONS: 'interactions',
    TASKS: 'tasks',
    DOCUMENTS: 'documents',
    USERS: 'users'
}

/**
 * Nomes dos buckets de storage
 */
export const STORAGE_BUCKETS = {
    AVATARS: 'avatars',
    DOCUMENTS: 'documents',
    ATTACHMENTS: 'attachments'
}

/**
 * Configurações de paginação
 */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
}

/**
 * Configurações de cache
 */
export const CACHE = {
    ENABLED: import.meta.env.VITE_CACHE_ENABLED === 'true',
    TTL: parseInt(import.meta.env.VITE_CACHE_TTL || '300000') // 5 minutos
}

/**
 * Valida configurações
 */
export function validateConfig() {
    if (API_MODE === 'supabase') {
        if (!SUPABASE_CONFIG.url) {
            throw new Error('VITE_SUPABASE_URL não configurado')
        }
        if (!SUPABASE_CONFIG.anonKey) {
            throw new Error('VITE_SUPABASE_ANON_KEY não configurado')
        }
    }

    if (API_MODE === 'backend') {
        if (!BACKEND_CONFIG.baseURL) {
            throw new Error('VITE_API_BASE_URL não configurado')
        }
    }
}

/**
 * Retorna configuração do adapter atual
 */
export function getAdapterConfig() {
    if (API_MODE === 'supabase') {
        return {
            url: SUPABASE_CONFIG.url,
            key: SUPABASE_CONFIG.anonKey
        }
    }

    if (API_MODE === 'backend') {
        return {
            baseURL: BACKEND_CONFIG.baseURL,
            timeout: BACKEND_CONFIG.timeout
        }
    }

    throw new Error(`API_MODE desconhecido: ${API_MODE}`)
}

export default {
    API_MODE,
    SUPABASE_CONFIG,
    BACKEND_CONFIG,
    RESOURCES,
    STORAGE_BUCKETS,
    PAGINATION,
    CACHE,
    validateConfig,
    getAdapterConfig
}