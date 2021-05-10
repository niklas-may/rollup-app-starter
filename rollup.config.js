import rimraf from 'rimraf';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import eslint from '@rollup/plugin-eslint';
import progress from 'rollup-plugin-progress';
import sizes from 'rollup-plugin-sizes';
import watchAssets from 'rollup-plugin-watch-assets';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';

rimraf.sync('dist/*');

const pkg = require('./package.json');

const { version } = pkg;
const isDev = process.env.ROLLUP_WATCH;

export default {
  input: ['src/scripts/main.js'],
  output: {
    file: 'dist/bundle.js',
    format: isDev ? 'iife' : 'cjs',
    sourcemap: true,
    assetFileNames: (assetInfo) =>
      assetInfo.name === 'index.css' ? 'styles.css' : 'assets/[name]-[hash][extname]',
  },
  plugins: [
    progress(),
    watchAssets({ assets: ['src/static/*.html'] }),
    copy({
      targets: [
        { src: 'src/static/*.html', dest: 'dist' },
        { src: 'src/static/media', dest: 'dist' },
      ],
    }),
    styles({
      mode: ['extract', 'index.css'],
    }),
    replace({
      delimiters: ['{{', '}}'],
      version,
    }),
    !isDev &&
      getBabelOutputPlugin({
        presets: ['@babel/preset-env'],
      }),
    !isDev && terser(),
    isDev &&
      serve({
        open: true,
        contentBase: ['dist'],
        openPage: '/index.html',
        historyApiFallback: '/index.html',
      }),
    isDev && livereload(),
    isDev && eslint({ exclude: ['src/styles/**'] }),
    sizes(),
  ],
};
