const path = require('path');

const { ROOT_DIR } = require('./constants');
const { readFile, writeFile } = require('../utils/fs');

const args = process.argv;

const getNewVersion = (version) => {
  let [major, minor, patch] = version.split('.').map(Number);
  if (args.includes('-major')) {
    major += 1;
  } else if (args.includes('-minor')) {
    minor += 1;
  } else {
    patch += 1;
  }
  return [major, minor, patch].join('.');
};

const PACKAGES = [
  'term-js',
  'status-bar-plugin',
  'context-menu-plugin',
  'autocomplete-plugin',
  'dropdown-plugin',
  'history-search-plugin',
  'command-search-plugin',
  'modals-plugin',
  'flows-plugin',
  'term-js-react',
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
  const rootPackage = await readFile(path.join(ROOT_DIR, 'package.json'), true);
  const { version } = rootPackage;
  const newVersion = getNewVersion(version);
  rootPackage.version = newVersion;
  await writeFile(path.join(ROOT_DIR, 'package.json'), JSON.stringify(rootPackage, null, 2));
  return Promise.all(PACKAGES.map((name) => updatePackageVersion(name, newVersion)));
};

start();
