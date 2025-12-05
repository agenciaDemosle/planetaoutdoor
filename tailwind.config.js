/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales estilo Patagonia
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Color accent Patagonia (naranja)
        accent: {
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
        },
        // Naranja para banners
        nature: {
          DEFAULT: '#FE6A00',
          light: '#FF8533',
          dark: '#E55F00',
        },
      },
      fontFamily: {
        sans: ['"Founders Grotesk"', 'Avenir', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        display: ['"Ridgeway Sans"', '"Founders Grotesk"', 'Avenir', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.5' }],
        'xl': ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
        '6xl': ['60px', { lineHeight: '1.1' }],
        '7xl': ['72px', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      height: {
        'hero': '820px',
        'header': '70px',
        'topbar': '40px',
      },
      maxWidth: {
        'container': '1440px',
      },
      borderRadius: {
        'pill': '9999px',
        'card': '16px',
      },
      boxShadow: {
        'text': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      zIndex: {
        'topbar': '40',
        'header': '50',
        'megamenu': '45',
        'overlay': '60',
        'modal': '70',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
