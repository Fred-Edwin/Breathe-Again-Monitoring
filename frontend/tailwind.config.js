/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary - Deep Forest
                primary: {
                    50: '#f0fdf4',
                    100: '#E8F5E9',
                    300: '#7FB069',
                    500: '#4A7C59',
                    600: '#3D6849',
                    700: '#2D5F3F',
                    900: '#1A3A2E',
                },
                // Secondary - Earth Tones
                secondary: {
                    300: '#F4E4C1',
                    500: '#D4A574',
                    700: '#8B6F47',
                },
                // Accent - Sunset Warmth
                accent: {
                    300: '#FFD6A5',
                    500: '#F4A261',
                    700: '#E67E22',
                },
                // Status colors
                success: {
                    100: '#E8F5E9',
                    300: '#81C784',
                    500: '#4CAF50',
                    700: '#2E7D32',
                },
                warning: {
                    100: '#FFF3E0',
                    300: '#FFB74D',
                    500: '#FF9800',
                    700: '#E65100',
                },
                critical: {
                    100: '#FFEBEE',
                    300: '#E57373',
                    500: '#EF5350',
                    700: '#C62828',
                },
                info: {
                    100: '#E3F2FD',
                    300: '#90CAF9',
                    500: '#42A5F5',
                    700: '#1565C0',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'lg': '24px',
                'xl': '32px',
            },
        },
    },
    plugins: [],
}
