module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          darkest: '#4c005a',
          darker: '#6a1292',
          dark: '#8436a1',
          DEFAULT: '#a34bb4',
          light: '#de70ec',
          gold: '#FA9B00',
          blue: '#15195A', // Visa blue color
        },
      },
    },
  },
  plugins: [],
};
