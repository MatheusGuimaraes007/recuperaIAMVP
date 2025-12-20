class StoreCache {
    constructor() {
        // Armazenamento principal do cache (Map é mais performático que Object)
        this.cache = new Map();

        // Metadados de cada cache (timestamps e TTL)
        this.metadata = new Map();

        // Estatísticas de uso
        this.stats = {
            hits: 0,           // Quantas vezes encontrou no cache
            misses: 0,         // Quantas vezes NÃO encontrou
            sets: 0,           // Quantas vezes salvou no cache
            invalidations: 0,  // Quantas vezes invalidou cache
            evictions: 0       // Quantas vezes removeu cache expirado
        };

        // Configurações globais
        this.config = {
            maxSize: 1000,              // Máximo de itens no cache
            defaultTTL: 5 * 60 * 1000,  // TTL padrão: 5 minutos
            cleanupInterval: 60 * 1000, // Limpar expirados a cada 1 minuto
            debug: false                // Logs de debug
        };

        // Iniciar limpeza automática de caches expirados
        this.startAutoCleanup();

        // Log de inicialização
        this.log('StoreCache initialized');
    }

    /**
     * Salva dados no cache
     * @param {string} key - Chave única do cache
     * @param {any} data - Dados a serem cacheados
     * @param {number} ttl - Time to live em milissegundos (opcional)
     * @returns {boolean} - true se salvou com sucesso
     */
    set(key, data, ttl = null) {
        try {
            // Validar entrada
            if (!key || typeof key !== 'string') {
                console.error('StoreCache.set: key deve ser string não vazia');
                return false;
            }

            // Verificar limite de tamanho
            if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
                this.log(`Cache cheio (${this.config.maxSize} itens). Removendo mais antigo...`);
                this.evictOldest();
            }

            // Usar TTL padrão se não fornecido
            const effectiveTTL = ttl ?? this.config.defaultTTL;

            // Salvar dados
            this.cache.set(key, data);

            // Salvar metadados
            this.metadata.set(key, {
                createdAt: Date.now(),
                expiresAt: Date.now() + effectiveTTL,
                ttl: effectiveTTL,
                accessCount: 0,
                lastAccessed: Date.now()
            });

            // Atualizar estatísticas
            this.stats.sets++;

            this.log(`Cache SET: ${key} (TTL: ${effectiveTTL}ms)`);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
            return false;
        }
    }

    /**
     * Busca dados do cache
     * @param {string} key - Chave do cache
     * @returns {any|null} - Dados cacheados ou null se não encontrado/expirado
     */
    get(key) {
        try {
            // Verificar se existe
            if (!this.cache.has(key)) {
                this.stats.misses++;
                this.log(`Cache MISS: ${key}`);
                return null;
            }

            // Verificar se expirou
            const meta = this.metadata.get(key);
            if (Date.now() > meta.expiresAt) {
                this.log(`Cache EXPIRED: ${key}`);
                this.delete(key);
                this.stats.misses++;
                this.stats.evictions++;
                return null;
            }

            // Atualizar metadados de acesso
            meta.accessCount++;
            meta.lastAccessed = Date.now();
            this.metadata.set(key, meta);

            // Retornar dados
            const data = this.cache.get(key);
            this.stats.hits++;
            this.log(`Cache HIT: ${key} (acessos: ${meta.accessCount})`);

            return data;
        } catch (error) {
            console.error('Erro ao buscar do cache:', error);
            this.stats.misses++;
            return null;
        }
    }

    /**
     * Remove um item específico do cache
     * @param {string} key - Chave do cache
     * @returns {boolean} - true se removeu com sucesso
     */
    delete(key) {
        const deleted = this.cache.delete(key);
        this.metadata.delete(key);

        if (deleted) {
            this.log(`Cache DELETE: ${key}`);
        }

        return deleted;
    }

    /**
     * Invalida caches que correspondem a um padrão
     * Exemplo: invalidatePattern('agents:user123') remove:
     * - agents:user123:page1
     * - agents:user123:search:joao
     * - agents:user123:filters:active
     *
     * @param {string} pattern - Padrão para buscar (substring)
     * @returns {number} - Quantidade de caches removidos
     */
    invalidatePattern(pattern) {
        let count = 0;

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.delete(key);
                count++;
            }
        }

        if (count > 0) {
            this.stats.invalidations++;
            this.log(`Cache INVALIDATE: ${pattern} (${count} itens removidos)`);
        }

        return count;
    }

    /**
     * Invalida caches usando regex
     * Exemplo: invalidateRegex(/^agents:.*:page\d+$/)
     *
     * @param {RegExp} regex - Expressão regular
     * @returns {number} - Quantidade de caches removidos
     */
    invalidateRegex(regex) {
        let count = 0;

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.delete(key);
                count++;
            }
        }

        if (count > 0) {
            this.stats.invalidations++;
            this.log(`Cache INVALIDATE (regex): ${regex} (${count} itens)`);
        }

        return count;
    }

    /**
     * Invalida todos os caches de um namespace
     * @param {string} namespace - Nome do namespace (ex: 'agents', 'opportunities')
     * @returns {number} - Quantidade de caches removidos
     */
    invalidateNamespace(namespace) {
        return this.invalidatePattern(`${namespace}:`);
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        this.metadata.clear();
        this.log(`Cache CLEAR ALL (${size} itens removidos)`);
    }

    /**
     * Remove caches expirados
     * @returns {number} - Quantidade de itens removidos
     */
    cleanup() {
        let count = 0;
        const now = Date.now();

        for (const [key, meta] of this.metadata.entries()) {
            if (now > meta.expiresAt) {
                this.delete(key);
                count++;
                this.stats.evictions++;
            }
        }

        if (count > 0) {
            this.log(`Cache CLEANUP: ${count} itens expirados removidos`);
        }

        return count;
    }

    /**
     * Remove o item mais antigo do cache (LRU - Least Recently Used)
     */
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Infinity;

        for (const [key, meta] of this.metadata.entries()) {
            if (meta.lastAccessed < oldestTime) {
                oldestTime = meta.lastAccessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.delete(oldestKey);
            this.stats.evictions++;
            this.log(`Cache EVICT (LRU): ${oldestKey}`);
        }
    }

    /**
     * Inicia limpeza automática periódica
     */
    startAutoCleanup() {
        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);

        this.log('Auto cleanup iniciado');
    }

    /**
     * Para a limpeza automática
     */
    stopAutoCleanup() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
            this.log('Auto cleanup parado');
        }
    }

    /**
     * Retorna estatísticas de uso do cache
     * @returns {Object} - Objeto com estatísticas
     */
    getStats() {
        const totalRequests = this.stats.hits + this.stats.misses;
        const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
        const missRate = totalRequests > 0 ? (this.stats.misses / totalRequests) * 100 : 0;

        return {
            // Contadores
            hits: this.stats.hits,
            misses: this.stats.misses,
            sets: this.stats.sets,
            invalidations: this.stats.invalidations,
            evictions: this.stats.evictions,

            // Taxas
            hitRate: hitRate.toFixed(2) + '%',
            missRate: missRate.toFixed(2) + '%',

            // Estado atual
            size: this.cache.size,
            maxSize: this.config.maxSize,
            utilizationRate: ((this.cache.size / this.config.maxSize) * 100).toFixed(2) + '%',

            // Memória (estimativa)
            estimatedSizeKB: this.estimateSize()
        };
    }

    /**
     * Retorna lista de todas as chaves no cache
     * @returns {Array} - Array com todas as chaves
     */
    getKeys() {
        return Array.from(this.cache.keys());
    }

    /**
     * Retorna detalhes de um cache específico
     * @param {string} key - Chave do cache
     * @returns {Object|null} - Metadados ou null
     */
    getMetadata(key) {
        const meta = this.metadata.get(key);
        if (!meta) return null;

        const now = Date.now();
        return {
            key,
            createdAt: new Date(meta.createdAt).toISOString(),
            expiresAt: new Date(meta.expiresAt).toISOString(),
            ttl: meta.ttl,
            age: now - meta.createdAt,
            remainingTTL: Math.max(0, meta.expiresAt - now),
            accessCount: meta.accessCount,
            lastAccessed: new Date(meta.lastAccessed).toISOString(),
            isExpired: now > meta.expiresAt
        };
    }

    /**
     * Lista todos os caches por namespace
     * @returns {Object} - Objeto agrupado por namespace
     */
    getByNamespace() {
        const grouped = {};

        for (const key of this.cache.keys()) {
            const namespace = key.split(':')[0];
            if (!grouped[namespace]) {
                grouped[namespace] = [];
            }
            grouped[namespace].push(key);
        }

        return grouped;
    }

    /**
     * Estima tamanho do cache em memória (aproximado)
     * @returns {string} - Tamanho estimado em KB
     */
    estimateSize() {
        let totalSize = 0;

        for (const data of this.cache.values()) {
            // Estimativa simples: JSON.stringify
            try {
                totalSize += JSON.stringify(data).length;
            } catch (e) {
                // Ignorar dados que não podem ser serializados
            }
        }

        return (totalSize / 1024).toFixed(2) + ' KB';
    }

    /**
     * Atualiza configurações do cache
     * @param {Object} newConfig - Novas configurações
     */
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Configurações atualizadas:', this.config);

        // Reiniciar cleanup se intervalo mudou
        if (newConfig.cleanupInterval) {
            this.stopAutoCleanup();
            this.startAutoCleanup();
        }
    }

    /**
     * Habilita/desabilita modo debug
     * @param {boolean} enabled - true para habilitar
     */
    setDebug(enabled) {
        this.config.debug = enabled;
        this.log(`Debug ${enabled ? 'habilitado' : 'desabilitado'}`);
    }

    /**
     * Log interno (só exibe se debug habilitado)
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[StoreCache]', ...args);
        }
    }

    /**
     * Reseta estatísticas
     */
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            invalidations: 0,
            evictions: 0
        };
        this.log('Estatísticas resetadas');
    }

    /**
     * Exporta estado do cache (para debug/backup)
     * @returns {Object} - Estado completo do cache
     */
    export() {
        const data = {};
        for (const [key, value] of this.cache.entries()) {
            data[key] = {
                data: value,
                metadata: this.metadata.get(key)
            };
        }
        return {
            cache: data,
            stats: this.stats,
            config: this.config,
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Importa estado do cache (para restore)
     * @param {Object} state - Estado exportado
     */
    import(state) {
        this.clear();

        for (const [key, item] of Object.entries(state.cache)) {
            this.cache.set(key, item.data);
            this.metadata.set(key, item.metadata);
        }

        this.stats = state.stats || this.stats;
        this.log(`Cache importado: ${Object.keys(state.cache).length} itens`);
    }
}

// ============================================================
// INSTÂNCIA SINGLETON
// ============================================================

export const storeCache = new StoreCache();

// Expor no window para debug (apenas em desenvolvimento)
if (import.meta.env.DEV) {
    window.__storeCache = storeCache;
    console.log('🔍 StoreCache disponível em window.__storeCache para debug');
    console.log('Comandos úteis:');
    console.log('  window.__storeCache.getStats() - Ver estatísticas');
    console.log('  window.__storeCache.getKeys() - Listar todas as chaves');
    console.log('  window.__storeCache.setDebug(true) - Habilitar logs');
    console.log('  window.__storeCache.clear() - Limpar todo cache');
}

// ============================================================
// HELPERS PARA CRIAR CHAVES DE CACHE
// ============================================================

/**
 * Helper para criar chave de cache consistente
 * @param {string} namespace - Nome do store (ex: 'agents', 'opportunities')
 * @param {string} userId - ID do usuário
 * @param {Object} params - Parâmetros da query
 * @returns {string} - Chave formatada
 */
export function createCacheKey(namespace, userId, params = {}) {
    // Ordenar params para garantir consistência
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    return `${namespace}:${userId}${sortedParams ? ':' + sortedParams : ''}`;
}

/**
 * Helper para criar padrão de invalidação
 * @param {string} namespace - Nome do store
 * @param {string} userId - ID do usuário (opcional)
 * @returns {string} - Padrão para invalidar
 */
export function createInvalidationPattern(namespace, userId = null) {
    return userId ? `${namespace}:${userId}` : `${namespace}:`;
}

// ============================================================
// PRESETS DE TTL COMUNS
// ============================================================

export const CacheTTL = {
    SHORT: 2 * 60 * 1000,      // 2 minutos
    MEDIUM: 5 * 60 * 1000,     // 5 minutos
    LONG: 15 * 60 * 1000,      // 15 minutos
    HOUR: 60 * 60 * 1000,      // 1 hora
    DAY: 24 * 60 * 60 * 1000   // 24 horas
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default storeCache;