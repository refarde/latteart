
var path = require( "path" ),
	webpack = require( "webpack" ),
	HtmlWebpackPlugin = require( "html-webpack-plugin" ),
	ReplaceBundlePlugin = require( "replace-bundle-webpack-plugin" ),
	CleanWebpackPlugin = require( "clean-webpack-plugin" ),
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
			"https://jquery.org/license",
		jqueryUILicense:
			"jQuery UI - v1.11.1 - 2014-08-13\n" +
			"http://jqueryui.com/ \n" +
			"\n" +
			"Copyright 2014 jQuery Foundation and other contributors; Licensed MIT",
		bowserLicense:
			"Bowser - a browser detector\n" +
			"https://github.com/ded/bowser\n" +
			"MIT License | (c) Dustin Diaz 2014"
	};

module.exports = ( function() {
	var plugins = [
		new CleanWebpackPlugin( [ "dist" ] ),
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
				},
				output: {
					comments: false
				}
			} ),

			new webpack.optimize.OccurrenceOrderPlugin(),

			// banner 삽입
			new webpack.BannerPlugin( {
				banner: _banners.bowserLicense,
				entryOnly: true
			} ),
			new webpack.BannerPlugin( {
				banner: _banners.jqueryUILicense,
				entryOnly: true
			} ),
			new webpack.BannerPlugin( {
				banner: _banners.jqueryLicense,
				entryOnly: true
			} ),
			new webpack.BannerPlugin( {
				banner: _banners.minify,
				entryOnly: false
			} )
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
				include: [
					path.resolve( __dirname, "src/skins" )
				],
				use: [ "style-loader", "css-loader", "less-loader" ]
			} ]
		}
	};
} )();
