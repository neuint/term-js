const pkg = require('./package.json');
const BUILD = !process.argv.includes('-w');

const baseConfig = require('../../rollup.config.js')(BUILD, pkg);

module.exports = {
  ...baseConfig,
  input: BUILD ? './src/Autocomplete/index.ts' : './src/index.ts',
};
