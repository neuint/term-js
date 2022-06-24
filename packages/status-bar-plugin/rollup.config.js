const BUILD = !process.argv.includes('-w');
const pkg = require('./package.json');

const baseConfig = require('../../rollup.config.js')(BUILD, pkg);

module.exports = {
  ...baseConfig,
  input: BUILD ? './src/StatusBar/index.ts' : './src/index.ts',
};
