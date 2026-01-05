import { toast } from 'vue-sonner'

export function useToast() {
    /**
     * Show success toast
     * @param {string} message - Message to display
     * @param {object} options - Additional options
     */
    const success = (message, options = {}) => {
        return toast.success(message, {
            duration: 4000,
            ...options
        })
    }

    /**
     * Show error toast
     * @param {string} message - Error message
     * @param {object} options - Additional options
     */
    const error = (message, options = {}) => {
        return toast.error(message, {
            duration: 5000,
            ...options
        })
    }

    /**
     * Show warning toast
     * @param {string} message - Warning message
     * @param {object} options - Additional options
     */
    const warning = (message, options = {}) => {
        return toast.warning(message, {
            duration: 4000,
            ...options
        })
    }

    /**
     * Show info toast
     * @param {string} message - Info message
     * @param {object} options - Additional options
     */
    const info = (message, options = {}) => {
        return toast.info(message, {
            duration: 4000,
            ...options
        })
    }

    /**
     * Show loading toast
     * @param {string} message - Loading message
     * @param {object} options - Additional options
     * @returns {string|number} Toast ID for later dismissal
     */
    const loading = (message, options = {}) => {
        return toast.loading(message, options)
    }

    /**
     * Show promise toast (automatic success/error)
     * @param {Promise} promise - Promise to track
     * @param {object} messages - Messages for each state
     */
    const promise = (promise, messages = {}) => {
        return toast.promise(promise, {
            loading: messages.loading || 'Processando...',
            success: messages.success || 'Concluído!',
            error: messages.error || 'Erro ao processar',
            ...messages.options
        })
    }

    /**
     * Custom toast with full control
     * @param {string} message - Message to display
     * @param {object} options - All toast options
     */
    const custom = (message, options = {}) => {
        return toast(message, options)
    }

    /**
     * Dismiss specific toast or all toasts
     * @param {string|number} toastId - Optional toast ID to dismiss specific toast
     */
    const dismiss = (toastId) => {
        if (toastId) {
            toast.dismiss(toastId)
        } else {
            toast.dismiss()
        }
    }

    return {
        success,
        error,
        warning,
        info,
        loading,
        promise,
        custom,
        dismiss
    }
}
