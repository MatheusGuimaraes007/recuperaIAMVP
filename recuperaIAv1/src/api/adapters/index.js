/**
 * Adapter Factory - Fábrica de Adaptadores
 *
 * Cria e retorna o adapter apropriado baseado nas configurações.
 * Padrão Singleton - mantém uma única instância.
 */
import SupabaseAdapter from "@api/adapters/supabase/Supabaseadapter.js";
import Backendadapter from "@api/adapters/backend/Backendadapter.js";


// Instância singleton
let adapterInstance = null

/**
 * Tipos de adaptadores disponíveis
 */
export const ADAPTER_TYPES = {
    SUPABASE: 'supabase',
    BACKEND: 'backend'
}

/**
 * Retorna o tipo de adapter configurado
 * @returns {string}
 */
export function getAdapterType() {
    return import.meta.env.VITE_API_MODE || ADAPTER_TYPES.SUPABASE
}

/**
 * Cria adapter baseado no tipo
 * @param {string} type - Tipo do adapter
 * @param {Object} config - Configurações
 * @returns {BaseAdapter}
 */
function createAdapter(type, config = {}) {
    switch (type) {
        case ADAPTER_TYPES.SUPABASE:
            return new SupabaseAdapter(config)

        case ADAPTER_TYPES.BACKEND:
            return new Backendadapter(config)

        default:
            throw new Error(`Tipo de adapter desconhecido: ${type}`)
    }
}

/**
 * Retorna instância do adapter (Singleton)
 * @param {Object} options - { type, config, forceNew }
 * @returns {Promise<BaseAdapter>}
 */
export async function getAdapter(options = {}) {
    const {
        type = getAdapterType(),
        config = {},
        forceNew = false
    } = options

    // Se já existe instância e não forçar nova, retorna existente
    if (adapterInstance && !forceNew) {
        return adapterInstance
    }

    // Criar nova instância
    console.log(`🔧 Criando adapter: ${type}`)

    const adapter = createAdapter(type, config)

    // Inicializar
    await adapter.initialize()

    // Salvar instância
    adapterInstance = adapter

    return adapter
}

/**
 * Destrói instância atual do adapter
 */
export function destroyAdapter() {
    if (adapterInstance) {
        console.log('🗑️ Destruindo adapter atual')
        adapterInstance = null
    }
}

/**
 * Verifica se adapter está inicializado
 * @returns {boolean}
 */
export function isAdapterInitialized() {
    return adapterInstance !== null && adapterInstance.isInitialized()
}

/**
 * Retorna adapter atual (se existir)
 * @returns {BaseAdapter|null}
 */
export function getCurrentAdapter() {
    return adapterInstance
}

export default getAdapter