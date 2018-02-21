var	mathMin = Math.min,
	mathMax = Math.max,
	mathRound = Math.round,
	mathPow = Math.pow,
	mathSqrt = Math.sqrt,

	Operations = {
		bezier: function( start, ctrl1, ctrl2, end, lowBound, highBound ) {
			var bezier = {},
				controlPoints, endX, i, j, next, prev, t, _i, _j, _ref,
				clamp = function( a, min, max ) {
					return mathMin( mathMax( a, min ), max );
				},
				lerp = function( a, b, t ) {
					return a * ( 1 - t ) + b * t;
				};

			lowBound = lowBound || 0;
			highBound = highBound || 255;

			if ( start[ 0 ] instanceof Array ) {
				controlPoints = start;
				lowBound = ctrl1;
				highBound = ctrl2;
			} else {
				controlPoints = [ start, ctrl1, ctrl2, end ];
			}

			if ( controlPoints.length < 2 ) {
				throw "Invalid number of arguments to bezier";
			}

			for ( i = _i = 0; _i < 1000; i = ++_i ) {
				t = i / 1000;
				prev = controlPoints;

				while ( prev.length > 1 ) {
					next = [];

					for (
						j = _j = 0, _ref = prev.length - 2;
						0 <= _ref ? _j <= _ref : _j >= _ref;
						j = 0 <= _ref ? ++_j : --_j
					) {
						next.push( [
							lerp( prev[ j ][ 0 ], prev[ j + 1 ][ 0 ], t ),
							lerp( prev[ j ][ 1 ], prev[ j + 1 ][ 1 ], t )
						] );
					}

					prev = next;
				}

				bezier[ mathRound( prev[ 0 ][ 0 ] ) ] =
					mathRound( clamp( prev[ 0 ][ 1 ], lowBound, highBound ) );
			}

			endX = controlPoints[ controlPoints.length - 1 ][ 0 ];
			bezier = Operations.missingValues( bezier, endX );

			if ( bezier[ endX ] === null ) {
				bezier[ endX ] = bezier[ endX - 1 ];
			}

			return bezier;
		},

		missingValues: function( values, endX ) {
			var i, j, leftCoord, ret, rightCoord, _i, _j;

			if ( Object.keys( values ).length > endX + 1 ) {
				return values;
			}

			ret = {};

			for ( i = _i = 0; 0 <= endX ? _i <= endX : _i >= endX; i = 0 <= endX ? ++_i : --_i ) {
				if ( values[ i ] ) {
					ret[ i ] = values[ i ];
					continue;
				}

				leftCoord = [ i - 1, ret[ i - 1 ] ];

				for ( j = _j = i; i <= endX ? _j <= endX : _j >= endX; j = i <= endX ? ++_j : --_j ) {
					if ( values[ j ] ) {
						rightCoord = [ j, values[ j ] ];
						break;
					}
				}

				ret[ i ] = leftCoord[ 1 ] +
					( rightCoord[ 1 ] - leftCoord[ 1 ] ) /
					( rightCoord[ 0 ] - leftCoord[ 0 ] ) *
					( i - leftCoord[ 0 ] );
			}

			return ret;
		},

		distance: function( x1, y1, x2, y2 ) {
			return mathSqrt( mathPow( x2 - x1, 2 ) + mathPow( y2 - y1, 2 ) );
		}
	};

module.exports = Operations;
