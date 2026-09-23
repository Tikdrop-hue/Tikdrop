/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00b87c',
          hover: '#00d08c',
          dark: '#009262',
          muted: '#008558',
          bg: 'rgba(0, 184, 124, 0.12)'
        },
        dark: {
          950: '#111215',
          900: '#181a20',
          850: '#20232c',
          800: '#282c38',
          750: '#323746'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        'nav': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      }
    }
  },
  plugins: [],
}