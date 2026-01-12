/**
 * Storage - Gerenciamento de armazenamento local
 *
 * Utilitários para localStorage e sessionStorage com segurança.
 */

const PREFIX = 'recupera_'

export const getItem = (key, defaultValue = null, session = false) => {
  try {
    const storage = session ? sessionStorage : localStorage
    const item = storage.getItem(PREFIX + key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Storage getItem error:', error)
    return defaultValue
  }
}

export const setItem = (key, value, session = false) => {
  try {
    const storage = session ? sessionStorage : localStorage
    storage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Storage setItem error:', error)
    return false
  }
}

export const removeItem = (key, session = false) => {
  try {
    const storage = session ? sessionStorage : localStorage
    storage.removeItem(PREFIX + key)
    return true
  } catch (error) {
    console.error('Storage removeItem error:', error)
    return false
  }
}

export const clearAll = (session = false) => {
  try {
    const storage = session ? sessionStorage : localStorage
    const keys = Object.keys(storage)
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        storage.removeItem(key)
      }
    })
    return true
  } catch (error) {
    console.error('Storage clearAll error:', error)
    return false
  }
}

export const getAllKeys = (session = false) => {
  try {
    const storage = session ? sessionStorage : localStorage
    return Object.keys(storage)
      .filter(key => key.startsWith(PREFIX))
      .map(key => key.replace(PREFIX, ''))
  } catch (error) {
    console.error('Storage getAllKeys error:', error)
    return []
  }
}