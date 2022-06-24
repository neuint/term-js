const { identity } = require('lodash');
const copy = require('rollup-plugin-copy');

const pkg = require('./package.json');

const BUILD = !process.argv.includes('-w');
const baseConfig = require('../../rollup.config.js')(BUILD, pkg);

module.exports = {
  ...baseConfig,
  input: BUILD ? './src/Term/index.ts' : './src/index.ts',
  plugins: [
    ...baseConfig.plugins,
    copy({
      targets: [
        BUILD ? null : { src: 'src/TermJS/assets', dest: 'serve' },
      ].filter(identity),
    }),
  ],
};
