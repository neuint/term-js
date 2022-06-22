const pkg = require('./package.json');
const BUILD = !process.argv.includes('-w');

const baseConfig = require('../../rollup.config.cjs')(BUILD, pkg);

module.exports = {
  ...baseConfig,
  input: BUILD ? './src/Modals/index.ts' : './src/index.ts',
};
