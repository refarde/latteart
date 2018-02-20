function FilterPlugin( editor ) {
	console.log( editor.id + ": Filter" );

	var _$btnFilter, _ui;

	function init() {
		var // configs = editor.configs,
			loadedUserFilters = editor.userFilters,
			name;

		// if ( !configs || !configs.filter ) {
		// 	return;
		// }

		_$btnFilter = editor.ui.widgets.filter.element;
		_ui = editor.ui;

		for ( name in loadedUserFilters ) {

			// if ( configs.filter.indexOf( name ) === -1 ) {
			// 	continue;
			// }

			loadedUserFilters[ name ]( editor );
		}

		_$btnFilter.on( "click", function() {
			_ui.toggleFilterbar( true );
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = FilterPlugin;
