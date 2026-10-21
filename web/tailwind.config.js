/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saas: {
          bg: '#F7F8FA',
          card: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
          border: '#E5E7EB',
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
        },
        cyber: {
          bg: '#0A0F1C',       // Dark background
          surface: '#101827',  // Dark secondary surface
          card: '#141D2E',     // Dark card
          elevated: '#182235', // Dark elevated surface
          border: 'rgba(255, 255, 255, 0.08)',
          blue: '#2563EB',     // Muted primary blue
          blueHover: '#3B82F6',
          cyan: '#06B6D4',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          
          // Preserved for legacy mappings
          950: '#0A0F1C',
          900: '#101827',
          850: '#141D2E',
          800: '#182235',
          700: '#26354D',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          accent: '#2563EB',
          neon: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'clean-md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'clean-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'enterprise': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'enterprise-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
