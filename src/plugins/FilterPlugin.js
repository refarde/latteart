function FilterPlugin( editor ) {
	console.log( editor.id + ": Filter" );

	var _$btnFilter, _ui;

	function init() {
		var // configs = editor.configs,
			loadedUserFilters = editor.userFilters,
			length = loadedUserFilters.length,
			i, name;

		// if ( !configs || !configs.filter ) {
		// 	return;
		// }

		_$btnFilter = editor.ui.widgets.filter.element;
		_ui = editor.ui;

		for ( i = 0; i < length; i++ ) {
			name = loadedUserFilters[ i ];

			// if ( configs.filter.indexOf( name ) === -1 ) {
			// 	continue;
			// }

			register( name );
		}

		_$btnFilter.on( "click", function() {
			_ui.toggleFilterbar( true );
		} );
	}

	function register( name ) {
		if ( !editor.filters[ name ] ) {
			return;
		}

		editor.ui.widgets[ "filter_" + name ].element.on( "click", function() {
			var canvas = editor.canvas,
				ctx = editor.context2d,
				width = canvas.width,
				height = canvas.height,
				pixels = ctx.getImageData( 0, 0, width, height );

			editor.filters[ name ]( pixels.data, width, height );
			ctx.putImageData( pixels, 0, 0 );
			editor.history.push();
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = FilterPlugin;
