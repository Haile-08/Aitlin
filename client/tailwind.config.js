import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'banner-color': '#F2F6FE',
        'primary-color': '#394180',
        'primary-on-hover': '#313870',
        'switch-btn': '#4d5597',
        'error': '#e84118',
      }
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    },
    fontWeight: {
      thin: '100',
      hairline: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      'extra-bold': '800',
      black: '900',
    }
  },
  plugins: [
    scrollbar,
  ],
}

