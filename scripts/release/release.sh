#!/bin/bash

node ./scripts/release/updateVersion.js $1

cd packages/term-js
yarn install
yarn build
git add .
git commit -m "build term-js"
npm publish --access public


cd ../status-bar-plugin
yarn install
yarn build
git add .
git commit -m "build status-bar-plugin"
npm publish --access public

cd ../context-menu-plugin
yarn install
yarn build
git add .
git commit -m "build context-menu-plugin"
npm publish --access public

cd ../autocomplete-plugin
yarn install
yarn build
git add .
git commit -m "build autocomplete-plugin"
npm publish --access public

cd ../dropdown-plugin
yarn install
yarn build
git add .
git commit -m "build dropdown-plugin"
npm publish --access public

cd ../history-search-plugin
yarn install
yarn build
git add .
git commit -m "build history-search-plugin"
npm publish --access public

cd ../command-search-plugin
yarn install
yarn build
git add .
git commit -m "build command-search-plugin"
npm publish --access public

cd ../modals-plugin
yarn install
yarn build
git add .
git commit -m "build modals-plugin"
npm publish --access public

cd ../flows-plugin
yarn install
yarn build
git add .
git commit -m "build flows-plugin"
npm publish --access public

cd ../term-js-react
yarn install
yarn build
git add .
git commit -m "build term-js-react"
npm publish --access public

cd ../status-bar-plugin-react
yarn install
yarn build
git add .
git commit -m "build status-bar-plugin-react"
npm publish --access public

cd ../context-menu-plugin-react
yarn install
yarn build
git add .
git commit -m "build context-menu-plugin-react"
npm publish --access public

cd ../autocomplete-plugin-react
yarn install
yarn build
git add .
git commit -m "build autocomplete-plugin-react"
npm publish --access public

cd ../dropdown-plugin-react
yarn install
yarn build
git add .
git commit -m "build dropdown-plugin-react"
npm publish --access public

cd ../history-search-plugin-react
yarn install
yarn build
git add .
git commit -m "build history-search-plugin-react"
npm publish --access public

cd ../command-search-plugin-react
yarn install
yarn build
git add .
git commit -m "build command-search-plugin-react"
npm publish --access public

cd ../modals-plugin-react
yarn install
yarn build
git add .
git commit -m "build modals-plugin-react"
npm publish --access public

cd ../flows-plugin-react
yarn install
yarn build
git add .
git commit -m "build flows-plugin-react"
npm publish --access public

cd ../..

git add .

git commit -m "build"
