import rimraf from 'rimraf';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

rimraf.sync('dist');

const pkg = require('./package.json');
const version = pkg.version;
const isDev = process.env.ROLLUP_WATCH;

export default {
  input: ['src/scripts/main.js'],
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  watch: {
    include: ['src/**'],
  },
  plugins: [
    eslint(),
    replace({
      delimiters: ['{{', '}}'],
      version: version,
    }),
    copy({
      targets: [
        { src: 'src/static/*.html', dest: 'dist/' },
        { src: 'src/static/images', dest: 'dist/images' },
      ],
    }),
    !isDev && terser(), // minify, but only in production
    isDev &&
      serve({
        open: true,
        contentBase: ['dist'],
        openPage: '/index.html',
        historyApiFallback: '/index.html',
      }),
    isDev && livereload(),
  ],
};
