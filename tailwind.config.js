/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#800000',
        navy: '#001f3f',
        'light-maroon': '#a00000',
        'light-navy': '#003366'
      }
    },
  },
  plugins: [],
}
