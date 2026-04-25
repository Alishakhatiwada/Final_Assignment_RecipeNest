/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A00',
          hover: '#E06C00',
          light: '#FFF1E6',
        },
        danger: '#E53E3E',
        success: '#38A169',
        warning: '#DD6B20',
        bg: {
          main: '#F8F9FA',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
        },
        text: {
          primary: '#1A202C',
          secondary: '#718096',
          muted: '#A0AEC0',
          light: '#FFFFFF'
        },
        borderColor: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
