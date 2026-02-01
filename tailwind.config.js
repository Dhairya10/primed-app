/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink': {
          950: '#000000',
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
          600: '#404040',
        },
      },
      animation: {
        'float': 'float 20s infinite linear',
        'scroll': 'scroll 1.5s infinite',
        'shimmer': 'shimmer 3s infinite linear',
        'spin-slow': 'spin-slow 20s infinite linear',
        'spin-medium': 'spin 2s linear infinite',
        'spin-reverse': 'spin-reverse 15s infinite linear',
        'flash': 'flash 1s infinite',
        'in': 'in 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-from-bottom-2': 'slide-in-from-bottom-2 0.2s ease-out',
        'ripple': 'ripple 0.6s ease-out',
        'wave': 'wave 1s ease-out infinite',
        'wave-slow': 'wave 2s ease-out infinite',
        'scale-in': 'scale-in 0.3s ease-out',
        'check': 'check 0.3s ease-out',
        'particle': 'particle 0.6s ease-out forwards',
        'orbit': 'orbit 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-bottom-2': {
          '0%': { transform: 'translateY(0.5rem)' },
          '100%': { transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        wave: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.3' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        check: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        particle: {
          '0%': { transform: 'scale(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(-2rem)', opacity: '0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(2rem) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(2rem) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}
