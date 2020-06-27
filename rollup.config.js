import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import html from "rollup-plugin-html";
import babel from 'rollup-plugin-babel';
import md5 from 'md5';

export default ({ pkg, cssBlackList = [] }) => {
  const PACKAGE_NAME = pkg.name.replace('@term-js/', '');
  const SPLIT_PATTERN = new RegExp(`\\/${PACKAGE_NAME}\\/`);
  const externalDependencies = Object.keys(pkg.dependencies);

  return {
    input: 'src/index.ts',
    external: externalDependencies,
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
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
        modules: {
          generateScopedName: (name, filename) => {
            if (cssBlackList.some((item) => filename.includes(item)
              || name.includes(item))) {
              return name;
            }
            return `${name}-${PACKAGE_NAME}-️${md5(filename.split(SPLIT_PATTERN)[1])}`
          },
        },
        use: [['sass', { includePaths: [path.resolve(__dirname, '../../general/styles')] }]],
      }),
      url(),
      resolve(),
      typescript({
        rollupCommonJSResolveHack: true,
        clean: true,
        tsconfig: 'tsconfig.json',
        include: ['../../general/**/*.ts', 'src/**/*.ts'],
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
    ],
  };
};
