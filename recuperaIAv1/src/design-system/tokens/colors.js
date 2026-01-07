/**
 * RECUPERA.IA - DESIGN SYSTEM
 * Color Tokens
 * 
 * Define todas as cores usadas no sistema.
 * Exporta em formato JavaScript para uso em componentes.
 */

export const colors = {
  // ============================================================================
  // CORES PRIMÁRIAS - Verde Vibrante (Marca Recupera.IA)
  // ============================================================================
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#00C853', // ← COR PRINCIPAL
    700: '#00A843',
    800: '#00883A',
    900: '#006B23',
  },

  // Alias para consistência
  green: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#00C853', // ← COR PRINCIPAL
    700: '#00A843',
    800: '#00883A',
    900: '#006B23',
  },

  // ============================================================================
  // CORES NEUTRAS - Gray Scale
  // ============================================================================
  gray: {
    50: '#F8F9FA',  // Backgrounds muito claros
    100: '#E9ECEF', // Backgrounds de cards
    200: '#DEE2E6', // Borders sutis
    300: '#CED4DA', // Borders padrão
    400: '#ADB5BD', // Texto desabilitado
    500: '#868E96', // Texto terciário
    600: '#6C757D', // Texto secundário
    700: '#495057', // Texto primário claro
    800: '#343A40', // Texto primário
    900: '#212529', // Texto principal/headings
  },

  // ============================================================================
  // CORES SEMÂNTICAS - Success, Warning, Error, Info
  // ============================================================================
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#00C853', // Mesma que primary
    600: '#00A843',
    700: '#00883A',
    800: '#007030',
    900: '#006B23',
    // Backgrounds
    bg: '#E8F5E9',
    bgHover: '#C8E6C9',
  },

  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
    // Backgrounds
    bg: '#FFF3E0',
    bgHover: '#FFE0B2',
  },

  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
    // Backgrounds
    bg: '#FFEBEE',
    bgHover: '#FFCDD2',
  },

  info: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
    // Backgrounds
    bg: '#E3F2FD',
    bgHover: '#BBDEFB',
  },

  // ============================================================================
  // CORES ESPECIAIS
  // ============================================================================
  white: '#FFFFFF',
  black: '#0A0B0D',
  transparent: 'transparent',
  current: 'currentColor',

  // ============================================================================
  // BACKGROUNDS - Aplicação
  // ============================================================================
  background: {
    primary: '#FFFFFF',   // Background principal
    secondary: '#F8F9FA', // Background da página
    tertiary: '#E9ECEF',  // Background de cards
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay de modais
  },

  // ============================================================================
  // TEXT COLORS - Hierarquia de Texto
  // ============================================================================
  text: {
    primary: '#212529',   // Texto principal
    secondary: '#6C757D', // Texto secundário
    tertiary: '#ADB5BD',  // Texto terciário
    disabled: '#CED4DA',  // Texto desabilitado
    inverse: '#FFFFFF',   // Texto sobre dark backgrounds
    link: '#00C853',      // Links
    linkHover: '#00A843', // Links hover
  },

  // ============================================================================
  // BORDERS - Hierarquia de Bordas
  // ============================================================================
  border: {
    light: '#E9ECEF',   // Bordas sutis
    medium: '#DEE2E6',  // Bordas padrão
    dark: '#CED4DA',    // Bordas destacadas
    focus: '#00C853',   // Bordas em foco
  },

  // ============================================================================
  // ESTADOS - Hover, Active, Focus, Disabled
  // ============================================================================
  states: {
    hover: {
      primary: '#00A843',
      secondary: '#E9ECEF',
    },
    active: {
      primary: '#00883A',
      secondary: '#DEE2E6',
    },
    focus: {
      ring: '#00C853',
      outline: 'rgba(0, 200, 83, 0.3)',
    },
    disabled: {
      bg: '#E9ECEF',
      text: '#ADB5BD',
      border: '#DEE2E6',
    },
  },
}

// ============================================================================
// HELPERS - Funções utilitárias
// ============================================================================

/**
 * Retorna cor com opacity
 * @param {string} color - Cor em hex
 * @param {number} opacity - Opacity de 0 a 1
 * @returns {string} - Cor em rgba
 */
export const withOpacity = (color, opacity) => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Retorna variação de cor (lighten/darken)
 * @param {string} color - Cor base
 * @param {number} amount - Quantidade (-100 a 100)
 * @returns {string} - Cor variada
 */
export const varyColor = (color, amount) => {
  // Implementação simplificada
  // Em produção, usar biblioteca como polished ou color
  return color
}

export default colors
