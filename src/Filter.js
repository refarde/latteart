module.exports = {
	brightness: function( data, value ) {
		var i, length = data.length;

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] += value;
			data[ i + 1 ] += value;
			data[ i + 2 ] += value;
		}
	},

	contrast: function( data, value ) {
		var i, length = data.length;

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] = ( data[ i ] - 127 ) * value + 127;
			data[ i + 1 ] = ( data[ i + 1 ] - 127 ) * value + 127;
			data[ i + 2 ] = ( data[ i + 2 ] - 127 ) * value + 127;
		}
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
	},

	noise: function( data, value ) {
		var rand, i,
			length = data.length,
			randomRange = function( min, max ) {
				return Math.round( min + ( Math.random() * ( max - min ) ) );
			};

		value = Math.abs( value ) * 2.55;

		for ( i = 0; i < length; i += 4 ) {
			rand = randomRange( value * -1, value );
			data[ i ] += rand;
			data[ i + 1 ] += rand;
			data[ i + 2 ] += rand;
		}
	},

	sefia: function( data, value ) {
		var i, r, g, b,
			length = data.length,
			calculate = function( rAlpha, gAlpha, bAlpha ) {
				return Math.min( 255, r * rAlpha + g * gAlpha + b * bAlpha );
			};

		value = ( value || 100 ) / 100;

		for ( i = 0; i < length; i += 4 ) {
			r = data[ i ];
			g = data[ i + 1 ];
			b = data[ i + 2 ];

			data[ i ] = calculate( 1 - ( 0.607 * value ), 0.769 * value, 0.189 * value );
			data[ i + 1 ] = calculate( 0.349 * value, 1 - ( 0.314 * value ), 0.168 *  value );
			data[ i + 2 ] = calculate( 0.272 * value, 0.534 * value, 1 - ( 0.869 * value ) );
		}
	},

	gamma: function( data, value ) {
		var i,
			length = data.length,
			calculate = function( channel ) {
				return Math.pow( channel / 255, value ) * 255;
			};

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] = calculate( data[ i ] );
			data[ i + 1 ] = calculate( data[ i + 1 ] );
			data[ i + 2 ] = calculate( data[ i + 2 ] );
		}
	},

	channels: function( data, values ) {
		var i,
			length = data.length,
			calculate = function( channel, channelName ) {
				var value = values[ channelName ];

				if ( value === undefined ) {
					return;
				}

				if ( value > 0 ) {
					channel += ( 255 - channel ) * value;
				} else {
					channel -= channel * Math.abs( value );
				}

				return channel;
			};

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] = calculate( data[ i ], "red" );
			data[ i + 1 ] = calculate( data[ i + 1 ], "green" );
			data[ i + 2 ] = calculate( data[ i + 2 ], "blue" );
		}
	}
};
