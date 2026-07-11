/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D1B3E',
        accent: '#1D9E75',
        'bg-main': '#F7F9FC',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
