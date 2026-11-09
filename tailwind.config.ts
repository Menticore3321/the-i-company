/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          cream: '#FBF9F5',
          paper: '#FFFFFF',
          card: '#F5F2EB',
          subtle: '#EFECE6',
          ink: '#1C1917',
          charcoal: '#292524',
          muted: '#78716C',
          border: '#E7E2DA',
          'border-strong': '#D6CFBF',
          terracotta: '#C25E3E',
          'terracotta-light': '#FDF3EE',
          forest: '#2E523E',
          'forest-light': '#EEF5F1',
          gold: '#B8860B',
          'gold-light': '#FDF8EC',
          navy: '#25384D',
          'navy-light': '#F0F4F8',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', '"Newsreader"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'vintage-sm': '0 1px 3px rgba(28, 25, 23, 0.04), 0 1px 2px rgba(28, 25, 23, 0.02)',
        'vintage-md': '0 4px 12px rgba(28, 25, 23, 0.05), 0 1px 3px rgba(28, 25, 23, 0.03)',
        'vintage-lg': '0 10px 25px rgba(28, 25, 23, 0.07), 0 2px 6px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}
