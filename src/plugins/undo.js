function UndoPlugin( editor ) {
	console.log( editor.id + ": Undo" );

	var _widgetUndo, _$btnUndo;

	function init() {
		_widgetUndo = editor.ui.widgets.undo;
		_$btnUndo = _widgetUndo.element;

		_widgetUndo.disable();

		editor.on( "historychange", function( e ) {
			if ( e.current > 0 ) {
				_widgetUndo.enable();
			} else {
				_widgetUndo.disable();
			}
		} );

		_$btnUndo.on( "click", function() {
			editor.history.undo();
		} );
	}

	editor.on( "editorinit", init );
}

module.exports = UndoPlugin;
