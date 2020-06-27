const configGenerator = require('../../webpack.config');

const { CSS_MODULES_BLACK_LIST } = require('./webpack.const');
const { resolve } = require('./webpack.resolve');

module.exports = configGenerator({
  resolve,
  root: __dirname,
  cssBlackList: CSS_MODULES_BLACK_LIST,
  scss: {
    includePaths: ['./src/CommandSearch'],
    outputFileName: 'term-js-command-search-plugin.css',
  },
});
