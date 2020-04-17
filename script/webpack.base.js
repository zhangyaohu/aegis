const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

var isDev = process.env.NODE_ENV === 'development' ? true : false;
const cdn = [
	"https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
	"https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js",
	"https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js",
	"https://cdn.bootcss.com/element-ui/2.4.11/index.js",
	"https://cdn.bootcss.com/axios/0.18.0/axios.min.js",
	"https://cdn.bootcss.com/vue-i18n/5.0.3/vue-i18n.min.js",
	"https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js",
]

const externals = {
	'vuex': 'Vuex',
	'vue-router': 'VueRouter',
	'vue-i18n': 'VueI18n',
	'echarts': 'echarts',
	"Vue": 'Vue',
	"element": 'element',
	"axios": 'axios'
}

module.exports = {
	entry: {
		app: ['babel-polyfill', path.resolve(__dirname, '../src/main.js')],
		'aegis-blue': path.resolve(__dirname, '../src/style/aegis-blue.less'),
		'aegis-default':path.resolve(__dirname, '../src/style/aegis-default.less'),
		'aegis-light':path.resolve(__dirname, '../src/style/aegis-light.less'),
		'aegis-dark':path.resolve(__dirname, '../src/style/aegis-dark.less')
	},
	output: {
		filename: 'js/[name].[hash].bundle.js',
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/',
		chunkFilename: isDev ? 'js/chunk-[chunkhash].js' : 'js/[name].js'
	},
	resolve: {
		//别名简化引入路径
		alias: {
			'@': path.resolve(__dirname, '../src'),
			'image': path.resolve(__dirname, '../src/assets'),
			'styles': path.resolve(__dirname, '../src/style')
		},
		//可省略的扩展名
		extensions: ['.js', '.vue', '.less'],
	},
	externals,
	module: {
		rules: [
			{
				test: /\.(le|c)ss$/,
				use: [
					'vue-style-loader',
				  MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
			{ //打包图片
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							esModule: false,
							limit: 1000,
							name: 'image/[name].[hash:8].[ext]',
						}
					}
				]
			},
			{
				//打包.vue文件
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				//js VueLoaderPlugin
				test: /\.js/,
				loader: 'babel-loader'
			},
			{
				test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							limit: 1000,
							name: 'font/[name].[hash:8].[ext]',
						}
					}
				]
			},
		]
	},
	plugins: [
		new LodashModuleReplacementPlugin(),
		//打包vue时的插件
		new VueLoaderPlugin(),
		//打包html的插件
		new HtmlWebpackPlugin({
			title: 'qq-music-app',//标题名称
			filename: 'index.html',//文件名称
			inject: true,//将打包过后的js注入到index.html的后面
			template: './public/index.html',
			cdn,
			favicon: './public/favicon.ico',
			files: {
        css: ['app.css'],
			},
			minify: !isDev ? {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			} : undefined,
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: 'css/[name].css',//插件名
			chunkFilename: 'css/chunk-[chunkhash][name].css',//插件名
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		}),
	]
}