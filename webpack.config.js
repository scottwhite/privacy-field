const path = require('path');
const webpack = require('webpack'); 

module.exports = {
  entry: './privacy_field.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:'privacy_field.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-3']
        }
      }
    ]
  }
}