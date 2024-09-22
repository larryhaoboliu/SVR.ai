/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // This ensures Tailwind purges unused styles
  darkMode: false, // You can set it to 'media' or 'class' if you want dark mode support
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
