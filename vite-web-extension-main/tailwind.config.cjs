module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' }
        }
      },
      textShadow: {
        'thick': '0.1px 0 0 currentColor',
        'thicker': '0.1px 0 0 currentColor, -0.1px 0 0 currentColor',
      },
      fontFamily: {
        'chilanka': ['Chilanka', 'cursive']
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        shake: 'shake 0.8s ease-in-out'
      },
      colors: {
        darkBrown: "#483626",
        brown: "#75634F",
        lightBrown: "#957F66",
        red: "#D44646",
        darkRed: "#B33B3B",
        lightRed: "#DC6B6B",
        green: "#E3DC6A",
        lightGreen: "#F5EF89",
        darkGreen: "#A1AD5E",
        yellow: "#FDD176",
        yellowLight: "#FFDA8C",
        yellowDark: "#DAB466",
        blueCloud: "#E7F5E4",
        blueSky: "#BFF7CE",
        white: "#FFFFFF"
      }
    },
  },
  prefix: '',
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-thick': {
          'text-shadow': '0.1px 0 0 currentColor',
        },
        '.text-thicker': {
          'text-shadow': '0.1px 0 0 currentColor, -0.1px 0 0 currentColor',
        },
      })
    }
  ],
}
