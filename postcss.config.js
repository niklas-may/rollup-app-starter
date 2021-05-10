const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isDev = process.env.ROLLUP_WATCH;

module.exports = {
  plugins: [postcssImport(), autoprefixer(), !isDev && cssnano()],
};
