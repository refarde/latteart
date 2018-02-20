function LoadPlugin( editor ) {
	console.log( editor.id + ": load" );

	var $ = editor.$,
		_$dummyInput, _$btnLoad,
		_canvas, _ctx;

	function init() {
		_$dummyInput =
			$( "<input type=\"file\" id=\"input\"/>" )
				.on( "change", function( e ) {
					var img = new window.Image();

					img.onload = function() {
						_canvas.width = this.naturalWidth;
						_canvas.height = this.naturalHeight;
						_ctx.drawImage( img, 0, 0, this.naturalWidth, this.naturalHeight );
						editor.history.clear();
						editor.history.push();
						editor.info = {
							brightness: 0,
							saturation: 0,
							contrast: 1
						};
						editor.ui.toggleRangebar( false );
					};

					img.src = window.URL.createObjectURL( e.target.files[ 0 ] );
				} );

		_canvas = editor.canvas;
		_ctx = editor.context2d;
		_$btnLoad = editor.ui.widgets.load.element;

		_$btnLoad.on( "click", function() {
			_$dummyInput.trigger( "click" );
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = LoadPlugin;
