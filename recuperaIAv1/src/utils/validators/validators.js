/**
 * Validators - Funções de validação
 *
 * Utilitários para validação de dados comuns.
 */

export const validateCPF = (cpf) => {
  const numbers = cpf.replace(/\D/g, '')
  if (numbers.length !== 11) return false
  if (/^(\d)\1+$/.test(numbers)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(numbers.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(numbers.charAt(10))) return false

  return true
}

export const validateCNPJ = (cnpj) => {
  const numbers = cnpj.replace(/\D/g, '')
  if (numbers.length !== 14) return false
  if (/^(\d)\1+$/.test(numbers)) return false

  let size = numbers.length - 2
  let nums = numbers.substring(0, size)
  const digits = numbers.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += nums.charAt(size - i) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  size = size + 1
  nums = numbers.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += nums.charAt(size - i) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePhone = (phone) => {
  const numbers = phone.replace(/\D/g, '')
  return numbers.length === 10 || numbers.length === 11
}

export const validateCEP = (cep) => {
  const numbers = cep.replace(/\D/g, '')
  return numbers.length === 8
}

export const validateStrongPassword = (password, minLength = 8) => {
  if (password.length < minLength) return false

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
}

export const validateDate = (date) => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d)
}
