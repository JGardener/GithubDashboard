/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border-hsl))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--background))', foreground: 'hsl(var(--muted-foreground))' },
        ds: {
          bg:        '#05080F',
          surface:   '#0B1220',
          surface2:  '#101828',
          surface3:  '#162035',
          border:    '#1C2A42',
          border2:   '#263550',
          text:      '#E2E8F8',
          sub:       '#8090B0',
          dim:       '#3E506E',
          c1:        '#818CF8',
          c2:        '#34D399',
          win:       '#FCD34D',
          err:       '#F87171',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        ds:    '12px',
        'ds-sm': '7px',
        'ds-lg': '18px',
      },
      animation: {
        shimmer:    'shimmer 1.6s ease infinite',
        loading:    'loading 0.9s linear infinite',
        'modal-in': 'modal-in 280ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        loading: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.93) translateY(12px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
