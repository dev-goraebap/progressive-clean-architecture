/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      pretendard: 'Pretendard Variable, sans-serif',
      billieHarley: 'BillieHarley, sans-serif',
      gothamBold: 'Gotham-Bold, sans-serif',
    },
  },
  plugins: [require("daisyui")],
}