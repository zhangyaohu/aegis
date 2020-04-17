const WebpackMerge = require('webpack-merge');
const WebpackBase = require('./webpack.base.js');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const webpckDev = WebpackMerge(WebpackBase, {
  devtool: 'eval-source-map',
	devServer: {//webpack-dev-server配置
    port: process.env.PORT ? process.env.PORT : 3333,//端口
    host: '0.0.0.0',//主机
    open: `http://localhost:${process.env.PORT ? process.env.PORT : 3333}`,//浏览器打开的路径
    stats: {
      hash: false,
      builtAt: false,
      version: false,
      modules: false,
      children: false, ////解决类似Entrypoint undefined = index.html和Entrypoint mini-css-extract-plugin = *的警告
      entrypoints: false,
      colors: {
        green: '\u001b[32m',
        yellow: '\u001b[32m',
      }
    },
    proxy: {//请求代理设置
      '/api/*': {//代理请求前缀
        target: 'http://localhost:5555',//代理服务端路径
        //changeOrigin: true,
        //pathRewrite: {'^/api' : ''}//请求到服务端后是否重写路径
      }
    },
    inline: true,//
    compress: false,//是否压缩代码
    disableHostCheck: true,//是否开启热模块更新
    historyApiFallback: true,//是否处理找不到index.html时的404情况
	},
	//热模块更新插件
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CopyPlugin([
      { from: 'public', to: 'dist' },
    ]),
	]
})

module.exports = webpckDev;