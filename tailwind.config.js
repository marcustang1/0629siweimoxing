/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'card': 'var(--color-card)',
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': ({ opacityValue }) => {
          return opacityValue
            ? `rgba(var(--color-accent-rgb), ${opacityValue})`
            : `rgb(var(--color-accent-rgb))`;
        },
      },
      boxShadow: {
        'accent-lg': '0 10px 25px -3px rgb(var(--color-accent-rgb) / 0.2)',
      }
    },
  },
  plugins: [],
}