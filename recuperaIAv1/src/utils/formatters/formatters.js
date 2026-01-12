/**
 * Formatters - Funções de formatação
 *
 * Utilitários para formatação de valores comuns.
 */

export const formatCPF = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return numbers.slice(0, 11)
}

export const formatCNPJ = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 14) {
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
  return numbers.slice(0, 14)
}

export const formatPhone = (value) => {
  if (!value) return ''
  let numbers = value.replace(/\D/g, '')
  if (numbers.length > 11) numbers = numbers.slice(0, 11)

  if (numbers.length > 10) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else if (numbers.length > 5) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  } else if (numbers.length > 2) {
    return numbers.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
  }
  return numbers.replace(/^(\d*)/, '($1')
}

export const formatCEP = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '').slice(0, 8)
  return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export const formatCurrency = (value, prefix = 'R$ ') => {
  if (!value && value !== 0) return ''
  const numValue = typeof value === 'string'
    ? parseFloat(value.replace(/\D/g, '')) / 100
    : value

  return prefix + numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

export const formatNumber = (value, decimals = 0) => {
  if (!value && value !== 0) return '0'
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
    .replace('HH', hours)
    .replace('mm', minutes)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diff = now - d

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  if (hours < 24) return `há ${hours}h`
  if (days < 30) return `há ${days}d`
  if (months < 12) return `há ${months} meses`
  return `há ${years} anos`
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}