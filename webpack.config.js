module.exports = { baseUrl: '/', devServer: { disableHostCheck: true, } } 
/*const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

process.traceDeprecation = true;

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  output: {
		path: path.resolve(__dirname, "wwwroot/dist"),
		filename: "[name].js",
		publicPath: "/dist/"
	},
  optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false,
				extractComments: 'all',
				uglifyOptions: {
					compress: true,
					output: null
				}
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					safe: true,
					discardComments: {
						removeAll: true,
					},
				},
			})
		]
	},
  }*/