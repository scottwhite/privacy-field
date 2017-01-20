const path = require('path');
const webpack = require('webpack'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: true, unused: false}
    })  
  ],
  //todo: get this working I guessssssssss
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'Bacon Pants',
  //     inject: 'head',
  //     showErrors: true,
  //     tenmplate: 'src/index.html'
  //   })
  // ],
  devServer: {
    host: '0.0.0.0',
    hot: true,
    compress: true,
    port: 3000
  }
}