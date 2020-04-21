/* eslint-disable quote-props */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@HistorySearch': path.resolve(__dirname, 'packages/history-search-plugin/src/HistorySearch'),
      '@Autocomplete': path.resolve(__dirname, 'packages/autocomplete-plugin/src/Autocomplete'),
      '@Dropdown': path.resolve(__dirname, 'packages/dropdown-plugin/src/Dropdown'),
      '@ContextMenu': path.resolve(__dirname, 'packages/context-menu-plugin/src/ContextMenu'),
      '@Term': path.resolve(__dirname, 'packages/term/src/Term'),
    },
  },
};
