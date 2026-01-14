/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: '#000000',
                charcoal: '#121212',
                stone: {
                    950: '#0c0a09',
                    900: '#1c1917',
                    800: '#292524',
                },
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#F4DF4E',
                    dark: '#AA8C2C',
                },
                platinum: '#E5E4E2',
                silver: '#C0C0C0',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}
