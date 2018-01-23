// webpack.config.js
var path = require( "path" ),
	webpack = require( "webpack" ),
	HtmlWebpackPlugin = require( "html-webpack-plugin" ),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	//devtool: "cheap-eval-source-map",

	entry: [
		"./src/latteart"
	],

	output: {
		path: path.join( __dirname, "dist" ),
		filename: "latteart.js"
	},

	plugins: [
		// new webpack.optimize.UglifyJsPlugin({
		// 	compressor: {
		// 		warnings: true
		// 	}
		// }),
		// new webpack.optimize.OccurrenceOrderPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/tpls/index.html"
		}),
		new ExtractTextPlugin({
			filename: "style.css",
			disable: false,
			allChunks: true
		}),
	],

	module: {
		loaders: [{
			test: /\.less$/,
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: [ "css-loader", "less-loader" ]
			})
		}]
	}
};
