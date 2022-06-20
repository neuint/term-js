const { identity } = require('lodash');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const url = require('rollup-plugin-url');
const svgr = require('@svgr/rollup');
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const postcss = require('rollup-plugin-postcss');
const { string } = require('rollup-plugin-string');
const sourcemaps = require('rollup-plugin-sourcemaps');

const pkg = require('./package.json');

const BUILD = !process.argv.includes('-w');

module.exports = {
  input: BUILD ? './src/StatusBar/index.ts' : './src/index.ts',
  watch: {
    exclude: ['node_modules/**'],
  },
  external: BUILD ? Object.keys(pkg.dependencies) : [],
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
    babel({ babelHelpers: 'bundled' }),
    nodeResolve({
      ain: true,
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    url(),
    svgr(),
    string({ include: "../**/*.html", exclude: ["**/index.html"] }),
    postcss({ extract: false, modules: true, use: ['sass'] }),
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
    BUILD ? null : sourcemaps(),
    BUILD ? null : serve({ contentBase: 'serve', host: 'localhost', port: 10001 }),
  ].filter(identity),
};
