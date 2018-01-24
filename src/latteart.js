
( function() {
"use strict";

require( "./skins/default.less" );

var document = window.document,
	$ = require( "./libs/jquery-custom.js" ),
	env = require( "bowser" ),

	EditorManager = {
		editors: {},
		initialed: false,
		version: "@@EDITOR_VERSION@@",
		edition: "@@EDITOR_EDITION@@",

		create: function( id, configs, type, callback ) {
			var self = this,
				editor;

			function init() {
				var src, i, result, fileName,
					scripts = document.getElementsByTagName( "script" );

				for ( i = 0; i < scripts.length; i++ ) {
					src = scripts[ i ].getAttribute( "src", 2 );

					if ( /latteart(?:[\.\_\-][a-z0-9]+)*\.js/ig.test( src ) ) {
						result = /(?:\w+\.*)*latteart\/(?:\w+\.*)+\/(latteart(?:\w+\.*)*\.js)/.exec( src );

						if ( result ) {
							fileName = result[ 1 ];
							self.baseURL = src.substring( 0, src.lastIndexOf( fileName ) );
							break;
						}
					}
				}

				self.initialed = true;
			}
		}
	};

	console.log( $ );
	console.log( env );
	console.log( EditorManager );
} )();
