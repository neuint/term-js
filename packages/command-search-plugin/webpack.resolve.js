/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@CommandSearch': path.resolve(__dirname, 'src/CommandSearch'),
      '@general': path.resolve(__dirname, '../../general'),
    },
  },
};
