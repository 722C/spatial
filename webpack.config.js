var webpack = require('webpack');
var path = require('path');


module.exports = {
  entry: {
    bundle: './app.jsx'
  },
  output: {
    path: path.resolve('./dist'),
    publicPath: "/dist/",
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test   : /\.(png|jpg|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        exclude: /node_modules/,
        loader : 'file-loader'
      }
    ]
  }
};
