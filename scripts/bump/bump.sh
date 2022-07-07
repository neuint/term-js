#!/bin/bash

ncu -u

cd packages/term-js
ncu -u


cd ../status-bar-plugin
ncu -u

cd ../context-menu-plugin
ncu -u

cd ../autocomplete-plugin
ncu -u

cd ../dropdown-plugin
ncu -u

cd ../history-search-plugin
ncu -u

cd ../command-search-plugin
ncu -u

cd ../modals-plugin
ncu -u

cd ../flows-plugin
ncu -u

cd ../term-js-react
ncu -u

cd ../status-bar-plugin-react
ncu -u

cd ../context-menu-plugin-react
ncu -u

cd ../dropdown-plugin-react
ncu -u

cd ../autocomplete-plugin-react
ncu -u

cd ../..

yarn install
