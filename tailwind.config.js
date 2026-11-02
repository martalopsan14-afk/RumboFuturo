/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Valores provisionales: sustituir por los códigos oficiales del manual de marca (HEX, RGB y CMYK).
        ink: { DEFAULT: '#16283F', soft: '#2A4263' },
        ivory: { DEFAULT: '#F8F4EA', deep: '#EFE8D8' },
        coral: { DEFAULT: '#E8674A', soft: '#F6D5C9' },
        graphite: { DEFAULT: '#33373D', soft: '#5A5F66' },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        editorial: ['"Fanwood Text"', 'Georgia', 'serif'],
        body: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
      },
    },
  },
  plugins: [],
};
