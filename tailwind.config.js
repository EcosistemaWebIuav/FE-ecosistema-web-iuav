const plugin = require('tailwindcss/plugin')

module.exports = {
    content: ['./src/**/*.twig'],
    safelist: ['mt-12', 'mt-16', 'mt-20', 'mt-24', 'mt-32', 'mt-40', 'mb-16', 'mb-20', 'mb-24', 'mb-32', 'mb-40'],
    theme: {
        screens: {
            'sm': '40rem',
            'md': '48rem',
            'lg': '64rem',
            'xl': '80rem',
            '2xl': '120rem',
            '3xl': '128rem'
        },
        fontFamily: {
            sans: ['Standard', 'sans-serif']
        },
        fontSize: {
            'sm': ['13px', '20px'],
            'base': ['16px', '25px'],
            'md': ['20px', '30px'],
            'md-lg': ['26px', '35px'],
            'lg': ['30px', '40px'],
            'xl': ['44px', '55px'],
            '2xl': ['58px', '70px'],
            '3xl': ['90px', '105px']
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
            spacing: {
                '15': '3.75rem',
                'xs': 'calc(var(--spacing-size)/2)',
                'sm': 'calc(var(--spacing-size))',
                'base': 'calc(var(--spacing-size)*2)',
                'lg': 'calc(var(--spacing-size)*2.5)',
                'xl': 'calc(var(--spacing-size)*4)',
                'xxl': 'calc(var(--spacing-size)*5)',
                'xxxl': '5rem',
                '3.75': '0.9375rem',
                '6.25': '1.5625rem',
                '7.5': '1.875rem',
                '8.75': '2.1875rem',
                '12.5': '3.125rem',
                '25': '6.25rem'
            },
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
