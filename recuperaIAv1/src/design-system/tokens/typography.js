/**
 * RECUPERA.IA - DESIGN SYSTEM
 * Typography Tokens
 * 
 * Define toda a tipografia do sistema.
 */

export const typography = {
  // ============================================================================
  // FONT FAMILIES
  // ============================================================================
  fontFamily: {
    sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },

  // ============================================================================
  // FONT SIZES
  // ============================================================================
  fontSize: {
    xs: {
      size: '12px',
      lineHeight: '16px',
      letterSpacing: '0',
    },
    sm: {
      size: '14px',
      lineHeight: '20px',
      letterSpacing: '0',
    },
    base: {
      size: '16px',
      lineHeight: '24px',
      letterSpacing: '0',
    },
    lg: {
      size: '18px',
      lineHeight: '28px',
      letterSpacing: '0',
    },
    xl: {
      size: '20px',
      lineHeight: '28px',
      letterSpacing: '-0.01em',
    },
    '2xl': {
      size: '24px',
      lineHeight: '32px',
      letterSpacing: '-0.01em',
    },
    '3xl': {
      size: '30px',
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    },
    '4xl': {
      size: '36px',
      lineHeight: '40px',
      letterSpacing: '-0.02em',
    },
    '5xl': {
      size: '48px',
      lineHeight: '1',
      letterSpacing: '-0.03em',
    },
    '6xl': {
      size: '56px',
      lineHeight: '1',
      letterSpacing: '-0.03em',
    },
  },

  // ============================================================================
  // FONT WEIGHTS
  // ============================================================================
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // ============================================================================
  // LINE HEIGHTS
  // ============================================================================
  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.6,
    loose: 2,
  },

  // ============================================================================
  // LETTER SPACING
  // ============================================================================
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // ============================================================================
  // TEXT STYLES - Combinações pré-definidas
  // ============================================================================
  textStyles: {
    // Display styles (Hero sections)
    'display-large': {
      fontSize: '56px',
      lineHeight: '1',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      fontFamily: 'Manrope',
    },
    'display-medium': {
      fontSize: '48px',
      lineHeight: '1',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      fontFamily: 'Manrope',
    },
    'display-small': {
      fontSize: '36px',
      lineHeight: '40px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'Manrope',
    },

    // Headings
    'heading-1': {
      fontSize: '36px',
      lineHeight: '40px',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      fontFamily: 'Manrope',
    },
    'heading-2': {
      fontSize: '30px',
      lineHeight: '36px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontFamily: 'Manrope',
    },
    'heading-3': {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontFamily: 'Manrope',
    },
    'heading-4': {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontFamily: 'Manrope',
    },
    'heading-5': {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'heading-6': {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 600,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },

    // Body text
    'body-large': {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 400,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'body-base': {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'body-small': {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },

    // Labels
    'label-large': {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 500,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'label-medium': {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'label-small': {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 500,
      letterSpacing: '0.01em',
      fontFamily: 'Manrope',
    },

    // Captions
    'caption': {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
      letterSpacing: '0.01em',
      fontFamily: 'Manrope',
    },

    // Code/Monospace
    'code': {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '0',
      fontFamily: 'DM Mono',
    },

    // Buttons
    'button-large': {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 600,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'button-medium': {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
      letterSpacing: '0',
      fontFamily: 'Manrope',
    },
    'button-small': {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontFamily: 'Manrope',
    },
  },
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Gera CSS para text style
 * @param {string} styleName - Nome do estilo
 * @returns {object} - Objeto com propriedades CSS
 */
export const getTextStyle = (styleName) => {
  return typography.textStyles[styleName] || typography.textStyles['body-base']
}

/**
 * Gera string CSS para text style
 * @param {string} styleName - Nome do estilo
 * @returns {string} - String CSS
 */
export const getTextStyleCSS = (styleName) => {
  const style = getTextStyle(styleName)
  return `
    font-size: ${style.fontSize};
    line-height: ${style.lineHeight};
    font-weight: ${style.fontWeight};
    letter-spacing: ${style.letterSpacing};
    font-family: ${style.fontFamily};
  `.trim()
}

export default typography
