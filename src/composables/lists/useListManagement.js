import { ref, computed, onMounted } from 'vue'

/**
 * Composable genérico para gerenciamento de listas com paginação, busca e filtros
 * ✅ Compatível com Pinia Stores que retornam { success, data, count/total }
 *
 * @param {Object} options
 * @param {Function} options.fetchFn - Função para buscar os dados
 * @param {Number} options.itemsPerPage - Itens por página (padrão: 10)
 * @param {Object} options.initialFilters - Filtros iniciais
 * @param {Boolean} options.autoLoad - Carregar automaticamente ao montar (padrão: true)
 */
export function useListManagement(options = {}) {
    const {
        fetchFn,
        itemsPerPage = 10,
        initialFilters = {},
        autoLoad = true
    } = options

    // State
    const items = ref([])
    const loading = ref(false)
    const error = ref(null)
    const totalCount = ref(0)
    const currentPage = ref(1)
    const searchTerm = ref('')
    const filters = ref({ ...initialFilters })

    // Computed
    const totalPages = computed(() => {
        return Math.ceil(totalCount.value / itemsPerPage)
    })

    const isEmpty = computed(() => {
        return !loading.value && items.value.length === 0
    })

    const hasItems = computed(() => {
        return items.value.length > 0
    })

    /**
     * Carrega os itens com os filtros atuais
     */
    const loadItems = async () => {
        if (!fetchFn) {
            console.error('useListManagement: fetchFn não foi fornecida')
            return
        }

        loading.value = true
        error.value = null

        try {
            const params = {
                page: currentPage.value,
                limit: itemsPerPage,
                ...filters.value
            }

            // Adiciona busca se existir
            if (searchTerm.value && searchTerm.value.trim() !== '') {
                params.search = searchTerm.value.trim()
            }

            const result = await fetchFn(params)

            if (result.success) {
                items.value = result.data || []
                totalCount.value = result.total || result.count || result.data?.length || 0
            } else {
                error.value = result.error || 'Erro ao carregar dados'
                items.value = []
                totalCount.value = 0
            }
        } catch (err) {
            console.error('Erro ao carregar itens:', err)
            error.value = err.message || 'Erro desconhecido'
            items.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    /**
     * Busca com debounce
     */
    const handleSearch = (term) => {
        searchTerm.value = term
        currentPage.value = 1
        loadItems()
    }

    /**
     * Muda de página
     */
    const handlePageChange = (page) => {
        currentPage.value = page
        loadItems()
    }

    /**
     * Atualiza filtros
     */
    const updateFilters = (newFilters) => {
        filters.value = { ...filters.value, ...newFilters }
        currentPage.value = 1 // Volta para primeira página ao filtrar
        loadItems()
    }

    /**
     * Limpa todos os filtros e busca
     */
    const clearFilters = () => {
        searchTerm.value = ''
        filters.value = { ...initialFilters }
        currentPage.value = 1
        loadItems()
    }

    /**
     * Refresh/reload dos dados
     */
    const refresh = () => {
        loadItems()
    }

    /**
     * Limpa os itens
     */
    const clear = () => {
        items.value = []
        totalCount.value = 0
        currentPage.value = 1
        searchTerm.value = ''
        filters.value = { ...initialFilters }
    }

    if (autoLoad) {
        onMounted(() => {
            loadItems()
        })
    }

    return {
        items,
        loading,
        error,
        totalCount,
        currentPage,
        searchTerm,
        filters,

        totalPages,
        isEmpty,
        hasItems,
        itemsPerPage,

        loadItems,
        handleSearch,
        handlePageChange,
        updateFilters,
        clearFilters,
        refresh,
        clear
    }
}