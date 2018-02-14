function SaturationPlugin( editor ) {
	console.log( editor.id + ": Saturation" );

	var $ = editor.$,
		_ctx, _canvas, _dummyCanvas, _dummyCtx,
		_$btnSaturation, _ui;

	function init() {
		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
		_dummyCanvas = $( "<canvas />" )[ 0 ];
		_dummyCtx = _dummyCanvas.getContext( "2d" );

		_ui = editor.ui;
		_$btnSaturation = editor.ui.widgets.saturation.element;
		_$btnSaturation.on( "click", function() {
			_dummyCanvas.width = _canvas.width;
			_dummyCanvas.height = _canvas.height;

			_dummyCtx.clearRect( 0, 0, _dummyCanvas.width, _dummyCanvas.height );
			_dummyCtx.drawImage( _canvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );

			_ui.widgets.slider
				.option( {
					min: -100,
					max: 100,
					value: editor.info.saturation
				} )
				.element.on( "sliderchange.latte", function( e, ui ) {
					_setSaturation( ui.value );
					editor.info.saturation = ui.value;
				} );

			_ui.toggleRangebar( true );
		} );
	}

	function _setSaturation( value ) {
		var pixels, data, length, i, r, g, b, hsl, rgb;

		_ctx.drawImage( _dummyCanvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
		pixels = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );
		data = pixels.data;
		length = data.length;

		value = parseFloat( value ) || 0;

		for ( i = 0; i < length; i += 4 ) {
			r = i;
			g = i + 1;
			b = i + 2;

			hsl = _RGBToHSL( data[ r ] / 255, data[ g ] / 255, data[ b ] / 255 );

			hsl[ 1 ] = Math.max( 0, hsl[ 1 ] + value );

			rgb = _HSLToRGB( hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] );

			data[ r ] = rgb[ 0 ] * 255;
			data[ g ] = rgb[ 1 ] * 255;
			data[ b ] = rgb[ 2 ] * 255;
		}

		_ctx.putImageData( pixels, 0, 0 );
	}

	editor.on( "editorcreate", init );
}

function _RGBToHSL( r, g, b ) {
	var	min = Math.min( r, g, b ),
		max = Math.max( r, g, b ),
		diff = max - min,
		h = 0,
		s = 0,
		l = ( min + max ) / 2;

	if ( diff !== 0 ) {
		s = l < 0.5 ? diff / ( max + min ) : diff / ( 2 - max - min );

		if ( r === max ) {
			h = ( g - b ) / diff;
		} else if ( g === max ) {
			h = 2 + ( b - r );
		} else {
			h = 4 + ( r - g ) / diff;
		}

		h *= 60;
	}

	return [ h, s, l ];
}

function _HSLToRGB( h, s, l ) {
	var temp1, temp2, rtemp, gtemp, btemp, rgb, i;

	if ( s === 0 ) {
		return [ l, l, l ];
	}

	temp2 = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
	temp1 = 2 * l - temp2;

	h /= 360;

	rtemp = ( h + 1 / 3 ) % 1;
	gtemp = h;
	btemp = ( h + 2 / 3 ) % 1;
	rgb = [ rtemp, gtemp, btemp ];

	for ( i = 0; i < 3; ++i ) {
		if ( rgb[ i ] < 1 / 6 ) {
			rgb[ i ] = temp1 + ( temp2 - temp1 ) * 6 * rgb[ i ];
		} else if ( rgb[ i ] < 1 / 2 ) {
			rgb[ i ] = temp2;
		} else if ( rgb[ i ] < 2 / 3 ) {
			rgb[ i ] = temp1 + ( temp2 - temp1 ) * 6 * ( 2 / 3 - rgb[ i ] );
		} else {
			rgb[ i ] = temp1;
		}
	}

	return rgb;
}

module.exports = SaturationPlugin;
