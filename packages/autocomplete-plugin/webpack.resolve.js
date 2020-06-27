/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@Autocomplete': path.resolve(__dirname, 'src/Autocomplete'),
      '@general': path.resolve(__dirname, '../../general'),
    },
  },
};
