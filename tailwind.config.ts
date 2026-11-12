/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agentic: {
          bg: '#020307',
          canvas: '#06080E',
          card: '#0B0E17',
          'card-hover': '#111624',
          subtle: '#141A2B',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(91, 139, 247, 0.45)',
          blue: '#5B8BF7',
          'blue-muted': '#324A80',
          ice: '#8FA5D9',
          frost: '#D7DCEA',
          steel: '#8E95A5',
          darkText: '#5A6275',
          emerald: '#10B981',
          coral: '#F43F5E',
          amber: '#F59E0B'
        },
        vintage: {
          cream: '#020307',
          paper: '#0B0E17',
          card: '#0F1320',
          subtle: '#141A2A',
          ink: '#FFFFFF',
          charcoal: '#D7DCEA',
          muted: '#8E95A5',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': 'rgba(255, 255, 255, 0.16)',
          terracotta: '#F43F5E',
          'terracotta-light': 'rgba(244, 63, 94, 0.12)',
          forest: '#10B981',
          'forest-light': 'rgba(16, 185, 129, 0.12)',
          gold: '#5B8BF7',
          'gold-light': 'rgba(91, 139, 247, 0.12)',
          navy: '#7189BA',
          'navy-light': 'rgba(113, 137, 186, 0.15)',
        }
      },
      fontFamily: {
        serif: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        cinzel: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'vintage-xs': '0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'vintage-sm': '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'vintage-md': '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'vintage-lg': '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(91, 139, 247, 0.12)',
        'agentic-glow': '0 0 30px rgba(91, 139, 247, 0.25), 0 12px 36px rgba(0, 0, 0, 0.7)',
        'agentic-emerald': '0 0 25px rgba(16, 185, 129, 0.2)'
      }
    },
  },
  plugins: [],
}
