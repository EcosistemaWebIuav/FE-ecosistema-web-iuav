const plugin = require('tailwindcss/plugin')

module.exports = {
    content: ['./src/**/*.twig'],
    safelist: ['mt-12', 'mt-16', 'mt-20', 'mt-24', 'mt-32', 'mt-40', 'mb-16', 'mb-20', 'mb-24', 'mb-32', 'mb-40'],
    theme: {
        fontFamily: {
            sans: ['Standard', 'sans-serif']
        },
        fontSize: {
            'xs': '.75rem',
            'sm': '.8125rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.375rem',
            '5xl': '2.875rem',
            '6xl': '3rem',
            '7xl': '3.5rem',
            '8xl': '4rem',
            '9xl': '4.25rem'
        },
        colors: {
            yellow: "#FFCC00",
            white: '#FFFFFF',
            grey: {
                100: '#EDF2F2',
                200: '#D3D8D8',
                300: '#A3ADAD',
                400: '#838D8D',
                500: '#535A5A'
            },
            black: '#000000',
            success: '#3EE976',
            warning: '#FFAC00',
            error: '#F8445A',
            transparent: 'transparent'
        },
        extend: {
            lineHeight: {
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
