
var path = require( "path" ),
	webpack = require( "webpack" ),
	HtmlWebpackPlugin = require( "html-webpack-plugin" ),
	ExtractTextPlugin = require( "extract-text-webpack-plugin" ),
	ReplaceBundlePlugin = require( "replace-bundle-webpack-plugin" ),
	_args = require( "yargs" ).argv,
	_package = require( "./package.json" ),
	_isProduction = _args.p || process.env.NODE_ENV === "production";

module.exports = ( function() {
	"use strict";

	var plugins = [
		new HtmlWebpackPlugin( {
			template: "./src/tpls/index.html"
		} ),
		new ExtractTextPlugin( {
			filename: "style.css",
			disable: false,
			allChunks: true
		} ),
		new ReplaceBundlePlugin( [
			{
				partten: /@@EDITOR_VERSION@@/g,
				replacement: function() {
					return _args.version || _package.version;
				}
			}, {
				partten: /@@EDITOR_EDITION@@/g,
				replacement: function() {
					return _args.edition || "dev";
				}
			}
		] )
	];

	if ( _isProduction ) {
		plugins = [
				new webpack.optimize.UglifyJsPlugin( {
					compressor: {
						warnings: true
					}
				} ),
				new webpack.optimize.OccurrenceOrderPlugin()
			].concat( plugins );
	}

	return {
		entry: [
			"./src/EditorManager"
		],

		output: {
			path: path.join( __dirname, "dist" ),
			filename: "latteart.js"
		},

		plugins: plugins,

		module: {
			loaders: [ {
				test: /\.less$/,
				use: ExtractTextPlugin.extract( {
					fallback: "style-loader",
					use: [ "css-loader", "less-loader" ]
				} )
			} ]
		}
	};
} )();
