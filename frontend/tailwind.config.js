/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a5d1a', // Dark Green from screenshot
        secondary: '#f3f4f6',
        accent: '#eab308' // Gold/Yellow
      }
    },
  },
  plugins: [],
}