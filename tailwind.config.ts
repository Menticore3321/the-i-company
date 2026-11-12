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
          bg: '#F8FAFC',
          canvas: '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.75)',
          'card-hover': 'rgba(255, 255, 255, 0.90)',
          subtle: '#F1F5F9',
          border: 'rgba(226, 232, 240, 0.8)',
          'border-active': 'rgba(37, 99, 235, 0.5)',
          blue: '#2563EB',
          'blue-muted': '#93C5FD',
          ice: '#3B82F6',
          frost: '#0F172A',
          steel: '#64748B',
          darkText: '#0F172A',
          emerald: '#059669',
          coral: '#E11D48',
          amber: '#D97706'
        },
        vintage: {
          cream: '#F8FAFC',
          paper: '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.8)',
          subtle: '#F1F5F9',
          ink: '#0F172A',
          charcoal: '#334155',
          muted: '#64748B',
          border: 'rgba(226, 232, 240, 0.8)',
          'border-strong': 'rgba(203, 213, 225, 0.9)',
          terracotta: '#E11D48',
          'terracotta-light': '#FFE4E6',
          forest: '#059669',
          'forest-light': '#D1FAE5',
          gold: '#2563EB',
          'gold-light': '#DBEAFE',
          navy: '#475569',
          'navy-light': '#F1F5F9',
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
        'vintage-xs': '0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'vintage-sm': '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'vintage-md': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'vintage-lg': '0 20px 40px -10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        'agentic-glow': '0 8px 30px rgba(37, 99, 235, 0.12), 0 2px 8px rgba(37, 99, 235, 0.08)',
        'glass-card': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
      }
    },
  },
  plugins: [],
}
