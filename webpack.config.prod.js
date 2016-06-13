var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ // 压缩js插件
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(), // 通过一些计算方式减少chunk的大小的插件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: chunks, // 所有入口文件 数组
      minChunks: chunks.length // 提取所有entry共同依赖的模块
    }),
    new HtmlWebpackPlugin({ // html生成插件
      template: './src/index.html',
      hash: false,
      favicon: './src/favicon.ico',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    }),
    // css 提取插件
    new ExtractTextPlugin('reiki.[contenthash].css', {
      allChunks: true // 所有css打包到一个文件
    })
  ],
  module: {
    loaders: [//加载器
      { // 从js 提取分离 css
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css!less')
      }, { // 加载字体，svg文件
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, { // 转换 8k 以下的图片为 base64,减少请求
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
      },{  // 模板引擎loader
        test: /\.handlebars$/,
        loader: __dirname + "/../../?helperDirs[]=" + __dirname + "/helpers"
      }
    ]
  }
}
