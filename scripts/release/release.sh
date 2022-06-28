#!/bin/bash

node ./scripts/release/updateVersion.js

cd packages/term-js
yarn build

cd ../status-bar-plugin
yarn build

cd ../context-menu-plugin
yarn build

cd ../autocomplete-plugin
yarn build

cd ../dropdown-plugin
yarn build

cd ../history-search-plugin
yarn build

cd ../command-search-plugin
yarn build

cd ../modals-plugin
yarn build
