function RotationPlugin( editor ) {
	console.log( editor.id + ": rotation" );

	var $ = editor.$,
		_$btnRotate, _dummyCanvas, _dummyCtx,
		_canvas, _ctx;

	function init() {
		_dummyCanvas = $( "<canvas />" )[ 0 ];
		_dummyCtx = _dummyCanvas.getContext( "2d" );

		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
		_$btnRotate = editor.ui.widgets.rotation.element;

		_$btnRotate.on( "click", function() {
			_dummyCanvas.width = _canvas.height;
			_dummyCanvas.height = _canvas.width;

			_dummyCtx.clearRect( 0, 0, _dummyCanvas.width, _dummyCanvas.height );
			_dummyCtx.translate( _dummyCanvas.width / 2, _dummyCanvas.height / 2 );
			_dummyCtx.rotate( 0.5 * Math.PI );
			_dummyCtx.translate( -_dummyCanvas.height / 2, -_dummyCanvas.width / 2 );
			_dummyCtx.drawImage( _canvas, 0, 0 );

			_canvas.width = _dummyCanvas.width;
			_canvas.height = _dummyCanvas.height;

			_ctx.clearRect( 0, 0, _canvas.width, _canvas.height );
			_ctx.drawImage( _dummyCanvas, 0, 0, _canvas.width, _canvas.height, 0, 0, _dummyCanvas.width, _dummyCanvas.height );
		} );
	}

	editor.on( "editorcreate", init );
}

module.exports = RotationPlugin;
