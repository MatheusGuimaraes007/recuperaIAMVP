/**
 * RECUPERA.IA - DESIGN SYSTEM
 * All Tokens Export
 * 
 * Exporta todos os tokens do design system
 */

import colors from './colors.js'
import typography from './typography.js'
import spacing from './spacing.js'
import shadows from './shadows.js'

// ============================================================================
// BORDERS
// ============================================================================
export const borders = {
  width: {
    0: '0',
    DEFAULT: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  radius: {
    none: '0',
    sm: '8px',
    DEFAULT: '12px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    none: 'none',
  },
}

// ============================================================================
// ANIMATIONS
// ============================================================================
export const animations = {
  // Durações
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)', // ← Preferencial
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Keyframes predefinidas
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideInLeft: {
      '0%': { transform: 'translateX(-10px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    slideInRight: {
      '0%': { transform: 'translateX(10px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    scale: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
  },
}

// ============================================================================
// BREAKPOINTS
// ============================================================================
export const breakpoints = {
  xs: '375px',   // Mobile small
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop large
  '2xl': '1536px', // Desktop extra large
}

// ============================================================================
// Z-INDEX
// ============================================================================
export const zIndex = {
  auto: 'auto',
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  
  // Semantic
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
}

// ============================================================================
// EXPORTS
// ============================================================================
export { colors, typography, spacing, shadows }

export default {
  colors,
  typography,
  spacing,
  shadows,
  borders,
  animations,
  breakpoints,
  zIndex,
}
