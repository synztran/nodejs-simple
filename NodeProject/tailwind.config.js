const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./views/**/*.ejs', './views/*.ejs'],
  mode: 'jit',
  theme: {
    extend: {
      fontSize: {
        10: '10px',
        12: '12px',
        16: '16px',
        18: '18px',
        24: '24px',
      },
      borderRadius: {
        2: '2px',
        6: '6px',
      },
      colors: {
        fuschiha: colors.fuchsia,
        orange: colors.orange,
        rose: colors.rose,
        teal: colors.teal,
        bermuda: '#78dcca',
        red: '#111',
        blgreen: '#8db48e',
        bdgreen: '#4d724d',
      },
    },
  },
  variants: {},
  plugins: [],
};
