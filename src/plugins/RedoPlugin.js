function RedoPlugin( editor ) {
	console.log( editor.id + ": Redo" );

	var _widgetRedo, _$btnRedo;

	function init() {
		_widgetRedo = editor.ui.widgets.redo;
		_$btnRedo = _widgetRedo.element;

		_widgetRedo.disable();

		editor.on( "historychange", function( e ) {
			if ( e.current > -1 && e.current < e.histories - 1 ) {
				_widgetRedo.enable();
			} else {
				_widgetRedo.disable();
			}
		} );

		_$btnRedo.on( "click", function() {
			editor.history.redo();
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = RedoPlugin;
