module.exports = {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Montserrat','ui-sans-serif','system-ui'] },
      colors: {
        black: '#0A0A0A',
        graphite: '#1A1A1A',
        slate: '#2A2A2A',
        steel: '#3A3A3A',
        silver: '#C9CCD1',
        platinum: '#E6E7EA',
        white: '#FFFFFF'
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
        soft: '0 6px 18px rgba(0,0,0,0.25)'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22,1,0.36,1)'
      },
      keyframes: {
        fadePop: {
          '0%': { opacity: 0, transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        fadePop: 'fadePop 420ms smooth both'
      }
    }
  },
  plugins: []
}