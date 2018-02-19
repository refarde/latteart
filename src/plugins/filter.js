function FilterPlugin( editor ) {
	console.log( editor.id + ": Filter" );

	var _$btnFilter, _ui;

	function init() {
		var // configs = editor.configs,
			loadedFilters = editor.filters,
			name;

		// if ( !configs || !configs.filter ) {
		// 	return;
		// }

		_$btnFilter = editor.ui.widgets.filter.element;
		_ui = editor.ui;

		for ( name in loadedFilters ) {

			// if ( configs.filter.indexOf( name ) === -1 ) {
			// 	continue;
			// }

			loadedFilters[ name ]( editor );
		}

		_$btnFilter.on( "click", function() {
			_ui.toggleFilterbar( true );
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = FilterPlugin;
