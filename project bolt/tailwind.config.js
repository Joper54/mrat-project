/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eaf4',
          100: '#ccd5e9',
          200: '#99abe0',
          300: '#6681d4',
          400: '#3357c9',
          500: '#0F52BA',
          600: '#0c4295',
          700: '#09316f',
          800: '#06214a',
          900: '#031025',
        },
        secondary: {
          50: '#e7f2ee',
          100: '#cfe5dd',
          200: '#9ecbbb',
          300: '#6eb198',
          400: '#3d9776',
          500: '#0A8754',
          600: '#086c43',
          700: '#065132',
          800: '#043622',
          900: '#021b11',
        },
        accent: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#FFC72C',
          600: '#cc9f23',
          700: '#99771a',
          800: '#665011',
          900: '#332809',
        },
        warning: {
          50: '#fff4e6',
          100: '#ffe9cc',
          200: '#ffd399',
          300: '#ffbc66',
          400: '#ffa633',
          500: '#FFA500',
          600: '#cc8400',
          700: '#996300',
          800: '#664200',
          900: '#332100',
        },
        danger: {
          50: '#f9e7e7',
          100: '#f4d0d0',
          200: '#e9a0a0',
          300: '#dd7171',
          400: '#d24242',
          500: '#D22B2B',
          600: '#a82222',
          700: '#7e1a1a',
          800: '#541111',
          900: '#2a0909',
        },
        neutral: {
          850: '#1f2937',
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};