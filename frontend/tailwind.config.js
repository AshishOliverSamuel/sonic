/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sonic: {
          main: '#121212',
          secondary: '#181818',
          elevated: '#242424',
          sidebar: '#000000',
          player: '#181818',
          green: '#1DB954',
          border: '#282828',
          muted: '#B3B3B3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 14px 40px rgba(29, 185, 84, 0.18)',
      },
    },
  },
  plugins: [],
};

