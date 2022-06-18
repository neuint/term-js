const { writeFileSync } = require('fs');
const { identity } = require('lodash');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const resolve = require('rollup-plugin-node-resolve');
const url = require('rollup-plugin-url');
const svgr = require('@svgr/rollup');
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const postcss = require('rollup-plugin-postcss');
const { string } = require('rollup-plugin-string');
const sourcemaps = require('rollup-plugin-sourcemaps');

const pkg = require('./package.json');

const BUILD = !process.argv.includes('dev_server');

module.exports = {
  input: BUILD ? './src/Term/index.ts' : './src/index.ts',
  watch: {
    exclude: ['node_modules/**'],
  },
  output: [
    {
      file: BUILD ? pkg.main : 'serve/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: BUILD ? pkg.main : 'serve/index.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    url(),
    svgr(),
    string({
      include: "**/*.html",
      exclude: ["**/index.html"],
    }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    resolve({
      browser: true,
    }),
    copy({
      targets: [
        BUILD ? null : { src: 'src/index.html', dest: 'serve' },
        BUILD ? null : { src: 'src/TermJS/assets', dest: 'serve' },
      ].filter(identity),
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: BUILD ? 'tsconfig.json' : 'tsconfig.dev.json'
    }),
    commonjs(),
    BUILD ? null : serve({
      contentBase: 'serve',
      host: 'localhost',
      port: 10001,
    }),
    BUILD ? null : sourcemaps(),
  ].filter(identity),
};
