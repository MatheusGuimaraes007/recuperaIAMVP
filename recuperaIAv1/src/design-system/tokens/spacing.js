/**
 * RECUPERA.IA - DESIGN SYSTEM
 * Spacing Tokens
 * 
 * Sistema de espaçamento baseado em múltiplos de 4px.
 */

export const spacing = {
  // ============================================================================
  // SPACING SCALE - Base de 4px
  // ============================================================================
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',   // ← PADRÃO
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
}

// ============================================================================
// SEMANTIC SPACING - Uso semântico
// ============================================================================
export const semanticSpacing = {
  // Padding interno de componentes
  componentPadding: {
    xs: spacing[2],      // 8px
    sm: spacing[3],      // 12px
    md: spacing[4],      // 16px ← Padrão
    lg: spacing[6],      // 24px
    xl: spacing[8],      // 32px
  },

  // Gap entre elementos
  gap: {
    xs: spacing[1],      // 4px
    sm: spacing[2],      // 8px
    md: spacing[4],      // 16px ← Padrão
    lg: spacing[6],      // 24px
    xl: spacing[8],      // 32px
  },

  // Margem entre seções
  sectionMargin: {
    sm: spacing[8],      // 32px
    md: spacing[12],     // 48px ← Padrão
    lg: spacing[16],     // 64px
    xl: spacing[24],     // 96px
  },

  // Padding de páginas/containers
  containerPadding: {
    mobile: spacing[4],  // 16px
    tablet: spacing[6],  // 24px
    desktop: spacing[8], // 32px
  },

  // Espaçamento de cards
  card: {
    padding: spacing[6],     // 24px
    gap: spacing[4],         // 16px
    marginBottom: spacing[4], // 16px
  },

  // Espaçamento de formulários
  form: {
    fieldGap: spacing[4],      // 16px entre campos
    labelMargin: spacing[2],   // 8px entre label e input
    sectionGap: spacing[8],    // 32px entre seções
    buttonMargin: spacing[6],  // 24px antes dos botões
  },

  // Espaçamento de listas
  list: {
    itemGap: spacing[2],       // 8px entre itens
    itemPadding: spacing[3],   // 12px padding interno
    sectionGap: spacing[6],    // 24px entre seções
  },

  // Espaçamento de navegação
  nav: {
    itemGap: spacing[1],       // 4px entre items
    itemPadding: spacing[3],   // 12px padding interno
    sectionGap: spacing[6],    // 24px entre seções
  },
}

// ============================================================================
// INSET SPACING - Padding em todas as direções
// ============================================================================
export const insetSpacing = {
  xs: spacing[2],      // 8px
  sm: spacing[3],      // 12px
  md: spacing[4],      // 16px ← Padrão
  lg: spacing[6],      // 24px
  xl: spacing[8],      // 32px
}

// ============================================================================
// STACK SPACING - Espaçamento vertical (margin-bottom)
// ============================================================================
export const stackSpacing = {
  xs: spacing[2],      // 8px
  sm: spacing[4],      // 16px
  md: spacing[6],      // 24px ← Padrão
  lg: spacing[8],      // 32px
  xl: spacing[12],     // 48px
}

// ============================================================================
// INLINE SPACING - Espaçamento horizontal (margin-right)
// ============================================================================
export const inlineSpacing = {
  xs: spacing[1],      // 4px
  sm: spacing[2],      // 8px
  md: spacing[4],      // 16px ← Padrão
  lg: spacing[6],      // 24px
  xl: spacing[8],      // 32px
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Converte valor de spacing em rem
 * @param {string} value - Valor em px
 * @returns {string} - Valor em rem
 */
export const pxToRem = (value) => {
  const px = parseInt(value)
  return `${px / 16}rem`
}

/**
 * Gera classes de spacing para Tailwind
 * @returns {object} - Objeto de classes
 */
export const generateSpacingClasses = () => {
  const classes = {}
  Object.entries(spacing).forEach(([key, value]) => {
    classes[key] = value
  })
  return classes
}

export default spacing
