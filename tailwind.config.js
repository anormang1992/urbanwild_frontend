module.exports = {
  purge:['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'logo': ["Shadows Into Light Two", 'cursive'],
      'primary': ["Montserrat", "sans"],
    },

    backgroundColor: theme => ({
       ...theme('colors'),
       'wild': '#589040',
       'urban': '#469cdd',
       'dark-blue': '#435B6B',
       'light-blue': '#A6CAE7',
       'pale': '#E9F0F8', 
    }),

    borderColor: theme => ({
      ...theme('colors'),
      'button-border': '#589040',
      'nav-border': '#469cdd',
    }),

    textColor: {
      'white': '#FFFFFF',
      'logo-urban': '#469cdd',
      'logo-wild': '#589040',
      'light-blue': '#A6CAE7'
    },

    inset: {
      '0': '0px',
      '1/8': '12.5%',
      '1/4': '25%',
      '3/8': '37.5%',
      '1/2': '50%',
      '5/8': '62.5%',
      '3/4': '75%',
      '7/8': '87.5%',
    }
  },

  variants: {
    extend: {},
  },

  plugins: []
}
