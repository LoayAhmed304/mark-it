const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

/** @type {import ('postcss').ProcessOptions} */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
