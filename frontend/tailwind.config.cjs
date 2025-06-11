/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // adjust if your source folder differs
    './**/*.{js,ts,jsx,tsx}', // for any additional JS/TS files
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['nord', 'dark', 'light'],
    darkTheme: 'dark',
  },
};
