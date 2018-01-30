
var path = require( "path" ),
	webpack = require( "webpack" ),
	HtmlWebpackPlugin = require( "html-webpack-plugin" ),
	ExtractTextPlugin = require( "extract-text-webpack-plugin" ),
	ReplaceBundlePlugin = require( "replace-bundle-webpack-plugin" ),
	_args = require( "yargs" ).argv,
	_package = require( "./package.json" ),
	_isProduction = _args.p || process.env.NODE_ENV === "production",
	_version = _args.version || _package.version,
	_banners = {
		minify:
			"LatteArt v" + _version + "\n" +
			"Copyright 2018, S-Core, Inc. All Right Reserved.",
		jqueryLicense:
			"jQuery JavaScript Library v3.3.1 -deprecated,-css/showHide,-effects,-effects/Tween,-effects/animatedSelector,-core/ready,-exports/grobal,-exports/amd\n" +
			"https://jquery.com/\n" +
			"\n" +
			"Includes Sizzle.js\n" +
			"https://sizzlejs.com/\n" +
			"\n" +
			"Copyright JS Foundation and other contributors\n" +
			"Released under the MIT license\n" +
			"https://jquery.org/license\n" +
			"\n" +
			"Date: 2018-01-30T05:29Z",
		jqueryUILicense:
			"jQuery UI - v1.11.1 - 2014-08-13\n" +
			"http://jqueryui.com/ \n" +
			"\n" +
			"Copyright 2014 jQuery Foundation and other contributors; Licensed MIT",
		bowserLicense:
			"Bowser - a browser detector\n" +
			"https://github.com/ded/bowser\n" +
			"MIT License | (c) Dustin Diaz 2014\n"
	};

module.exports = ( function() {
	var plugins = [
		new ExtractTextPlugin( {
			filename: "style.css",
			disable: false,
			allChunks: true
		} ),

		// banner 삽입
		new webpack.BannerPlugin( _banners.bowserLicense ),
		new webpack.BannerPlugin( _banners.jqueryUILicense ),
		new webpack.BannerPlugin( _banners.jqueryLicense ),
		new webpack.BannerPlugin( _banners.minify ),

		new ReplaceBundlePlugin( [
			{
				partten: /@@EDITOR_VERSION@@/g,
				replacement: function() {
					return _version;
				}
			}, {
				partten: /@@EDITOR_EDITION@@/g,
				replacement: function() {
					return _args.edition || "dev";
				}
			}
		] ),
		new HtmlWebpackPlugin( {
			template: "./src/tpls/index.html",
			inject: "head"
		} )
	];

	if ( _isProduction ) {
		plugins = [
			new webpack.optimize.UglifyJsPlugin( {
				compressor: {

					// remove warnings
					warnings: true,

					// Drop console statements
					drop_console: true
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
