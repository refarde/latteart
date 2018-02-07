function FlipPlugin( editor ) {
	console.log( editor.id + ": flip" );

	var $ = editor.$,
		_$btnFlip, _dummyCanvas, _dummyCtx,
		_canvas, _ctx;

	function init() {
		_dummyCanvas = $( "<canvas />" )[ 0 ];
		_dummyCtx = _dummyCanvas.getContext( "2d" );

		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
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
		} );
	}

	editor.on( "editorcreate", init );
}

module.exports = FlipPlugin;
