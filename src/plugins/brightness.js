function BrightnessPlugin( editor ) {
	console.log( editor.id + ": Brightness" );

	var $ = editor.$,
		_ctx, _canvas, _dummyCanvas, _dummyCtx,
		_$btnBrightness, _ui;

	function init() {
		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
		_dummyCanvas = $( "<canvas />" )[ 0 ];
		_dummyCtx = _dummyCanvas.getContext( "2d" );

		_ui = editor.ui;
		_$btnBrightness = editor.ui.widgets.brightness.element;
		_$btnBrightness.on( "click", function() {
			_dummyCanvas.width = _canvas.width;
			_dummyCanvas.height = _canvas.height;

			_dummyCtx.clearRect( 0, 0, _dummyCanvas.width, _dummyCanvas.height );
			_dummyCtx.drawImage( _canvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );

			_ui.widgets.slider
				.option( {
					min: -100,
					max: 100,
					value: editor.info.brightness
				} )
				.element.on( "sliderchange.latte", function( e, ui ) {
					_setBrightness( ui.value );
					editor.info.brightness = ui.value;
				} );

			_ui.toggleRangebar( true );
		} );
	}

	function _setBrightness( value ) {
		var pixels, data, length, i;

		_ctx.drawImage( _dummyCanvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
		pixels = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );
		data = pixels.data;
		length = data.length;

		value = parseFloat( value ) || 0;

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] += value;
			data[ i + 1 ] += value;
			data[ i + 2 ] += value;
		}

		_ctx.putImageData( pixels, 0, 0 );
	}

	editor.on( "editorcreate", init );
}

module.exports = BrightnessPlugin;
