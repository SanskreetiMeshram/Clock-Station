/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          light: '#E6F7FF',
          DEFAULT: '#8EDBFF',
          dark: '#58B8F0',
        },
        train: {
          red: '#FF5A5F',
          yellow: '#FFD23F',
          green: '#3DDC84',
          blue: '#3A86FF',
          purple: '#8338EC',
          orange: '#FF9F1C',
        },
        clock: {
          face: '#FFF8E7',
          rim: '#FF9F1C',
          navy: '#1B2A49',
          hour: '#3A86FF',
          minute: '#FF5A5F',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
        sans: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'chunky': '0 6px 0 #1B2A49',
        'chunky-sm': '0 3px 0 #1B2A49',
        'chunky-active': '0 1px 0 #1B2A49',
        'board': 'inset 0 2px 4px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.25)',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        steam: {
          '0%': { transform: 'translate(0, 0) scale(0.4)', opacity: '0.8' },
          '100%': { transform: 'translate(-60px, -50px) scale(1.6)', opacity: '0' },
        },
        flip: {
          '0%': { transform: 'rotateX(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        wobble: 'wobble 400ms ease-in-out',
        steam: 'steam 1.5s ease-out forwards',
        flip: 'flip 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        bounceSubtle: 'bounceSubtle 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
