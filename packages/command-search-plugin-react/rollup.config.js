const react = require('react');
const reactDom = require('react-dom');

const { babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');

const pkg = require('./package.json');

const BUILD = !process.argv.includes('-w');
const baseConfig = require('../../rollup.config.js')(BUILD, pkg, {
  namedExports: {
    react: Object.keys(react),
    'react-dom': Object.keys(reactDom),
  },
});

module.exports = {
  ...baseConfig,
  input: BUILD ? './src/CommandSearchComponent/index.tsx' : './src/index.tsx',
  plugins: [
    babel({
      presets: ['@babel/preset-react'],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    ...baseConfig.plugins,
  ],
};
