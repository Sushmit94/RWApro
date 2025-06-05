// postcss.config.js (or .cjs)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- This is the correct way
    autoprefixer: {},
  },
};