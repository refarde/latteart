module.exports = function( editor ) {
	console.log( editor.id + ": save" );

	var IMAGE_MIMES = [ "image/png", "image/bmp", "image/gif", "image/jpeg", "image/tiff" ],
		acceptedMimes = [],
		$ = editor.$,
		_dummyLink, _$btnSave,
		_canvas;

	function init() {
		var i, length;

		_dummyLink = $( "<a/>" )[ 0 ];
		_canvas = editor.getCanvas();
		_$btnSave = editor.ui.widgets.save.element;

		length = IMAGE_MIMES.length;

		// 지원가능한 mime 검출
		for ( i = 0; i < length; i++ ) {
			if ( _canvas.toDataURL( IMAGE_MIMES[ i ] ).search( IMAGE_MIMES[ i ] ) >= 0 ) {
				acceptedMimes.push( IMAGE_MIMES[ i ] );
			}
		}

		_$btnSave.on( "click", function() {
			var mime = IMAGE_MIMES[ 0 ];

			_dummyLink.download = "la_image.png";
			_dummyLink.href = _canvas.toDataURL( mime ).replace( mime, "image/octet-stream" );
			_dummyLink.click();
		} );
	}

	editor.on( "editorcreate", init );
};
