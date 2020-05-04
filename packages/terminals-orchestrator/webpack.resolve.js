/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@TerminalsOrchestrator': path.resolve(__dirname, 'src/TerminalsOrchestrator'),
      'utils': path.resolve(__dirname, '../../general/utils'),
    },
  },
};
