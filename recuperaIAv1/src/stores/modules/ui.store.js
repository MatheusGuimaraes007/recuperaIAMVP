/**
 * UI Store - Pinia v3.0
 *
 * Gerencia estado global de UI: sidebar, modais, toasts, tema, etc.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
    // ============================================================================
    // STATE
    // ============================================================================

    // Sidebar
    const sidebarOpen = ref(true)
    const sidebarCollapsed = ref(false)

    // Modais
    const activeModal = ref(null)
    const modalProps = ref({})
    const modalStack = ref([])

    // Drawers
    const activeDrawer = ref(null)
    const drawerProps = ref({})

    // Theme
    const theme = ref('light') // 'light' | 'dark'

    // Loading global
    const globalLoading = ref(false)
    const loadingMessage = ref('')

    // Breadcrumbs
    const breadcrumbs = ref([])

    // Page title
    const pageTitle = ref('')

    // Mobile
    const isMobileMenuOpen = ref(false)

    // ============================================================================
    // GETTERS (Computed)
    // ============================================================================

    const isDarkMode = computed(() => theme.value === 'dark')

    const hasActiveModal = computed(() => !!activeModal.value)

    const hasActiveDrawer = computed(() => !!activeDrawer.value)

    // ============================================================================
    // SIDEBAR ACTIONS
    // ============================================================================

    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value
    }

    const openSidebar = () => {
        sidebarOpen.value = true
    }

    const closeSidebar = () => {
        sidebarOpen.value = false
    }

    const toggleSidebarCollapse = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // ============================================================================
    // MODAL ACTIONS
    // ============================================================================

    /**
     * Abrir modal
     * @param {string} modalName - Nome do componente do modal
     * @param {object} props - Props para passar ao modal
     */
    const openModal = (modalName, props = {}) => {
        // Adicionar ao stack
        if (activeModal.value) {
            modalStack.value.push({
                name: activeModal.value,
                props: modalProps.value
            })
        }

        activeModal.value = modalName
        modalProps.value = props
    }

    /**
     * Fechar modal atual
     */
    const closeModal = () => {
        // Restaurar modal anterior do stack
        if (modalStack.value.length > 0) {
            const previous = modalStack.value.pop()
            activeModal.value = previous.name
            modalProps.value = previous.props
        } else {
            activeModal.value = null
            modalProps.value = {}
        }
    }

    /**
     * Fechar todos os modais
     */
    const closeAllModals = () => {
        activeModal.value = null
        modalProps.value = {}
        modalStack.value = []
    }

    // ============================================================================
    // DRAWER ACTIONS
    // ============================================================================

    /**
     * Abrir drawer
     */
    const openDrawer = (drawerName, props = {}) => {
        activeDrawer.value = drawerName
        drawerProps.value = props
    }

    /**
     * Fechar drawer
     */
    const closeDrawer = () => {
        activeDrawer.value = null
        drawerProps.value = {}
    }

    // ============================================================================
    // THEME ACTIONS
    // ============================================================================

    const setTheme = (newTheme) => {
        theme.value = newTheme

        // Atualizar HTML class
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        // Salvar preferência
        localStorage.setItem('theme', newTheme)
    }

    const toggleTheme = () => {
        const newTheme = theme.value === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    const initTheme = () => {
        // Carregar do localStorage ou usar preferência do sistema
        const savedTheme = localStorage.getItem('theme')

        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }

    // ============================================================================
    // LOADING ACTIONS
    // ============================================================================

    const showLoading = (message = 'Carregando...') => {
        globalLoading.value = true
        loadingMessage.value = message
    }

    const hideLoading = () => {
        globalLoading.value = false
        loadingMessage.value = ''
    }

    // ============================================================================
    // BREADCRUMB ACTIONS
    // ============================================================================

    const setBreadcrumbs = (items) => {
        breadcrumbs.value = items
    }

    const addBreadcrumb = (item) => {
        breadcrumbs.value.push(item)
    }

    const clearBreadcrumbs = () => {
        breadcrumbs.value = []
    }

    // ============================================================================
    // PAGE TITLE ACTIONS
    // ============================================================================

    const setPageTitle = (title) => {
        pageTitle.value = title
        document.title = title ? `${title} - Recupera.IA` : 'Recupera.IA'
    }

    // ============================================================================
    // MOBILE MENU ACTIONS
    // ============================================================================

    const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const openMobileMenu = () => {
        isMobileMenuOpen.value = true
    }

    const closeMobileMenu = () => {
        isMobileMenuOpen.value = false
    }

    // ============================================================================
    // UTILITY ACTIONS
    // ============================================================================

    /**
     * Resetar todo estado de UI
     */
    const resetUI = () => {
        closeAllModals()
        closeDrawer()
        closeMobileMenu()
        clearBreadcrumbs()
        hideLoading()
    }

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        // State
        sidebarOpen,
        sidebarCollapsed,
        activeModal,
        modalProps,
        modalStack,
        activeDrawer,
        drawerProps,
        theme,
        globalLoading,
        loadingMessage,
        breadcrumbs,
        pageTitle,
        isMobileMenuOpen,

        // Getters
        isDarkMode,
        hasActiveModal,
        hasActiveDrawer,

        // Sidebar Actions
        toggleSidebar,
        openSidebar,
        closeSidebar,
        toggleSidebarCollapse,

        // Modal Actions
        openModal,
        closeModal,
        closeAllModals,

        // Drawer Actions
        openDrawer,
        closeDrawer,

        // Theme Actions
        setTheme,
        toggleTheme,
        initTheme,

        // Loading Actions
        showLoading,
        hideLoading,

        // Breadcrumb Actions
        setBreadcrumbs,
        addBreadcrumb,
        clearBreadcrumbs,

        // Page Title Actions
        setPageTitle,

        // Mobile Menu Actions
        toggleMobileMenu,
        openMobileMenu,
        closeMobileMenu,

        // Utility Actions
        resetUI
    }
}, {
    persist: {
        paths: ['sidebarOpen', 'sidebarCollapsed', 'theme']
    }
})