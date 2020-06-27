/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@HistorySearch': path.resolve(__dirname, 'src/HistorySearch'),
      '@general': path.resolve(__dirname, '../../general'),
    },
  },
};
