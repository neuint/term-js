import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import html from "rollup-plugin-html";
import babel from 'rollup-plugin-babel';
import md5 from 'md5';

import pkg from './package.json';
import { CSS_MODULES_BLACK_LIST } from './rollup.const';

const PACKAGE_NAME = pkg.name.replace('@term-js/', '');
const SPLIT_PATTERN = new RegExp(`\\/${PACKAGE_NAME}\\/`);

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    html({
      include: '**/*.html'
    }),
    external(),
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true,
      modules: {
        generateScopedName: (name, filename) => {
          if (CSS_MODULES_BLACK_LIST.some((item) => filename.includes(item)
            || name.includes(item))) {
            return name;
          }
          return `${name}-${PACKAGE_NAME}-️${md5(filename.split(SPLIT_PATTERN)[1])}`
        },
      },
      use: ['sass'],
    }),
    url(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
  ]
};
