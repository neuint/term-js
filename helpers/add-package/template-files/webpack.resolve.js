/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@{{alias}}': path.resolve(__dirname, 'src/{{alias}}'),
    },
  },
};
