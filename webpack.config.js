require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');

module.exports = {
  stats:{
    errorDetails: true
  },
  entry: './privacy-field.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:'privacy-field.min.js'
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
      }),
      new CopyWebpackPlugin([{
        from: 'privacy-field.js', to: 'privacy-field.js'
      }]),
      new S3Plugin({
        include: /.*\.js/,
        s3Options: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        },
        s3UploadOptions: {
          Bucket: process.env.AWS_BUCKET,
          CacheControl(filename){
            return 'no-store'
          }
        }
      })
    ]
  ,
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
