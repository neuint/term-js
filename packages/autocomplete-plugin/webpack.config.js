const path = require('path');
const md5 = require('md5');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CSS_MODULES_BLACK_LIST } = require('./webpack.const');
const { resolve } = require('./webpack.resolve');

const isProduction = typeof process.env.NODE_ENV !== undefined
  && process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  target: 'web',
  entry: path.resolve(__dirname, isProduction ? './src/index.ts' : './src/index.ts'),
  devtool: isProduction ? false : 'inline-source-map',
  context: __dirname,

  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: ['awesome-typescript-loader?module=es6'],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: { publicPath: './assets/fonts', outputPath: './assets/fonts' },
        }]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent: (context, localIdentName, localName) => {
                  if (CSS_MODULES_BLACK_LIST.some((item) => context.resourcePath.includes(item)
                    || localName.includes(item))) {
                    return localName;
                  }
                  return isProduction
                    ? `${localName}-️${md5(context.resourcePath.split(/[\\/]Autocomplete[\\/]/)[1])}`
                    : `${localName}➖️${context.resourcePath.split(/[\\/]src[\\/]/)[1].replace(/\/[^/]+.scss/, '').replace(/\//g, '➡️')}`;
                },
              },
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./src/Autocomplete', './'],
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          { loader: 'html-loader', options: { minimize: isProduction } }
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
  },
  resolve,
  externals: {},
  plugins: [
    new MiniCssExtractPlugin({ filename: 'term-js-autocomplete-plugin.css' }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
    }),
    // ...(isProduction ? [] : [
    //   new HtmlWebpackPlugin({
    //     template: path.join(__dirname, './src/index.html'),
    //   }),
    // ]),
  ],
};
