import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1A56DB',
          orange: '#F97316',
          bg: '#F0F4FF',
          dark: '#0F172A',
          border: '#E2E8F0',
          textPrimary: '#0F172A',
          textSecondary: '#475569',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 0 0 1px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 0 0 1px rgba(26,86,219,0.12), 0 8px 32px rgba(26,86,219,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'nav': '0 0 0 1px rgba(0,0,0,0.05), 0 4px 24px rgba(0,0,0,0.07)',
        'nav-pill': '0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
        'orange-glow': '0 0 0 3px rgba(249,115,22,0.18), 0 4px 16px rgba(249,115,22,0.2)',
        'blue-glow': '0 0 0 3px rgba(26,86,219,0.14), 0 4px 16px rgba(26,86,219,0.15)',
        'stat': '0 0 0 1px rgba(26,86,219,0.06), 0 2px 8px rgba(26,86,219,0.04)',
        'float': '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.1)',
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,0.06)',
        'btn-orange': '0 1px 2px rgba(249,115,22,0.3), 0 4px 12px rgba(249,115,22,0.18)',
        'btn-blue': '0 1px 2px rgba(26,86,219,0.3), 0 4px 12px rgba(26,86,219,0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'marquee': 'marquee-left 38s linear infinite',
        'marquee-reverse': 'marquee-right 30s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 60% 50% at 90% 10%, rgba(26,86,219,0.07) 0%, transparent 70%)',
        'hero-dots': 'radial-gradient(rgba(26,86,219,0.07) 1.2px, transparent 1.2px)',
        'blue-gradient': 'linear-gradient(135deg, #1A56DB 0%, #2563eb 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F97316 0%, #ea580c 100%)',
        'logo-gradient': 'linear-gradient(135deg, #F97316 0%, #1A56DB 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      backgroundSize: {
        'dots': '26px 26px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
