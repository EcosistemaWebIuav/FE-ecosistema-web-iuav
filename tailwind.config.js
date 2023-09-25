const plugin = require('tailwindcss/plugin')

module.exports = {
    content: ['./src/**/*.twig'],
    safelist: [
        "mr-2"
    ],
    theme: {
        fontFamily: {
            sans: ['noway', 'sans-serif']
        },
        fontSize: {
            'xs': '.75rem',
            'sm': '.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.75rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.5rem',
            '7xl': '4rem',
            '8xl': '5rem',
            '9xl': '6rem'
        },
        colors: {
            primary: {
                100: '#F0F7FF',
                200: '#0056D7'
            },
            secondary: '#05D58B',
            white: '#FFFFFF',
            grey: {
                100: '#F7F7F7',
                200: '#DBDADC',
                300: '#95969B',
                400: '#585C67'
            },
            black: '#242424',
            success: '#3EE976',
            warning: '#FFAC00',
            error: '#F8445A',
            transparent: 'transparent'
        },
        screens: {
            'xsm': '375px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px'
        },      
        extend: {
            lineHeight: {
                'tight': '1.10'
            }
        }
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            const newUtilities = {
                '.position-center': {
                    top: '50%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-50%)'
                },
                '.position-center-horizontal': {
                    left: '50%',
                    transform: 'translateX(-50%)'
                },
                '.position-center-vertical': {
                    top: '50%',
                    transform: 'translateY(-50%)'
                }
            }
            addUtilities(newUtilities)
        })
    ]    
}
