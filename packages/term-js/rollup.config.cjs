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
const scss = require('rollup-plugin-scss');

const pkg = require('./package.json');

const BUILD = !process.argv.includes('dev_server');

module.exports = {
  input: BUILD ? './src/TermJS/index.ts' : './src/index.ts',
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
    scss({
      output: (styles) => {
        writeFileSync(BUILD ? './dist/index.css' : './serve/index.css', styles);
      }
    }),
    resolve(),
    copy({
      targets: [
        BUILD ? null : { src: 'src/index.html', dest: 'serve' },
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
  ].filter(identity),
};
