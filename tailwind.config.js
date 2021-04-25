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
    extend: {
      transitionProperty: {
        height: 'height',
      },
    },
    darkMode: 'media',
    colors: {
      white: '#ffffff',
      blue: {
        medium: '#005c98',
        darker: '#1e40af',
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
        medium: '#808080',
      },
      red: {
        primary: '#ed4956',
        secundary: '#ff5c68',
      },
      green: {
        primary: '#10b981',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      fill: ['hover'],
    },
  },
};
