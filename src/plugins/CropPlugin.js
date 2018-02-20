function CropPlugin( editor ) {
	console.log( editor.id + ": crop" );

	var $ = editor.$,
		_$btnCrop, _windowSize,
		_$viewport, _$overlay,
		_canvas;

	function init() {
		var w = window,
			d = w.document,
			e = d.documentElement,
			g = d.getElementsByTagName( "body" )[ 0 ];

		_canvas = editor.getCanvas();
		_$btnCrop = editor.ui.widgets.flip.element;
		_windowSize = {
			width: w.innerWidth || e.clientWidth || g.clientWidth,
			height: w.innerWidth || e.clientWidth || g.clientWidth
		};

		_createControl();

		_$btnCrop.on( "click", function() {
			_$viewport.show();
			_$overlay.show();

			//editor.history.push();
		} );
	}

	function _createControl() {
		_$viewport =
			$( "<div class=\"lui-viewport\" tabindex=\"0\"  style=\"" +
				"width:100vw; height:100vh;" +
				"\"></div>" );
		_$overlay =
			$( "<div class=\"lui-overlay\" style=\"" +
				[
					"width:" + _canvas.width + "px",
					"height:" + _canvas.height + "px",
					"top:" + ( ( _windowSize.height - _canvas.height ) / 2 ) + "px",
					"left:" + ( ( _windowSize.width - _canvas.width ) / 2 ) + "px"
				].join( ";" ) +
				"\"></div>" );

		$( _canvas ).after( _$viewport ).after( _$overlay );
	}

	editor.on( "editorcreate", init );
}

module.exports = CropPlugin;
