const path = require('path');

const { ROOT_DIR } = require('./constants');
const { readFile, writeFile } = require('../utils/fs');

const PACKAGES = [
  'term-js',
  'status-bar-plugin',
  'context-menu-plugin',
  'autocomplete-plugin',
  'dropdown-plugin',
  'history-search-plugin',
  'command-search-plugin',
  'modals-plugin',
];

const updatePackageVersion = async (name, newVersion) => {
  const packagePath = path.join(ROOT_DIR, 'packages', name, 'package.json');
  const checkPackage = await readFile(packagePath, true);
  checkPackage.version = newVersion;
  PACKAGES.forEach((packageName) => {
    const search = ['@neuint', packageName].join('/');
    if (checkPackage.dependencies[search]) {
      checkPackage.dependencies[search] = `^${newVersion}`;
    }
  });
  return writeFile(packagePath, JSON.stringify(checkPackage, null, 2));
};

const start = async () => {
  console.log(path.join(ROOT_DIR, 'package.json'));
  const rootPackage = await readFile(path.join(ROOT_DIR, 'package.json'), true);
  const { version } = rootPackage;
  const [major, minor] = version.split('.').map(Number);
  const newVersion = `${major}.${minor + 1}.0`;
  rootPackage.version = newVersion;
  await writeFile(path.join(ROOT_DIR, 'package.json'), JSON.stringify(rootPackage, null, 2));
  return Promise.all(PACKAGES.map((name) => updatePackageVersion(name, newVersion)));
};

start();
