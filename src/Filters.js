var Operations = require( "./utils/Operations.js" ),
	mathMin = Math.min,
	mathMax = Math.max,
	mathRound = Math.round,
	mathPow = Math.pow,
	mathSqrt = Math.sqrt,
	mathAbs = Math.abs,

	Filters = {
		brightness: function( data, value ) {
			var i, length = data.length;

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] += value;
				data[ i + 1 ] += value;
				data[ i + 2 ] += value;
			}
		},

		channels: function( data, values ) {
			var i, channel, value,
				length = data.length,
				calculate = function( channel, channelName ) {
					var value = values[ channelName ];

					if ( value === undefined ) {
						return channel;
					}

					if ( value > 0 ) {
						channel += ( 255 - channel ) * value;
					} else {
						channel -= channel * mathAbs( value );
					}

					return channel;
				};

			if ( typeof values !== "object" ) {
				return;
			}

			for ( channel in values ) {
				value = values[ channel ];
				if ( value === 0 ) {
					delete values[ channel ];
					continue;
				}
				values[ channel ] /= 100;
			}

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = calculate( data[ i ], "red" );
				data[ i + 1 ] = calculate( data[ i + 1 ], "green" );
				data[ i + 2 ] = calculate( data[ i + 2 ], "blue" );
			}
		},

		contrast: function( data, value ) {
			var i,
				length = data.length;

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = ( data[ i ] - 127 ) * value + 127;
				data[ i + 1 ] = ( data[ i + 1 ] - 127 ) * value + 127;
				data[ i + 2 ] = ( data[ i + 2 ] - 127 ) * value + 127;
			}
		},

		gamma: function( data, value ) {
			var i,
				length = data.length,
				calculate = function( channel ) {
					return mathPow( channel / 255, value ) * 255;
				};

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = calculate( data[ i ] );
				data[ i + 1 ] = calculate( data[ i + 1 ] );
				data[ i + 2 ] = calculate( data[ i + 2 ] );
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

		noise: function( data, value ) {
			var rand, i,
				length = data.length,
				randomRange = function( min, max ) {
					return mathRound( min + ( Math.random() * ( max - min ) ) );
				};

			value = mathAbs( value ) * 2.55;

			for ( i = 0; i < length; i += 4 ) {
				rand = randomRange( value * -1, value );
				data[ i ] += rand;
				data[ i + 1 ] += rand;
				data[ i + 2 ] += rand;
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

				max = mathMax( r, g, b );

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

		sepia: function( data, value ) {
			var i, r, g, b,
				length = data.length,
				calculate = function( rAlpha, gAlpha, bAlpha ) {
					return mathMin( 255, r * rAlpha + g * gAlpha + b * bAlpha );
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

		vibrance: function( data, value ) {
			var i, amt, avg, max, r, g, b,
				length = data.length;

			value *= -0.01;

			for ( i = 0; i < length; i += 4 ) {
				r = data[ i ];
				g = data[ i + 1 ];
				b = data[ i + 2 ];

				max = mathMax( r, g, b );
				avg = ( r + g + b ) / 3;
				amt = ( ( mathAbs( max - avg ) * 2 / 255 ) * value ) / 100;

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

		vignette: function( data, width, height, size, strength ) {
			var bezier, center, end, start,
				i, dist, div,
				x = 0,
				y = 0,
				length = data.length,
				calculate = function( channel, div ) {
					return mathPow( channel / 255, div ) * 255;
				};

			if ( strength === undefined ) {
				strength = 60;
			}

			if ( typeof size === "string" && size.substr( -1 ) === "%" ) {
				size = parseInt( size.substr( 0, size.length - 1 ), 10 ) / 100;
				size *= ( height > width ) ? width : height;
			}

			strength /= 100;
			center = [ width / 2, height / 2 ];
			start = mathSqrt( mathPow( center[ 0 ], 2 ) + mathPow( center[ 1 ], 2 ) );
			end = start - size;
			bezier = Operations.bezier( [ 0, 1 ], [ 30, 30 ], [ 70, 60 ], [ 100, 80 ] );

			for ( i = 0; i < length; i += 4 ) {
				dist = Operations.distance( x, y, center[ 0 ], center[ 1 ] );

				if ( dist <= end ) {
					continue;
				}

				div = Math.max( 1, ( bezier[ Math.round( ( ( dist - end ) / size ) * 100 ) ] / 10 ) * strength );
				data[ i ] = calculate( data[ i ], div );
				data[ i + 1 ] = calculate( data[ i + 1 ], div );
				data[ i + 2 ] = calculate( data[ i + 2 ], div );

				x++;

				if ( x > width ) {
					x %= width;
					y++;
				}
			}
		},

		vintage: function( data, width, height ) {
			var self = this;

			self.grayscale( data );
			self.contrast( data, 5 );
			self.noise( data, 3 );
			self.sepia( data, 100 );
			self.channels( data, {
				red: 8,
				blue: 2,
				green: 4
			} );
			self.gamma( data, 0.87 );
			self.vignette( data, width, height, "40%", 30 );
		}
	};

module.exports = Filters;
