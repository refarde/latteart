function FlipPlugin( editor ) {
	console.log( editor.id + ": flip" );

	var _$btnFlip, _dummyCanvas, _dummyCtx,
		_canvas, _ctx;

	function init() {
		_canvas = editor.canvas;
		_ctx = editor.context2d;
		_dummyCanvas = editor.dummyCanvas;
		_dummyCtx = editor.dummyContext2d;

		_$btnFlip = editor.ui.widgets.flip.element;

		_$btnFlip.on( "click", function() {
			_dummyCanvas.width = _canvas.width;
			_dummyCanvas.height = _canvas.height;

			_dummyCtx.clearRect( 0, 0, _dummyCanvas.width, _dummyCanvas.height );
			_dummyCtx.save();
			_dummyCtx.scale( -1, 1 );
			_dummyCtx.drawImage( _canvas, 0, 0, -_dummyCanvas.width, _dummyCanvas.height );
			_dummyCtx.restore();

			_ctx.clearRect( 0, 0, _canvas.width, _canvas.height );
			_ctx.drawImage( _dummyCanvas, 0, 0, _canvas.width, _canvas.height, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
			editor.history.push();
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = FlipPlugin;
