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
						_canvas.width = this.width;
						_canvas.height = this.height;
						_ctx.drawImage( img, 0, 0, this.width, this.height );
						editor.history.clear();
						editor.history.push();
					};

					img.src = window.URL.createObjectURL( e.target.files[ 0 ] );
				} );

		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
		_$btnLoad = editor.ui.widgets.load.element;

		_$btnLoad.on( "click", function() {
			_$dummyInput.trigger( "click" );
		} );
	}

	editor.on( "editorcreate", init );
}

module.exports = LoadPlugin;
