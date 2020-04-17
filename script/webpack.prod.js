const webpackBase = require('./webpack.base');
const webpackMerge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
//合并base，product配置
module.exports = webpackMerge(webpackBase, {
  mode: 'production',//申明为生产环境
  devtool: 'cheap-source-map',//压缩源码使得看不到源码
  optimization: {
    minimizer: [
      //优化请求设置缓存是否压缩源码
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        // cssProcessorOptions: cssnanoOptions,
        cssProcessorPluginOptions: {
          preset: ['default', {
            discardComments: {
              removeAll: true,//是否去掉注释的 代码
            },
            normalizeUnicode: false
          }]
        },
        canPrint: true
      })
    ],
    namedModules: false,
    splitChunks: {//分离模块
      chunks: 'async',//异步加载代码块
      minSize: 30000,//最小大小
      maxSize: 0,//最大大小
      minChunks: 1,//最小块数
      maxAsyncRequests: 5,//最大异步请求数
      maxInitialRequests: 3,//最大初始化请求数
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {//缓存node_modules中的代码
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    //每次构建代码时清理前一次的打包代码
    new CleanWebpackPlugin(),
    //限制分割代码数插件
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 2,//最大分割数
      minChunkSize: 1000//最小分割大小
    }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
  ]
})