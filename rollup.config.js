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
const replacement = require('@rollup/plugin-alias');

const generalPath = path.join(__dirname, 'general');
const customResolver = nodeResolve({
  extensions: ['.scss', 'ts', '.js', '.json'],
});

const alias = {
  '@styles/theme': path.join(generalPath, 'styles/theme.scss'),
  '@styles/variables': path.join(generalPath, 'styles/variables.scss'),
  '@styles/mixins': path.join(generalPath, 'styles/mixins.scss'),
  '@styles/functions': path.join(generalPath, 'styles/functions.scss'),
  '@styles/constants': path.join(generalPath, 'styles/constants.scss'),
  '@styles/components': path.join(generalPath, 'styles/components.scss'),
};

module.exports = (build, pkg, commonProps) => ({
  watch: {
    exclude: ['node_modules/**', './**/node_modules/**'],
  },
  external: build ? Object.keys(pkg.dependencies) : [],
  output: [
    {
      file: build ? pkg.main : 'serve/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: !build,
    },
  ],
  plugins: [
    external(),
    url(),
    svgr(),
    {
      name: 'preprocess',
      transform: (code, id) => {
        if (!/\.scss$/i.test(id)) return code;
        Object.keys(alias).forEach((key) => {
          const regex = new RegExp(key, 'g');
          // eslint-disable-next-line no-param-reassign
          code = code.replace(regex, alias[key]);
        });
        return code;
      },
    },
    string({
      include: '../**/*.html',
      exclude: ['../**/index.html'],
    }),
    replacement({
      entries: [
        { find: /^@general/, replacement: generalPath },
      ],
    }, customResolver),
    postcss({
      minimize: build,
      use: ['sass'],
      ...(build ? { extract: path.resolve('dist/index.css') } : { extract: false }),
    }),
    nodeResolve({
      ain: true,
      browser: true,
      preferBuiltins: false,
      extensions: ['.ts', '.tsx', '.json'],
    }),
    copy({
      targets: [
        build ? null : { src: 'src/index.html', dest: 'serve' },
      ].filter(identity),
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: build ? 'tsconfig.json' : 'tsconfig.dev.json',
    }),
    commonjs(commonProps),
    build ? null : sourcemaps(),
    build ? terser() : null,
    build ? null : serve({
      contentBase: 'serve',
      host: 'localhost',
      port: 10001,
    }),
  ].filter(identity),
});
