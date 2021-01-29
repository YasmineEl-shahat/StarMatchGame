const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
  },
  entry: {
    main: ['./src/renderers/dom.js'],
  },
  output: {
    path: path.resolve('public', 'bundles'),
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
    }),
    function (compiler) {
      compiler.hooks.done.tap('Reactful', (stats) => {
        let gVars = {};
        try {
          gVars = require('./.reactful.json');
        } catch (err) {
          // do nothing
        }
        fs.writeFileSync(
          path.resolve('.reactful.json'),
          JSON.stringify(
            Object.assign({}, gVars, stats.toJson()['assetsByChunkName']),
            null,
            2,
          ),
        );
      });
    },
  ],
};

module.exports = config;
