function CropPlugin( editor ) {
	console.log( editor.id + ": crop" );

	var $ = editor.$,
		_$btnCrop, _windowSize,
		_canvas, _ctx;

	function init() {
		var w = window,
			d = w.document,
			e = d.documentElement,
			g = d.getElementsByTagName( "body" )[ 0 ];

		_canvas = editor.getCanvas();
		_ctx = editor.getContext();
		_$btnCrop = editor.ui.widgets.flip.element;
		_windowSize = {
			width: w.innerWidth || e.clientWidth || g.clientWidth,
			height: w.innerWidth || e.clientWidth || g.clientWidth
		};

		this.elements = {};

		_$btnCrop.on( "click", function() {


			//editor.history.push();
		} );
	}

	function _create() {
		var self = this,
			$viewport =
				$( "<div class=\"lui-viewport\" tabindex=\"0\"  style=\"" +
					"width:100vw; height:100vh;" +
					"\"></div>" ),
			$overlay =
				$( "<div class=\"lui-overlay\" style=\"" +
					[
						"width:" + _canvas.width + "px",
						"height:" + _canvas.height + "px",
						"top:" + ( ( _windowSize.height - _canvas.height ) / 2 ) + "px",
						"left:" + ( ( _windowSize.width - _canvas.width ) / 2 ) + "px"
					].join( ";" ) +
					"\"></div>" );

		_canvas.after( $viewport ).after( $overlay );
	}

	editor.on( "editorcreate", init );
}

module.exports = CropPlugin;
