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
          bg: '#0B1120',       // Main background: Deep charcoal navy
          surface: '#111827',  // Secondary background
          card: '#151E2E',     // Card background
          elevated: '#1A2537', // Elevated card / modal
          border: 'rgba(255, 255, 255, 0.08)',
          blue: '#3B82F6',     // Primary electric blue
          blueHover: '#60A5FA',// Primary hover
          cyan: '#22D3EE',     // Secondary accent cyan
          success: '#22C55E',  // Success green
          warning: '#F59E0B',  // Warning amber
          danger: '#EF4444',   // Danger red
          
          // Legacy mappings preserved for backward compatibility
          950: '#0B1120',
          900: '#111827',
          850: '#151E2E',
          800: '#1A2537',
          700: '#26354D',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          accent: '#3B82F6',
          neon: '#22D3EE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'enterprise': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'enterprise-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        'subtle-blue': '0 0 20px -3px rgba(59, 130, 246, 0.15)',
        'subtle-danger': '0 0 20px -3px rgba(239, 68, 68, 0.2)',
        'subtle-success': '0 0 20px -3px rgba(34, 197, 94, 0.15)',
      }
    },
  },
  plugins: [],
}
