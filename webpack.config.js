var fs = require('fs');
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var production = (process.env.NODE_ENV === 'production')

//循环文件夹内的文件
function foreachFolder(path, cb){
    var folder_exists = fs.existsSync(path);
    var fileList = [];
    if(folder_exists == true)
    {
       var dirList = fs.readdirSync(path);
       dirList.forEach(function(fileName){
            fileList.push([fileName, path+fileName]);
       });
    };
    return cb(fileList);
}
//获取entry
var getCfgEntry = function(){
    var entry = {};
    foreachFolder('./src/page/',function(list){
      list.forEach(function(item){
        entry[item[0]] = [item[1]]
      })
    });
    return entry;
}();

var chunks = Object.keys(getCfgEntry);
var entries = (function(){
  if (!production) { // 添加热加载
    chunks.forEach(function(key) {
      getCfgEntry[key].push('webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server')
    })
  }
  return getCfgEntry
})()

var webpackConfigs = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
		chunkFilename: 'js/[chunkhash].js'
  },
  resolve: {
    root: [
      path.resolve('src')
    ],
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(), // 通过一些计算方式减少chunk的大小的插件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: chunks, // 所有入口文件 数组
      minChunks: chunks.length // 提取所有entry共同依赖的模块
    }),
    // css 提取插件
    new ExtractTextPlugin('css/reiki.[contenthash].css', {
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
        loader: ExtractTextPlugin.extract('style', 'css!less')
      }, { // 加载字体，svg文件
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, { // 转换 8k 以下的图片为 base64,减少请求
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
      },{  // 模板引擎loader
        test: /\.handlebars$/,
        loader: "handlebars"
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ]
  },
  babel: { //配置babel
    presets: ['es2015', 'stage-0'],
    plugins: ["transform-runtime"]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    inline: true
    // port: '8080'
  }
}

chunks.forEach(function(pathname) {
  webpackConfigs.plugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      // favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './' + pathname + '.html', //生成的html存放路径，相对于path
      template: './src/page/index/index.html', //html模板路径
      inject: 'body', //js插入的位置，true/'head'/'body'/false
      hash: false, //为静态资源生成hash值
      chunks: ['vendors', pathname],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: false, //删除空白符与换行符
          ignoreCustomFragments:[
              /\{\{[\s\S]*?\}\}/g  //不处理 {{}} 里面的 内容
          ]
      }
  }));
});
if (production) { // 生产环境
  webpackConfigs.plugins.push(new webpack.optimize.UglifyJsPlugin({ // 压缩js插件
    compressor: {
      warnings: false,
    },
  }));
} else { // 开发环境
  // 添加 source-map
  webpackConfigs.devtool = 'source-map';
  // 添加热加载
  webpackConfigs.plugins.push(new webpack.HotModuleReplacementPlugin());
}
module.exports = webpackConfigs