var Operations = require( "./utils/Operations.js" ),
	mathMin = Math.min,
	mathMax = Math.max,
	mathRound = Math.round,
	mathPow = Math.pow,
	mathSqrt = Math.sqrt,
	mathAbs = Math.abs,
	clampRGB = function( channel ) {
		if ( channel < 0 ) {
			return 0;
		}
		if ( channel > 255 ) {
			return 255;
		}
		return channel;
	},

	Filters = {
		brightness: function( data, value ) {
			var i, length = data.length;

			value = Math.floor( 255 * ( ( value || 0 ) / 100 ) );

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = clampRGB( data[ i ] + value );
				data[ i + 1 ] = clampRGB( data[ i + 1 ] + value );
				data[ i + 2 ] = clampRGB( data[ i + 2 ] + value );
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

					return clampRGB( channel );
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
				length = data.length,
				calculate = function( channel, value ) {
					channel /= 255;
					channel -= 0.5;
					channel *= value;
					channel += 0.5;
					channel *= 255;
					return clampRGB( channel );
				};

			value = parseFloat( value || 0 );
			value = mathPow( ( value + 100 ) / 100, 2 );

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = calculate( data[ i ], value );
				data[ i + 1 ] = calculate( data[ i + 1 ], value );
				data[ i + 2 ] = calculate( data[ i + 2 ], value );
			}
		},

		gamma: function( data, value ) {
			var i,
				length = data.length,
				calculate = function( channel ) {
					return clampRGB( mathPow( channel / 255, value ) * 255 );
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
				brightness = clampRGB( 0.299 * data[ i ] + 0.587 * data[ i + 1 ] + 0.114 * data[ i + 2 ] );
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
				data[ i ] = clampRGB( data[ i ] + rand );
				data[ i + 1 ] = clampRGB( data[ i + 1 ] + rand );
				data[ i + 2 ] = clampRGB( data[ i + 2 ] + rand );
			}
		},

		saturation: function( data, value ) {
			var i, max, r, g, b,
				length = data.length,
				calculate = function( channel, max ) {
					return clampRGB( channel + ( max - channel ) * value );
				};

			value *= -0.01;

			for ( i = 0; i < length; i += 4 ) {
				r = data[ i ];
				g = data[ i + 1 ];
				b = data[ i + 2 ];

				max = mathMax( r, g, b );

				if ( r !== max ) {
					data[ i ] = calculate( r, max );
				}

				if ( g !== max ) {
					data[ i + 1 ] = calculate( g, max );
				}

				if ( b !== max ) {
					data[ i + 2 ] = calculate( b, max );
				}
			}
		},

		sepia: function( data, value ) {
			var i, r, g, b,
				length = data.length,
				calculate = function( r, rAlpha, g, gAlpha, b, bAlpha ) {
					return clampRGB( mathMin( 255, r * rAlpha + g * gAlpha + b * bAlpha ) );
				};

			value = ( value || 100 ) / 100;

			for ( i = 0; i < length; i += 4 ) {
				r = data[ i ];
				g = data[ i + 1 ];
				b = data[ i + 2 ];

				data[ i ] = calculate( r, 1 - ( 0.607 * value ), g, 0.769 * value, b, 0.189 * value );
				data[ i + 1 ] = calculate( r, 0.349 * value, g, 1 - ( 0.314 * value ), b, 0.168 *  value );
				data[ i + 2 ] = calculate( r, 0.272 * value, g, 0.534 * value, b, 1 - ( 0.869 * value ) );
			}
		},

		vibrance: function( data, value ) {
			var i, amt, avg, max, r, g, b,
				length = data.length,
				calculate = function( channel, max, amt ) {
					return clampRGB( channel + ( max - channel ) * amt );
				};

			value *= -0.01;

			for ( i = 0; i < length; i += 4 ) {
				r = data[ i ];
				g = data[ i + 1 ];
				b = data[ i + 2 ];

				max = mathMax( r, g, b );
				avg = ( r + g + b ) / 3;
				amt = ( ( mathAbs( max - avg ) * 2 / 255 ) * value ) / 100;

				if ( r !== max ) {
					data[ i ] = calculate( r, max, amt );
				}

				if ( g !== max ) {
					data[ i + 1 ] = calculate( g, max, amt );
				}

				if ( b !== max ) {
					data[ i + 2 ] = calculate( b, max, amt );
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
					return clampRGB( mathPow( channel / 255, div ) * 255 );
				};

			strength = strength || 60;

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

				if ( dist > end ) {
					div = Math.max( 1, ( bezier[ Math.round( ( ( dist - end ) / size ) * 100 ) ] / 10 ) * strength );
					data[ i ] = calculate( data[ i ], div );
					data[ i + 1 ] = calculate( data[ i + 1 ], div );
					data[ i + 2 ] = calculate( data[ i + 2 ], div );
				}

				if ( ++x >= width ) {
					x = 0;
					++y;
				}
			}
			console.log( y );
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
		},


		lomo: function( data, width, height ) {
			var self = this;

			self.brightness( data, 15 );
			self.exposure( data, 15 );
			self.curves( data, "rgb", [ 0, 0 ], [ 200, 0 ], [ 155, 255 ], [ 255, 255 ] );
			self.saturation( data, -20 );
			self.gamma( data, 1.8 );
			self.vignette( data, width, height, "50%", 60 );
			self.brightness( data, 5 );
		}
	};

module.exports = Filters;
