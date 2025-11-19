export const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
};

export const validateCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
        return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
};

export const validateCNPJ = (cnpj) => {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) {
        return false;
    }

    let length = cleaned.length - 2;
    let numbers = cleaned.substring(0, length);
    const digits = cleaned.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length = length + 1;
    numbers = cleaned.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
};

export const validateRequired = (value, fieldName = 'Campo') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} é obrigatório`;
    }
    return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Campo') => {
    if (value && value.length < minLength) {
        return `${fieldName} deve ter no mínimo ${minLength} caracteres`;
    }
    return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Campo') => {
    if (value && value.length > maxLength) {
        return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
    }
    return null;
};