module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    content: ['./src/**/*.js', './src/**/**/*.js'],
  },
  theme: {
    fill: (theme) => ({
      red: theme('colors.red.primary'),
      lightRed: theme('colors.red.secundary'),
    }),
    colors: {
      white: '#ffffff',
      blue: {
        medium: '#005c98',
        light: '#72bcd4',
      },
      black: {
        light: '#262626',
        faded: '#00000059',
      },
      gray: {
        base: '#616161',
        background: '#fafafa',
        primary: '#dbdbdb',
      },
      red: {
        primary: '#ed4956',
        secundary: '#ff5c68',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
};
