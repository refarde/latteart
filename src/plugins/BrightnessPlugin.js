function BrightnessPlugin( editor ) {
	console.log( editor.id + ": Brightness" );

	var _ctx, _canvas, _dummyCanvas, _dummyCtx,
		_$btnBrightness, _ui;

	function init() {
		_canvas = editor.canvas;
		_ctx = editor.context2d;
		_dummyCanvas = editor.dummyCanvas;
		_dummyCtx = editor.dummyContext2d;

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
					editor.history.push();
				} );

			_ui.toggleRangebar( true );
		} );
	}

	function _setBrightness( value ) {
		var pixels;

		_ctx.drawImage( _dummyCanvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
		pixels = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );
		editor.filter.brightness( pixels.data, value );
		_ctx.putImageData( pixels, 0, 0 );
	}

	editor.on( "editorinit", init );
}

module.exports = BrightnessPlugin;
