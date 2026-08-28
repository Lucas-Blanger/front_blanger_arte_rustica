/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1EADA',
        paperDim: '#E7DEC8',
        ink: '#2E2013',
        walnut: '#4A3221',
        walnutLight: '#6B4A31',
        ember: '#A8461F',
        emberDark: '#8A3717',
        moss: '#5B6B45',
        mossDark: '#43502F',
        brass: '#B08D57',
        brassLight: '#D4BD8E',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        tag: '0 2px 0 0 rgba(46, 32, 19, 0.15), 0 10px 20px -8px rgba(46, 32, 19, 0.25)',
        lift: '0 18px 30px -14px rgba(46, 32, 19, 0.35)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
      },
      animation: {
        riseIn: 'riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        swing: 'swing 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
