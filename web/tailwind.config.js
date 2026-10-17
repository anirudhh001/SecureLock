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
        cyber: {
          950: '#0b0f19', // Deep enterprise midnight navy
          900: '#111827', // Slate dark surface
          850: '#1e293b', // Elevated card background
          800: '#283548', // Card hover / border
          700: '#334155', // Structural divider
          600: '#475569', // Subtle labels
          500: '#64748b', // Secondary text
          400: '#94a3b8', // Muted text
          accent: '#2563eb', // Enterprise royal blue
          neon: '#3b82f6',   // Clean cobalt blue
          danger: '#dc2626', // Authoritative red
          warning: '#d97706',// Corporate amber
          success: '#059669',// Forest enterprise emerald
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'enterprise': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'enterprise-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
