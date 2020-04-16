/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@ContextMenu': path.resolve(__dirname, 'packages/context-menu-plugin/src/ContextMenu'),
      '@Term': path.resolve(__dirname, 'packages/term/src/Term'),
      '@Autocomplete': path.resolve(__dirname, 'packages/autocomplete-plugin/src/Autocomplete'),
    },
  },
};
