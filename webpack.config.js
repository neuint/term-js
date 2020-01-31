const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = typeof process.env.NODE_ENV !== undefined
  && process.env.NODE_ENV === 'production';

console.log('isProduction', isProduction);

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
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./'],
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
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
  },
  externals: {},
  plugins: [
    new MiniCssExtractPlugin({ filename: 'termjs.css' }),
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
