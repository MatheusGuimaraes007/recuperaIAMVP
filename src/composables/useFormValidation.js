/**
 * Composable para validação de formulários
 * Centraliza todas as regras de validação do sistema
 */

export function useFormValidation() {
    /**
     * Valida campo obrigatório
     */
    const validateRequired = (value, fieldName) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return `${fieldName} é obrigatório`
        }
        return null
    }

    /**
     * Valida email
     */
    const validateEmail = (email) => {
        if (!email) return null

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regex.test(email)) {
            return 'Email inválido'
        }
        return null
    }

    /**
     * Valida comprimento mínimo
     */
    const validateMinLength = (value, min, fieldName) => {
        if (!value) return null

        if (value.length < min) {
            return `${fieldName} deve ter no mínimo ${min} caracteres`
        }
        return null
    }

    /**
     * Valida comprimento máximo
     */
    const validateMaxLength = (value, max, fieldName) => {
        if (!value) return null

        if (value.length > max) {
            return `${fieldName} deve ter no máximo ${max} caracteres`
        }
        return null
    }

    /**
     * Valida se dois campos são iguais (para confirmação)
     */
    const validateMatch = (value1, value2, fieldName) => {
        if (value1 !== value2) {
            return `${fieldName} não conferem`
        }
        return null
    }

    /**
     * Valida telefone brasileiro
     * Formatos aceitos: 11912345678, (11) 91234-5678, 11 91234-5678
     */
    const validatePhone = (phone) => {
        if (!phone) return null

        // Remove todos os caracteres não numéricos
        const cleaned = phone.replace(/\D/g, '')

        // Valida: DDD (2 dígitos) + 9 (celular) + 8 dígitos = 11 dígitos
        // Ou: DDD (2 dígitos) + 8 dígitos (fixo) = 10 dígitos
        if (cleaned.length !== 10 && cleaned.length !== 11) {
            return 'Telefone inválido (ex: 11912345678)'
        }

        return null
    }

    /**
     * Valida senha
     */
    const validatePassword = (password, minLength = 6) => {
        if (!password) return null

        if (password.length < minLength) {
            return `Senha deve ter no mínimo ${minLength} caracteres`
        }

        return null
    }

    /**
     * Valida senha forte (opcional - para casos específicos)
     */
    const validateStrongPassword = (password) => {
        if (!password) return null

        const errors = []

        if (password.length < 8) {
            errors.push('no mínimo 8 caracteres')
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('uma letra maiúscula')
        }

        if (!/[a-z]/.test(password)) {
            errors.push('uma letra minúscula')
        }

        if (!/[0-9]/.test(password)) {
            errors.push('um número')
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('um caractere especial')
        }

        if (errors.length > 0) {
            return `Senha deve ter ${errors.join(', ')}`
        }

        return null
    }

    /**
     * Valida CPF
     */
    const validateCPF = (cpf) => {
        if (!cpf) return null

        // Remove caracteres não numéricos
        const cleaned = cpf.replace(/\D/g, '')

        // Verifica se tem 11 dígitos
        if (cleaned.length !== 11) {
            return 'CPF deve ter 11 dígitos'
        }

        // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
        if (/^(\d)\1{10}$/.test(cleaned)) {
            return 'CPF inválido'
        }

        // Validação dos dígitos verificadores
        let sum = 0
        let remainder

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
        }

        remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== parseInt(cleaned.substring(9, 10))) {
            return 'CPF inválido'
        }

        sum = 0
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
        }

        remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== parseInt(cleaned.substring(10, 11))) {
            return 'CPF inválido'
        }

        return null
    }

    /**
     * Valida CNPJ
     */
    const validateCNPJ = (cnpj) => {
        if (!cnpj) return null

        // Remove caracteres não numéricos
        const cleaned = cnpj.replace(/\D/g, '')

        // Verifica se tem 14 dígitos
        if (cleaned.length !== 14) {
            return 'CNPJ deve ter 14 dígitos'
        }

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{13}$/.test(cleaned)) {
            return 'CNPJ inválido'
        }

        // Validação dos dígitos verificadores
        let length = cleaned.length - 2
        let numbers = cleaned.substring(0, length)
        const digits = cleaned.substring(length)
        let sum = 0
        let pos = length - 7

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--
            if (pos < 2) pos = 9
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
        if (result !== parseInt(digits.charAt(0))) {
            return 'CNPJ inválido'
        }

        length = length + 1
        numbers = cleaned.substring(0, length)
        sum = 0
        pos = length - 7

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--
            if (pos < 2) pos = 9
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
        if (result !== parseInt(digits.charAt(1))) {
            return 'CNPJ inválido'
        }

        return null
    }

    /**
     * Valida URL
     */
    const validateURL = (url) => {
        if (!url) return null

        try {
            new URL(url)
            return null
        } catch {
            return 'URL inválida'
        }
    }

    /**
     * Valida número
     */
    const validateNumber = (value, fieldName = 'Campo') => {
        if (!value) return null

        if (isNaN(value)) {
            return `${fieldName} deve ser um número`
        }

        return null
    }

    /**
     * Valida número inteiro
     */
    const validateInteger = (value, fieldName = 'Campo') => {
        if (!value) return null

        if (!Number.isInteger(Number(value))) {
            return `${fieldName} deve ser um número inteiro`
        }

        return null
    }

    /**
     * Valida range de números
     */
    const validateRange = (value, min, max, fieldName = 'Campo') => {
        if (!value) return null

        const num = Number(value)
        if (num < min || num > max) {
            return `${fieldName} deve estar entre ${min} e ${max}`
        }

        return null
    }

    /**
     * Valida data (formato YYYY-MM-DD)
     */
    const validateDate = (date) => {
        if (!date) return null

        const regex = /^\d{4}-\d{2}-\d{2}$/
        if (!regex.test(date)) {
            return 'Data inválida (formato: YYYY-MM-DD)'
        }

        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) {
            return 'Data inválida'
        }

        return null
    }

    /**
     * Valida se data é futura
     */
    const validateFutureDate = (date) => {
        if (!date) return null

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dateObj = new Date(date)
        if (dateObj <= today) {
            return 'Data deve ser futura'
        }

        return null
    }

    /**
     * Valida se data é passada
     */
    const validatePastDate = (date) => {
        if (!date) return null

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dateObj = new Date(date)
        if (dateObj >= today) {
            return 'Data deve ser passada'
        }

        return null
    }

    /**
     * Valida formulário completo
     * Recebe objeto com campos e suas regras de validação
     */
    const validateForm = (formData, rules) => {
        const errors = {}

        Object.keys(rules).forEach(field => {
            const fieldRules = rules[field]
            const value = formData[field]

            for (const rule of fieldRules) {
                const error = rule(value)
                if (error) {
                    errors[field] = error
                    break // Para na primeira regra que falhar
                }
            }
        })

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        }
    }

    return {
        validateRequired,
        validateEmail,
        validateMinLength,
        validateMaxLength,
        validateMatch,
        validatePhone,
        validatePassword,
        validateStrongPassword,

        validateCPF,
        validateCNPJ,

        validateURL,
        validateNumber,
        validateInteger,
        validateRange,
        validateDate,
        validateFutureDate,
        validatePastDate,

        validateForm
    }
}