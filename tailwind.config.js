/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0e14',
          surface: '#151a21',
          border: '#1f2937',
        },
        claude: {
          purple: {
            light: '#a78bfa',
            DEFAULT: '#8b5cf6',
            dark: '#7c3aed',
          },
          green: {
            light: '#6ee7b7',
            DEFAULT: '#34d399',
            dark: '#10b981',
          },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

