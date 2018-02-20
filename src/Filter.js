module.exports = {
	brightness: function( data, value ) {
		var i, length = data.length;

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] += value;
			data[ i + 1 ] += value;
			data[ i + 2 ] += value;
		}

		return data;
	},

	contrast: function( data, value ) {
		var i, length = data.length;

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] = ( data[ i ] - 127 ) * value + 127;
			data[ i + 1 ] = ( data[ i + 1 ] - 127 ) * value + 127;
			data[ i + 2 ] = ( data[ i + 2 ] - 127 ) * value + 127;
		}

		return data;
	},

	saturation: function( data, value ) {
		var i, max, r, g, b,
			length = data.length;

		value *= -0.01;

		for ( i = 0; i < length; i += 4 ) {
			r = data[ i ];
			g = data[ i + 1 ];
			b = data[ i + 2 ];

			max = Math.max( r, g, b );

			if ( r !== max ) {
				data[ i ] += ( max - r ) * value;
			}

			if ( g !== max ) {
				data[ i + 1 ] += ( max - g ) * value;
			}

			if ( b !== max ) {
				data[ i + 2 ] += ( max - b ) * value;
			}
		}

		return data;
	},

	grayscale: function( data ) {
		var i, brightness,
			length = data.length;

		for ( i = 0; i < length; i += 4 ) {
			brightness = 0.34 * data[ i ] + 0.5 * data[ i + 1 ] + 0.16 * data[ i + 2 ];
			data[ i ] = brightness;
			data[ i + 1 ] = brightness;
			data[ i + 2 ] = brightness;
		}

		return data;
	},

	vibrance: function( data, value ) {
		var i, amt, avg, max, r, g, b,
			length = data.length;

		value *= -0.01;

		for ( i = 0; i < length; i += 4 ) {
			r = data[ i ];
			g = data[ i + 1 ];
			b = data[ i + 2 ];

			max = Math.max( r, g, b );
			avg = ( r + g + b ) / 3;
			amt = ( ( Math.abs( max - avg ) * 2 / 255 ) * value ) / 100;

			if ( r !== max ) {
				data[ i ] += ( max - r ) * amt;
			}

			if ( g !== max ) {
				data[ i + 1 ] += ( max - g ) * amt;
			}

			if ( b !== max ) {
				data[ i + 2 ] += ( max - b ) * amt;
			}
		}

		return data;
	}
};
