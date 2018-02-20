function ContrastPlugin( editor ) {
	console.log( editor.id + ": Contrast" );

	var _ctx, _canvas, _dummyCanvas, _dummyCtx,
		_$btnContrast, _ui;

	function init() {
		_canvas = editor.canvas;
		_ctx = editor.context2d;
		_dummyCanvas = editor.dummyCanvas;
		_dummyCtx = editor.dummyContext2d;

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
					editor.history.push();
				} );

			_ui.toggleRangebar( true );
		} );
	}

	function _setContrast( value ) {
		var pixels;

		_ctx.drawImage( _dummyCanvas, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
		pixels = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );
		editor.filter.contrast( pixels.data, value );
		_ctx.putImageData( pixels, 0, 0 );
	}

	editor.on( "editorinit", init );
}

module.exports = ContrastPlugin;
