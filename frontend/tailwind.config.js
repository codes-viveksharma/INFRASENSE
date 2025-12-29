/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Add this line - enables class-based dark mode
  theme: {
    extend: {
      colors: {
        'smart-blue': '#0066cc',
        'smart-green': '#00cc88',
        'smart-yellow': '#ffaa00',
        'smart-red': '#ff4444',
        // Dark mode colors
        'dark-bg': '#0f172a',
        // lighter dark card so content remains readable against it
        'dark-card': '#374151',
        'dark-text': '#f1f5f9',
        'dark-border': '#334155',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'theme-switch': 'theme-switch 0.3s ease-in-out',
      },
      keyframes: {
        'theme-switch': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}