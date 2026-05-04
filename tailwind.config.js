/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF8F4',
          dark: '#F0EDE6',
          deeper: '#E8E3DB',
        },
        ink: {
          DEFAULT: '#181612',
          base: '#181612',
          muted: '#5C5750',
          light: '#9C9690',
          faint: '#C8C3BC',
        },
        amber: {
          rupee: '#C8702A',
          deep: '#A85A20',
          light: '#F5E6D3',
          glow: '#FDE8CE',
        },
        gain: {
          DEFAULT: '#1E7A47',
          deep: '#155A35',
          light: '#D4EDDF',
          glow: '#C2EDDA',
        },
        loss: {
          DEFAULT: '#C0392B',
          deep: '#962D22',
          light: '#FAE0D8',
          glow: '#FCD5CC',
        },
        info: {
          DEFAULT: '#1A4E8C',
          deep: '#123870',
          light: '#D4E4F5',
          glow: '#C0D8F0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FDFCFA',
          subtle: '#F5F2ED',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(24,22,18,0.06), 0 4px 16px 0 rgba(24,22,18,0.04)',
        'card-hover': '0 4px 12px 0 rgba(24,22,18,0.10), 0 16px 40px 0 rgba(24,22,18,0.08)',
        'metric': '0 2px 8px 0 rgba(24,22,18,0.07)',
        'metric-hover': '0 6px 24px 0 rgba(24,22,18,0.12)',
        'panel': '0 0 0 1px rgba(24,22,18,0.08), 0 4px 20px 0 rgba(24,22,18,0.06)',
        'navbar': '0 1px 0 0 rgba(24,22,18,0.08)',
        'glow-amber': '0 0 0 3px rgba(200,112,42,0.15)',
        'glow-gain': '0 0 0 3px rgba(30,122,71,0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FAF8F4 0%, #F0EDE6 50%, #FAF8F4 100%)',
        'gradient-amber': 'linear-gradient(135deg, #C8702A 0%, #A85A20 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #FDFCFA 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1C1A16 0%, #181612 100%)',
        'gradient-gain': 'linear-gradient(135deg, #1E7A47 0%, #155A35 100%)',
        'gradient-loss': 'linear-gradient(135deg, #C0392B 0%, #962D22 100%)',
        'gradient-info': 'linear-gradient(135deg, #1A4E8C 0%, #123870 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
