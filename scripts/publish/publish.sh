#!/bin/bash

cd packages/term-js
npm publish --access public

cd ../status-bar-plugin
npm publish --access public

cd ../context-menu-plugin
npm publish --access public

cd ../autocomplete-plugin
npm publish --access public

cd ../dropdown-plugin
npm publish --access public

cd ../history-search-plugin
npm publish --access public

cd ../command-search-plugin
npm publish --access public

cd ../modals-plugin
npm publish --access public
