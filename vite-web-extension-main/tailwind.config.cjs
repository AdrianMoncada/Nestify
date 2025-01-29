module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      colors: {
        darkBrown: "#483626",
        brown: "#75634F",
        lightBrown: "#957F66",
        red: "#ED834D",
        darkRed: "#CA6F41",
        green: "#E3DC6A",
        greenLight: "#F5EF89",
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
  plugins: [],
}
