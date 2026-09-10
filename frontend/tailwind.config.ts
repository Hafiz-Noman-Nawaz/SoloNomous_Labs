import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09080E',
        foreground: '#F8FAFC',
        lab: {
          dark: '#0B0A10',
          card: '#12111A',
          cardHover: '#181624',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(124, 58, 237, 0.35)',
          purple: {
            DEFAULT: '#7C3AED',
            light: '#9061F9',
            dark: '#6D28D9',
            glow: '#8B5CF6'
          },
          accent: '#A78BFA',
          muted: '#94A3B8',
          subtle: '#64748B'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.18) 0%, rgba(9, 8, 14, 0) 70%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
