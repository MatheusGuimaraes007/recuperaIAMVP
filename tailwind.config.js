/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cores Primárias da Marca
                primary: {
                    DEFAULT: '#7cba10',
                    hover: '#6aa50e',
                    light: '#8cd112',
                    dark: '#5a8a0c',
                    50: 'rgba(124, 186, 16, 0.05)',
                    100: 'rgba(124, 186, 16, 0.1)',
                    200: 'rgba(124, 186, 16, 0.2)',
                    300: 'rgba(124, 186, 16, 0.3)',
                    400: 'rgba(124, 186, 16, 0.4)',
                    500: 'rgba(124, 186, 16, 0.5)',
                },

                // Backgrounds
                background: {
                    base: '#0a0f01',      // --color-background3
                    card: '#021505',       // --color-background4
                    elevated: '#032108',   // Um tom acima do card
                    secondary: '#15221b',  // --color-background2
                    primary: '#ffffff',    // --color-background1
                    hover: '#0d1a06',      // Para hover states
                },

                // Status Colors
                status: {
                    success: '#10b981',
                    'success-light': 'rgba(16, 185, 129, 0.1)',
                    'success-border': 'rgba(16, 185, 129, 0.3)',

                    error: '#ef4343',
                    'error-light': 'rgba(239, 67, 67, 0.1)',
                    'error-border': 'rgba(239, 67, 67, 0.3)',

                    warning: '#fbbf24',
                    'warning-light': 'rgba(251, 191, 36, 0.1)',
                    'warning-border': 'rgba(251, 191, 36, 0.3)',

                    info: '#3b82f6',
                    'info-light': 'rgba(59, 130, 246, 0.1)',
                    'info-border': 'rgba(59, 130, 246, 0.3)',
                },

                // Metric Card Variants
                metric: {
                    blue: {
                        DEFAULT: '#3b82f6',
                        light: 'rgba(59, 130, 246, 0.1)',
                        border: 'rgba(59, 130, 246, 0.3)',
                    },
                    purple: {
                        DEFAULT: '#a855f7',
                        light: 'rgba(168, 85, 247, 0.1)',
                        border: 'rgba(168, 85, 247, 0.3)',
                    },
                    green: {
                        DEFAULT: '#10b981',
                        light: 'rgba(16, 185, 129, 0.1)',
                        border: 'rgba(16, 185, 129, 0.3)',
                    },
                    orange: {
                        DEFAULT: '#f97316',
                        light: 'rgba(249, 115, 22, 0.1)',
                        border: 'rgba(249, 115, 22, 0.3)',
                    },
                },

                // Text Colors
                text: {
                    primary: '#ffffff',
                    secondary: '#d1d5db',
                    tertiary: '#9ca3af',
                    disabled: '#6b7280',
                    success: '#7cba10',
                    error: '#ef4343',
                },

                // Border Colors
                border: {
                    DEFAULT: 'rgba(124, 191, 16, 0.2)', // --color-border1
                    light: 'rgba(124, 191, 16, 0.1)',
                    focus: '#7cba10',
                    card: '#374151',
                },
            },

            // Box Shadows
            boxShadow: {
                'primary': '0 0 15px rgba(124, 186, 16, 0.2)',
                'primary-lg': '0 0 30px rgba(124, 186, 16, 0.3)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            },

            // Animations
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
            },
        },
    },
    plugins: [
        function({ addComponents, theme }) {
            addComponents({
                // Thead Padrão para Tabelas
                '.thead-primary': {
                    'background': 'linear-gradient(to right, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.5))',
                    'backdrop-filter': 'blur(4px)',
                    'border-bottom': `1px solid ${theme('colors.gray.700')}`,
                },

                // Card Gradient
                '.card-gradient': {
                    'background': 'linear-gradient(to bottom right, var(--color-background4), var(--color-background3))',
                },

                // Button Base
                '.btn-base': {
                    'display': 'inline-flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'border-radius': '0.5rem',
                    'font-weight': '500',
                    'transition': 'all 0.2s',
                    '&:focus': {
                        'outline': 'none',
                        'ring': '2px',
                        'ring-offset': '2px',
                    },
                },

                // Input Base
                '.input-base': {
                    'width': '100%',
                    'padding': '0.75rem 1rem',
                    'border-radius': '0.5rem',
                    'border': '1px solid',
                    'border-color': theme('colors.gray.700'),
                    'background-color': theme('colors.background.secondary'),
                    'color': theme('colors.text.primary'),
                    'transition': 'all 0.2s',
                    '&:focus': {
                        'outline': 'none',
                        'border-color': theme('colors.primary.DEFAULT'),
                        'ring': '2px',
                        'ring-color': theme('colors.primary.DEFAULT'),
                    },
                },

                // Badge Base
                '.badge-base': {
                    'display': 'inline-flex',
                    'align-items': 'center',
                    'gap': '0.375rem',
                    'padding': '0.25rem 0.75rem',
                    'border-radius': '9999px',
                    'font-size': '0.75rem',
                    'font-weight': '500',
                    'border': '1px solid',
                    'transition': 'all 0.2s',
                },

                // Section Header
                '.section-header': {
                    'display': 'flex',
                    'align-items': 'center',
                    'gap': '1rem',
                    'margin-bottom': '1.5rem',
                    'padding-bottom': '0.75rem',
                    'border-bottom': `1px solid ${theme('colors.gray.700')}`,
                },

                // Scrollbar Customizado
                '.scrollbar-custom': {
                    '&::-webkit-scrollbar': {
                        'width': '8px',
                        'height': '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        'background': theme('colors.gray.800'),
                        'border-radius': '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        'background': theme('colors.gray.600'),
                        'border-radius': '4px',
                        '&:hover': {
                            'background': theme('colors.gray.500'),
                        },
                    },
                },
            })
        },
    ],
}