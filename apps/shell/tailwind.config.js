/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0B',
        surface: '#151516',
        accent: {
          primary: '#84AF48', // R: 132, G: 175, B: 72
          cyan: '#84AF48',
          emerald: '#00FF9C',
          magenta: '#FF00E5',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(8px)' },
          '50%': { opacity: '0.8', filter: 'blur(12px)' },
        },
      },
    },
  },
  plugins: [],
};
