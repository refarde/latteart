/*!
 * Extracted from JavaScript-MinifyJpeg
 * https://github.com/hMatoba/MinifyJpeg
 *
 * Copyright (c) 2013 hMatoba
 * Released under the MIT license
 * https://raw.githubusercontent.com/hMatoba/MinifyJpeg/master/LICENSE.txt
 */
module.export = function() {
	"use strict";

	var KEY_STR =
		"ABCDEFGHIJKLMNOP" +
		"QRSTUVWXYZabcdef" +
		"ghijklmnopqrstuv" +
		"wxyz0123456789+/" +
		"=";

	function _encode( input ) {
		var output = "",
			chr1, chr2, chr3 = "",
			enc1, enc2, enc3, enc4 = "",
			i = 0,
			length = input.length;

		do {
			chr1 = input[ i++ ];
			chr2 = input[ i++ ];
			chr3 = input[ i++ ];
			enc1 = chr1 >> 2;
			enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
			enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
			enc4 = chr3 & 63;

			if ( isNaN( chr2 ) ) {
				enc3 = enc4 = 64;
			} else if ( isNaN( chr3 ) ) {
				enc4 = 64;
			}

			output +=
				KEY_STR.charAt( enc1 ) +
				KEY_STR.charAt( enc2 ) +
				KEY_STR.charAt( enc3 ) +
				KEY_STR.charAt( enc4 );
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while ( i < length );

		return output;
	}

	function _decode( input ) {
		var chr1, chr2, chr3 = "",
			enc1, enc2, enc3, enc4 = "",
			i = 0,
			length,
			buf = [],
			base64test = /[^A-Za-z0-9\+\/\=]/g;	// remove all characters that are not A-Z, a-z, 0-9, +, /, or =

		// if ( base64test.exec( input ) ) {
		// 	console.error(
		// 		"There were invalid base64 characters in the input text.\n" +
		// 		"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
		// 		"Expect errors in decoding." );
		// }

		input = input.replace( base64test, "" );
		length = input.length;

		do {
			enc1 = KEY_STR.indexOf( input.charAt( i++ ) );
			enc2 = KEY_STR.indexOf( input.charAt( i++ ) );
			enc3 = KEY_STR.indexOf( input.charAt( i++ ) );
			enc4 = KEY_STR.indexOf( input.charAt( i++ ) );

			chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
			chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
			chr3 = ( ( enc3 & 3  ) << 6 ) | enc4;

			buf.push( chr1 );

			if ( enc3 !== 64 ) {
				buf.push( chr2 );
			}
			if ( enc4 !== 64 ) {
				buf.push( chr3 );
			}

			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while ( i < length );

		return buf;
	}

	return {
		encode: _encode,
		decode: _decode
	};
};
