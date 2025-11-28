class ErrorHandler {
    constructor() {
        // Histórico de erros (últimos 100)
        this.errorHistory = [];
        this.maxHistorySize = 100;

        // Rate limiting (evitar spam de logs)
        this.errorCounts = new Map();
        this.rateLimitWindow = 60 * 1000; // 1 minuto
        this.maxErrorsPerMinute = 10;

        // Configurações
        this.config = {
            enableSentry: import.meta.env.PROD, // Apenas em produção
            enableConsoleLog: true,
            enableHistory: true,
            debug: import.meta.env.DEV
        };

        this.log('ErrorHandler initialized');
    }

    /**
     * Método principal de tratamento de erros
     * @param {Error} error - Objeto de erro
     * @param {string} context - Contexto onde erro ocorreu (ex: 'fetchAgents')
     * @param {Object} metadata - Metadados adicionais (opcional)
     * @returns {string} - Mensagem amigável para o usuário
     */
    handle(error, context = 'unknown', metadata = {}) {
        try {
            // Verificar rate limit
            if (this.isRateLimited(context)) {
                console.warn(`[ErrorHandler] Rate limit atingido para: ${context}`);
                return 'Ocorreram múltiplos erros. Tente novamente em alguns instantes.';
            }

            // Identificar tipo de erro
            const errorType = this.identifyErrorType(error);

            // Criar estrutura de erro
            const errorInfo = {
                type: errorType,
                code: error.code || 'UNKNOWN',
                message: error.message || 'Erro desconhecido',
                context,
                metadata,
                timestamp: new Date().toISOString(),
                stack: error.stack,
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            // Log no console
            if (this.config.enableConsoleLog) {
                this.logError(errorInfo);
            }

            // Adicionar ao histórico
            if (this.config.enableHistory) {
                this.addToHistory(errorInfo);
            }

            // Enviar para serviço de monitoramento
            if (this.config.enableSentry && errorType !== 'USER_ERROR') {
                this.sendToSentry(errorInfo);
            }

            // Retornar mensagem amigável
            return this.getFriendlyMessage(error, errorType);
        } catch (handlerError) {
            // Erro no próprio handler (não deve acontecer, mas...)
            console.error('[ErrorHandler] Erro ao processar erro:', handlerError);
            return 'Ocorreu um erro inesperado. Tente novamente.';
        }
    }

    /**
     * Identifica o tipo de erro baseado em código e mensagem
     * @param {Error} error - Objeto de erro
     * @returns {string} - Tipo de erro
     */
    identifyErrorType(error) {
        const code = error.code || '';
        const message = error.message?.toLowerCase() || '';

        // Erros de autenticação
        if (code === 'PGRST301' || message.includes('jwt') || message.includes('expired')) {
            return 'AUTH_ERROR';
        }

        // Erros de permissão
        if (code === '42501' || message.includes('permission') || message.includes('denied')) {
            return 'PERMISSION_ERROR';
        }

        // Registro não encontrado
        if (code === 'PGRST116' || message.includes('not found')) {
            return 'NOT_FOUND';
        }

        // Erros de rede
        if (message.includes('failed to fetch') || message.includes('network')) {
            return 'NETWORK_ERROR';
        }

        // Erros de validação
        if (code === '23505') {
            return 'DUPLICATE_ERROR';
        }

        // Erros de integridade referencial
        if (code === '23503') {
            return 'REFERENCE_ERROR';
        }

        // Erro de timeout
        if (message.includes('timeout') || message.includes('timed out')) {
            return 'TIMEOUT_ERROR';
        }

        // Erro de função não encontrada
        if (code === '42883' || message.includes('function') && message.includes('does not exist')) {
            return 'FUNCTION_NOT_FOUND';
        }

        // Erro de tabela não encontrada
        if (code === '42P01' || message.includes('relation') && message.includes('does not exist')) {
            return 'TABLE_NOT_FOUND';
        }

        // Erro de sintaxe SQL
        if (code === '42601') {
            return 'SQL_SYNTAX_ERROR';
        }

        // Cancelamento de requisição
        if (error.name === 'AbortError' || message.includes('aborted')) {
            return 'USER_CANCELLED';
        }

        // Erro genérico de banco
        if (code && code.startsWith('P')) {
            return 'DATABASE_ERROR';
        }

        // Erro desconhecido
        return 'UNKNOWN_ERROR';
    }

    /**
     * Retorna mensagem amigável baseada no tipo de erro
     * @param {Error} error - Objeto de erro
     * @param {string} errorType - Tipo de erro identificado
     * @returns {string} - Mensagem amigável
     */
    getFriendlyMessage(error, errorType) {
        const messages = {
            'AUTH_ERROR': 'Sessão expirada. Por favor, faça login novamente.',
            'PERMISSION_ERROR': 'Você não tem permissão para realizar esta ação.',
            'NOT_FOUND': 'Registro não encontrado.',
            'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet e tente novamente.',
            'DUPLICATE_ERROR': 'Este registro já existe.',
            'REFERENCE_ERROR': 'Não é possível excluir: existem registros relacionados.',
            'TIMEOUT_ERROR': 'A operação demorou muito tempo. Tente novamente.',
            'FUNCTION_NOT_FOUND': 'Erro interno: funcionalidade não disponível. Contate o suporte.',
            'TABLE_NOT_FOUND': 'Erro interno: recurso não encontrado. Contate o suporte.',
            'SQL_SYNTAX_ERROR': 'Erro interno: problema na consulta. Contate o suporte.',
            'DATABASE_ERROR': 'Erro no banco de dados. Tente novamente.',
            'USER_CANCELLED': 'Operação cancelada.',
            'UNKNOWN_ERROR': 'Ocorreu um erro inesperado. Tente novamente.'
        };

        // Mensagens específicas baseadas em código
        if (error.code === '23505' && error.message?.includes('email')) {
            return 'Este email já está cadastrado.';
        }

        if (error.code === '23505' && error.message?.includes('phone')) {
            return 'Este telefone já está cadastrado.';
        }

        // Retornar mensagem padrão do tipo
        return messages[errorType] || messages['UNKNOWN_ERROR'];
    }

    /**
     * Loga erro no console de forma estruturada
     * @param {Object} errorInfo - Informações do erro
     */
    logError(errorInfo) {
        const style = this.getLogStyle(errorInfo.type);

        console.group(`%c🔴 ${errorInfo.type}`, style);
        console.log('%cContexto:', 'font-weight: bold', errorInfo.context);
        console.log('%cMensagem:', 'font-weight: bold', errorInfo.message);
        console.log('%cCódigo:', 'font-weight: bold', errorInfo.code);

        if (Object.keys(errorInfo.metadata).length > 0) {
            console.log('%cMetadata:', 'font-weight: bold', errorInfo.metadata);
        }

        if (this.config.debug && errorInfo.stack) {
            console.log('%cStack:', 'font-weight: bold');
            console.log(errorInfo.stack);
        }

        console.log('%cTimestamp:', 'font-weight: bold', errorInfo.timestamp);
        console.groupEnd();
    }

    /**
     * Retorna estilo CSS para log baseado no tipo
     * @param {string} type - Tipo de erro
     * @returns {string} - String de estilo CSS
     */
    getLogStyle(type) {
        const styles = {
            'AUTH_ERROR': 'color: #f59e0b; font-weight: bold; font-size: 12px',
            'PERMISSION_ERROR': 'color: #ef4444; font-weight: bold; font-size: 12px',
            'NETWORK_ERROR': 'color: #3b82f6; font-weight: bold; font-size: 12px',
            'DATABASE_ERROR': 'color: #8b5cf6; font-weight: bold; font-size: 12px',
            'USER_CANCELLED': 'color: #6b7280; font-weight: bold; font-size: 12px'
        };

        return styles[type] || 'color: #ef4444; font-weight: bold; font-size: 12px';
    }

    /**
     * Adiciona erro ao histórico
     * @param {Object} errorInfo - Informações do erro
     */
    addToHistory(errorInfo) {
        this.errorHistory.unshift(errorInfo);

        // Limitar tamanho do histórico
        if (this.errorHistory.length > this.maxHistorySize) {
            this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Verifica se contexto está em rate limit
     * @param {string} context - Contexto do erro
     * @returns {boolean} - true se está em rate limit
     */
    isRateLimited(context) {
        const now = Date.now();
        const key = context;

        // Obter ou criar entrada
        if (!this.errorCounts.has(key)) {
            this.errorCounts.set(key, { count: 0, windowStart: now });
        }

        const entry = this.errorCounts.get(key);

        // Resetar janela se passou o tempo
        if (now - entry.windowStart > this.rateLimitWindow) {
            entry.count = 0;
            entry.windowStart = now;
        }

        // Incrementar contador
        entry.count++;

        // Verificar limite
        return entry.count > this.maxErrorsPerMinute;
    }

    /**
     * Envia erro para Sentry (ou outro serviço de monitoramento)
     * @param {Object} errorInfo - Informações do erro
     */
    sendToSentry(errorInfo) {
        try {
            // Verificar se Sentry está disponível
            if (typeof window.Sentry === 'undefined') {
                return;
            }

            // Enviar para Sentry
            window.Sentry.captureException(new Error(errorInfo.message), {
                level: this.getSentryLevel(errorInfo.type),
                tags: {
                    context: errorInfo.context,
                    type: errorInfo.type,
                    code: errorInfo.code
                },
                extra: {
                    metadata: errorInfo.metadata,
                    url: errorInfo.url,
                    timestamp: errorInfo.timestamp
                }
            });

            this.log('Erro enviado para Sentry');
        } catch (sentryError) {
            console.warn('[ErrorHandler] Falha ao enviar para Sentry:', sentryError);
        }
    }

    /**
     * Retorna nível de severidade para Sentry
     * @param {string} type - Tipo de erro
     * @returns {string} - Nível do Sentry
     */
    getSentryLevel(type) {
        const levels = {
            'AUTH_ERROR': 'warning',
            'PERMISSION_ERROR': 'warning',
            'NOT_FOUND': 'info',
            'NETWORK_ERROR': 'warning',
            'DATABASE_ERROR': 'error',
            'FUNCTION_NOT_FOUND': 'error',
            'TABLE_NOT_FOUND': 'error',
            'SQL_SYNTAX_ERROR': 'error',
            'USER_CANCELLED': 'info'
        };

        return levels[type] || 'error';
    }

    /**
     * Retorna histórico de erros
     * @param {number} limit - Quantidade máxima de erros
     * @returns {Array} - Array com erros
     */
    getHistory(limit = 50) {
        return this.errorHistory.slice(0, limit);
    }

    /**
     * Retorna estatísticas de erros
     * @returns {Object} - Estatísticas
     */
    getStats() {
        const typeCount = {};
        const contextCount = {};

        for (const error of this.errorHistory) {
            // Contar por tipo
            typeCount[error.type] = (typeCount[error.type] || 0) + 1;

            // Contar por contexto
            contextCount[error.context] = (contextCount[error.context] || 0) + 1;
        }

        return {
            total: this.errorHistory.length,
            byType: typeCount,
            byContext: contextCount,
            mostCommonType: Object.keys(typeCount).sort((a, b) => typeCount[b] - typeCount[a])[0],
            mostCommonContext: Object.keys(contextCount).sort((a, b) => contextCount[b] - contextCount[a])[0]
        };
    }

    /**
     * Limpa histórico de erros
     */
    clearHistory() {
        this.errorHistory = [];
        this.errorCounts.clear();
        this.log('Histórico de erros limpo');
    }

    /**
     * Atualiza configurações
     * @param {Object} newConfig - Novas configurações
     */
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Configurações atualizadas:', this.config);
    }

    /**
     * Log interno
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[ErrorHandler]', ...args);
        }
    }

    /**
     * Exporta histórico de erros (para debug/relatórios)
     * @returns {Object} - Dados exportados
     */
    export() {
        return {
            history: this.errorHistory,
            stats: this.getStats(),
            config: this.config,
            exportedAt: new Date().toISOString()
        };
    }
}

const errorHandler = new ErrorHandler();


/**
 * Trata erros de autenticação (redireciona para login)
 * @param {Error} error - Erro de autenticação
 * @param {Function} router - Router do Vue
 */
export function handleAuthError(error, router) {
    const message = errorHandler.handle(error, 'authentication');

    // Redirecionar para login
    if (router) {
        router.push('/login');
    } else {
        window.location.href = '/login';
    }

    return message;
}

/**
 * Trata erros de validação de formulário
 * @param {Error} error - Erro de validação
 * @returns {Object} - Objeto com erros por campo
 */
export function handleValidationError(error) {
    const message = errorHandler.handle(error, 'validation');

    // Tentar extrair campos específicos do erro
    const fieldErrors = {};

    if (error.message?.includes('email')) {
        fieldErrors.email = 'Email inválido ou já cadastrado';
    }

    if (error.message?.includes('phone')) {
        fieldErrors.phone = 'Telefone inválido ou já cadastrado';
    }

    return {
        message,
        fieldErrors
    };
}

/**
 * Trata erros de rede (com retry)
 * @param {Error} error - Erro de rede
 * @param {Function} retryFn - Função para retry
 * @returns {Object} - Objeto com mensagem e função de retry
 */
export function handleNetworkError(error, retryFn) {
    const message = errorHandler.handle(error, 'network');

    return {
        message,
        retry: retryFn,
        canRetry: true
    };
}


export default errorHandler;