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

		// Primitive

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

		clip: function( data, value ) {
			var i, length = data.length,
				calculate = function( channel ) {
					if ( channel > 255 - value ) {
						channel = 255;
					} else if ( channel < value ) {
						channel = 0;
					}

					return clampRGB( channel );
				};

			value = mathAbs( value || 0 ) * 2.55;

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = calculate( data[ i ] );
				data[ i + 1 ] = calculate( data[ i + 1 ] );
				data[ i + 2 ] = calculate( data[ i + 2 ] );
			}
		},

		colorize: function( data, rgb, level ) {
			var i,
				length = data.length,
				calculate = function( channel, channelName ) {
					var value = rgb[ channelName ];

					if ( !value ) {
						return channel;
					}

					channel -= ( channel - value ) * level;

					return clampRGB( channel );
				};

			level /= 100;

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

		curves: function( data, extra ) {
			var algorithm, channels, bezier, start, end, ctrl1, ctrl2,
				i, length = data.length;

			extra = extra || {};

			algorithm = extra.algorithm;
			if ( typeof algorithm === "string" ) {
				algorithm = Operations[ algorithm ];
			} else if ( typeof algorithm !== "function" ) {
				algorithm = Operations.bezier;
			}

			channels = extra.channels || { red: true, green: true, blue: true };

			start = extra.start;
			ctrl1 = extra.ctrl1;
			ctrl2 = extra.ctrl2;
			end = extra.end;

			if ( !start || !end ) {
				throw "Invalid number of arguments to curves filter";
			}

			bezier = algorithm( start, ctrl1, ctrl2, end, 0, 255 );

			if ( start[ 0 ] > 0 ) {
				for ( i = 0; i < start[ 0 ]; ++i ) {
					bezier[ i ] = start[ 1 ];
				}
			}

			if ( end[ 0 ] < 255 ) {
				for ( i = end[ 0 ]; i <= 255; ++i ) {
					bezier[ i ] = end[ 1 ];
				}
			}

			for ( i = 0; i < length; i += 4 ) {
				if ( channels.red ) {
					data[ i ] = clampRGB( bezier[ data[ i ] ] );
				}

				if ( channels.green ) {
					data[ i + 1 ] = clampRGB( bezier[ data[ i + 1 ] ] );
				}

				if ( channels.blue ) {
					data[ i + 2 ] = clampRGB( bezier[ data[ i + 2 ] ] );
				}
			}
		},

		exposure: function( data, value ) {
			var p = Math.abs( value || 0 ) / 100 * 255,
				ctrl1 = [ 0, p ],
				ctrl2 = [ 255 - p, 255 ];

			if ( value < 0 ) {
				ctrl1 = ctrl1.reverse();
				ctrl2 = ctrl2.reverse();
			}

			return this.curves( data, {
				start: [ 0, 0 ],
				ctrl1: ctrl1,
				ctrl2: ctrl2,
				end: [ 255, 255 ]
			} );
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

		posterize: function( data, value ) {
			var numOfAreas, numOfValues,
				i, length = data.length,
				calculate = function( channel ) {
					return mathFloor( mathFloor( channel / numOfAreas ) * numOfValues );
				};

			numOfAreas = 256 / value;
			numOfValues = 255 / ( value - 1 );

			if ( isNaN( numOfAreas ) || isNaN( numOfValues ) ) {
				return;
			}

			for ( i = 0; i < length; i += 4 ) {
				data[ i ] = calculate( data[ i ] );
				data[ i + 1 ] = calculate( data[ i + 1 ] );
				data[ i + 2 ] = calculate( data[ i + 2 ] );
			}
		},

		sharpen: function( data, value ) {
			var i, length;

			if ( value === undefined ) {
				value = 100;
			}

			value /= 100;

			// TODO: data process
			// for ( i = 0, length = data.length; i < length; i += 4 ) {
			// 	data[ i ] = data[ i ] + value;
			// 	data[ i + 1 ] = data[ i + 1 ] + value;
			// 	data[ i + 2 ] = data[ i + 2 ] + value;
			// }
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
					x = 0;		// Composite
					++y;
				}
			}
		},

		// Composite

		clarity: function( data, width, height, isGrayscale ) {
			var self = this;

			self.vibrance( data, 20 );
			self.curves( data, {
				start: [ 5, 0 ],
				ctrl1: [ 130, 150 ],
				ctrl2: [ 190, 220 ],
				end: [ 250, 255 ]
			} );
			self.sharpen( data, 15 );
			self.vignette( data, width, height, "50%", 20 );

			if ( isGrayscale ) {
				self.grayscale( data );
				self.contrast( data, 4 );
			}
		},

		crossProcess: function( data ) {
			var self = this;

			self.exposure( data, 5 );
			self.colorize( data, { red: 232, green: 123, blue: 34 }, 4 );
			self.sepia( data, 20 );
			self.channels( data, { red: 3, blue: 8 } );
			self.curves( data, {
				channels: { blue: true },
				start: [ 0, 0 ],
				ctrl1: [ 100, 150 ],
				ctrl2: [ 180, 180 ],
				end: [ 255, 255 ]
			} );
			self.contrast( data, 15 );
			self.vibrance( data, 75 );
			self.gamma( data, 1.6 );
		},

		jarques: function( data ) {
			var self = this;

			self.saturation( data, -35 );
			self.curves( data, {
				channels: { blue: true },
				start: [ 20, 0 ],
				ctrl1: [ 90, 120 ],
				ctrl2: [ 186, 144 ],
				end: [ 255, 230 ]
			} );
			self.curves( data, {
				channels: { red: true },
				start: [ 0, 0 ],
				ctrl1: [ 144, 90 ],
				ctrl2: [ 138, 120 ],
				end: [ 255, 255 ]
			} );
			self.curves( data, {
				channels: { green: true },
				start: [ 10, 0 ],
				ctrl1: [ 115, 105 ],
				ctrl2: [ 148, 100 ],
				end: [ 255, 248 ]
			} );
			self.curves( data, {
				start: [ 0, 0 ],
				ctrl1: [ 120, 100 ],
				ctrl2: [ 128, 140 ],
				end: [ 255, 255 ]
			} );
			self.sharpen( data, 20 );
		},

		grungy: function( data, width, height ) {
			var self = this;

			self.gamma( data, 1.5 );
			self.clip( data, 25 );
			self.saturation( data, -60 );
			self.contrast( data, 5 );
			self.noise( data, 5 );
			self.vignette( data, width, height, "50%", 30 );
		},

		lomo: function( data, width, height, isVignette ) {
			var self = this;

			self.brightness( data, 15 );
			self.exposure( data, 15 );
			self.curves( data, {
				start: [ 0, 0 ],
				ctrl1: [ 200, 0 ],
				ctrl2: [ 155, 255 ],
				end: [ 255, 255 ]
			} );
			self.saturation( data, -20 );
			self.gamma( data, 1.8 );

			if ( isVignette === undefined || isVignette ) {
				self.vignette( data, width, height, "50%", 60 );
			}

			self.brightness( data, 5 );
		},

		love: function( data ) {
			var self = this;

			self.brightness( data, 5 );
			self.exposure( data, 8 );
			self.contrast( data, 4 );
			self.colorize( data, { red: 196, green: 32, blue: 7 }, 30 );
			self.vibrance( data, 50 );
			self.gamma( data, 1.3 );
		},

		orangePeel: function( data ) {
			var self = this;

			self.curves( data, {
				start: [ 0, 0 ],
				ctrl1: [ 100, 50 ],
				ctrl2: [ 140, 200 ],
				end: [ 255, 255 ]
			} );
			self.vibrance( data, -30 );
			self.saturation( data, -30 );
			self.colorize( data, { red: 255, green: 144, blue: 0 }, 30 );
			self.contrast( data, -5 );
			self.gamma( data, 1.4 );
		},

		sinCity: function( data ) {
			var self = this;

			self.contrast( data, 100 );
			self.brightness( data, 15 );
			self.exposure( data, 10 );
			self.posterize( data, 80 );
			self.clip( data, 30 );
			self.greyscale( data );
		},

		sunrise: function( data, width, height ) {
			var self = this;

			self.exposure( data, 3.5 );
			self.saturation( data, -5 );
			self.vibrance( data, 50 );
			self.sepia( data, 60 );
			self.colorize( data, { red: 232, green: 123, blue: 34 }, 10 );
			self.channels( data, { red: 8, blue: 8 } );
			self.contrast( data, 5 );
			self.gamma( data, 1.2 );
			self.vignette( data, width, height, "55%", 25);
		},

		vintage: function( data, width, height, isVignette ) {
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

			if ( isVignette === undefined || isVignette ) {
				self.vignette( data, width, height, "40%", 30 );
			}
		}
	};

module.exports = Filters;
