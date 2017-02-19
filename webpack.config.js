// TODO: find out what is hot module replacement
// TODO: find out why ExtractTextPlugin didn`t work (see docs opened in mozilla)
// bluebird - lib for working with promises
global.Promise = require('bluebird');

const webpack = require('webpack'),
  path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin');

var publicPath = 'http://localhost:8050/public/assets',
  cssName = process.env.NODE_ENV === 'production' ? 'styles-[hash].css' : 'styles.css',
  jsName = process.env.NODE_ENV === 'production'? 'bundle-[hash].js' : 'bundle.js';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  new ExtractTextPlugin(cssName)
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new CleanWebpackPlugin(['public/assets/'], {
      root: __dirname,
      verbose: true,
      dry: false
    })
  );
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

module.exports = {
  entry: './src/client.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins,

  output: {
    path: path.resolve(__dirname, './public/assets/'),
    filename: jsName,
    publicPath
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader'})
      },

      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader!less'})
      },

      {
        test: /\.jsx$|\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: ['/node_modules/', '/public/']
      },

      {
        test: /\.json$/,
        use: 'json-loader'
      },

      { test: /\.gif$/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
      { test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.svg/, loader: 'url-loader?limit=26000&mimetype=image/svg+xml' },
      { test: /\.(woff|woff2|ttf|eot)/, loader: 'url-loader?limit=1' }
    ]
  },

  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : null,

  devServer: {
    headers: {'Access-Control-Allow-Origin': '*'}
  }
};
