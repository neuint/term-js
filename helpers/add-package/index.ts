import * as path from 'path';

import { getInput } from './terminal';
import { PACKAGES_PATH, WEBPACK_RESOLVE_PATH, INCORRECT_NAME_ERROR } from './constants';
import { mkDir, appendText } from './fs';

const COPY_LIST: (string | { from: string; to: string })[] = [
  'package.json',
  '.babelrc',
  'LICENSE',
  'README.md',
  'tsconfig.json',
  'tslint.json',
  'webpack.config.js',
  'webpack.const.js',
  'webpack.resolve.js',
  'tests/__mocks__/styleMock.js',
  { from: 'typings/declarations.d.tts', to: 'typings/declarations.d.ts' },
  { from: 'tests/__mocks__/styleMock.js', to: 'typings/declarations.d.ts' },
];

getInput([
  'Enter package name:',
  'Enter package alias [{{$0}}]:',
]).then((data: string[]) => {
  const [name, setAlias] = data;
  if (!name) return Promise.reject(new Error(INCORRECT_NAME_ERROR));
  const alias = setAlias || name;
  const aliasPath = `packages/${name}/src/${alias}`;
  return mkDir(path.join(PACKAGES_PATH, name))
    .then(() => appendText(
      WEBPACK_RESOLVE_PATH,
      `\n      '@${alias}': path.resolve(__dirname, '${aliasPath}'),`,
      'alias: {',
    ));
}).catch((err: Error) => {
  console.error(err.message);
  process.exit(0);
});
