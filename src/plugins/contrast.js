function ContrastPlugin( editor ) {
	console.log( editor.id + ": Contrast" );

	var $ = editor.$,
		_ctx, _canvas, _dummyCanvas, _dummyCtx,
		_$btnContrast, _ui;

	function init() {
		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
		_dummyCanvas = $( "<canvas />" )[ 0 ];
		_dummyCtx = _dummyCanvas.getContext( "2d" );

		_ui = editor.ui;
		_$btnContrast = editor.ui.widgets.contrast.element;
		_$btnContrast.on( "click", function() {
			_dummyCanvas.width = _canvas.width;
			_dummyCanvas.height = _canvas.height;

			_dummyCtx.clearRect( 0, 0, _dummyCanvas.width, _dummyCanvas.height );
			_dummyCtx.drawImage( _canvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );

			_ui.widgets.slider
				.option( {
					min: -100,
					max: 100,
					value: editor.info.contrast
				} )
				.element.on( "sliderchange.latte", function( e, ui ) {
					_setContrast( ui.value );
					editor.info.contrast = ui.value;
				} );

			_ui.toggleRangebar( true );
		} );
	}

	function _setContrast( value ) {
		var pixels, data, length, i;

		_ctx.drawImage( _dummyCanvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
		pixels = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );
		data = pixels.data;
		length = data.length;

		value = ( parseFloat( value ) || 1 );

		for ( i = 0; i < length; i += 4 ) {
			data[ i ] = ( ( ( ( data[ i ] / 255 ) - 0.5 ) * value ) + 0.5 ) * 255;
			data[ i + 1 ] = ( ( ( ( data[ i + 1 ] / 255 ) - 0.5 ) * value ) + 0.5 ) * 255;
			data[ i + 2 ] = ( ( ( ( data[ i + 2 ] / 255 ) - 0.5 ) * value ) + 0.5 ) * 255;
		}

		_ctx.putImageData( pixels, 0, 0 );
	}

	editor.on( "editorcreate", init );
}

module.exports = ContrastPlugin;
