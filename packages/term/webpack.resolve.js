/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@Term': path.resolve(__dirname, 'src/Term'),
      '@general': path.resolve(__dirname, '../../general'),
    },
  },
};
