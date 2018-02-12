function BrightnessPlugin( editor ) {
	console.log( editor.id + ": Brightness" );

	var _$btnBrightness;

	function init() {
		_$btnBrightness = editor.ui.widgets.brightness.element;
		_$btnBrightness.on( "click", function() {
			editor.ui.$container.find( ".lui-toolbar" ).addClass( "lui-rangebar-visible" );
		} );

		editor.ui.widgets.rangebarback.element.on( "click", function() {
			editor.ui.$container.find( ".lui-toolbar" ).removeClass( "lui-rangebar-visible" );
		} );
	}

	editor.on( "editorcreate", init );
}

module.exports = BrightnessPlugin;
