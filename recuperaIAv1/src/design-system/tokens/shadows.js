/**
 * RECUPERA.IA - DESIGN SYSTEM
 * Shadow Tokens
 * 
 * Sistema de sombras em 4 níveis de elevação.
 */

export const shadows = {
  // ============================================================================
  // BOX SHADOWS - 4 Níveis de Elevação
  // ============================================================================
  none: 'none',

  // Level 1 - Baixo (Inputs, botões secundários em repouso)
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Level 2 - Médio (Cards, botões primários em repouso)
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  
  // Level 3 - Alto (Dropdowns, popovers, tooltips)
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  
  // Level 4 - Máximo (Modais, overlays importantes)
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
}

// ============================================================================
// SEMANTIC SHADOWS - Uso semântico
// ============================================================================
export const semanticShadows = {
  // Componentes
  button: {
    rest: shadows.sm,
    hover: shadows.md,
    active: shadows.none,
    focus: '0 0 0 3px rgba(0, 200, 83, 0.3)',
  },

  input: {
    rest: shadows.sm,
    focus: '0 0 0 3px rgba(0, 200, 83, 0.3)',
    error: '0 0 0 3px rgba(244, 67, 54, 0.3)',
  },

  card: {
    rest: shadows.md,
    hover: shadows.lg,
    active: shadows.sm,
  },

  dropdown: {
    rest: shadows.lg,
  },

  modal: {
    rest: shadows.xl,
  },

  tooltip: {
    rest: shadows.lg,
  },

  floating: {
    rest: shadows['2xl'],
  },
}

// ============================================================================
// COLORED SHADOWS - Sombras coloridas (uso especial)
// ============================================================================
export const coloredShadows = {
  primary: '0 10px 15px -3px rgba(0, 200, 83, 0.3)',
  success: '0 10px 15px -3px rgba(0, 200, 83, 0.3)',
  warning: '0 10px 15px -3px rgba(255, 152, 0, 0.3)',
  error: '0 10px 15px -3px rgba(244, 67, 54, 0.3)',
  info: '0 10px 15px -3px rgba(33, 150, 243, 0.3)',
}

// ============================================================================
// FOCUS RING - Anéis de foco (acessibilidade)
// ============================================================================
export const focusRing = {
  // Anel padrão (verde)
  default: '0 0 0 3px rgba(0, 200, 83, 0.3)',
  
  // Anéis semânticos
  primary: '0 0 0 3px rgba(0, 200, 83, 0.3)',
  success: '0 0 0 3px rgba(0, 200, 83, 0.3)',
  warning: '0 0 0 3px rgba(255, 152, 0, 0.3)',
  error: '0 0 0 3px rgba(244, 67, 54, 0.3)',
  info: '0 0 0 3px rgba(33, 150, 243, 0.3)',
}

// ============================================================================
// ELEVATION MAP - Mapeamento de elevações
// ============================================================================
export const elevationMap = {
  0: shadows.none,
  1: shadows.sm,
  2: shadows.md,
  3: shadows.lg,
  4: shadows.xl,
  5: shadows['2xl'],
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Retorna sombra por nível de elevação
 * @param {number} level - Nível (0-5)
 * @returns {string} - Valor da sombra
 */
export const getElevationShadow = (level) => {
  return elevationMap[level] || elevationMap[0]
}

/**
 * Combina múltiplas sombras
 * @param {...string} shadows - Sombras para combinar
 * @returns {string} - Sombra combinada
 */
export const combineShadows = (...shadowValues) => {
  return shadowValues.filter(Boolean).join(', ')
}

export default shadows
