const { identity } = require('lodash');
const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const url = require('rollup-plugin-url');
const svgr = require('@svgr/rollup');
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const postcss = require('rollup-plugin-postcss');
const { string } = require('rollup-plugin-string');
const sourcemaps = require('rollup-plugin-sourcemaps');
const { terser } = require('rollup-plugin-terser');

module.exports = (build, pkg) => ({
  watch: {
    exclude: ['node_modules/**'],
  },
  external: build ? Object.keys(pkg.dependencies) : [],
  output: [
    {
      file: build ? pkg.main : 'serve/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: !build,
    },
    {
      file: build ? pkg.main : 'serve/index.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: !build,
    },
  ],
  plugins: [
    external(),
    url(),
    svgr(),
    string({
      include: "../**/*.html",
      exclude: ["../**/index.html"],
    }),
    postcss({
      minimize: build,
      use: ['sass'],
      extract: build ? path.resolve('dist/index.css') : path.resolve('serve/index.css'),
    }),
    nodeResolve({
      ain: true,
      browser: true,
      preferBuiltins: false,
    }),
    copy({
      targets: [
        build ? null : { src: 'src/index.html', dest: 'serve' },
      ].filter(identity),
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: build ? 'tsconfig.json' : 'tsconfig.dev.json'
    }),
    commonjs(),
    build ? null : sourcemaps(),
    build ? terser() : null,
    build ? null : serve({
      contentBase: 'serve',
      host: 'localhost',
      port: 10001,
    }),
  ].filter(identity),
});
