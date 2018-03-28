function ZoomPlugin( editor ) {
	console.log( editor.id + ": Zoom" );

	var $ = editor.$;

	function init() {
		var container = editor.ui.getContainer(),
			canvas = editor.ui.getCanvas();

		$( container ).on( "wheel.latteart mousewheel.latteart", function( e ) {
			var delta = ( e.originalEvent.wheelDelta !== undefined ) ?
				e.originalEvent.wheelDelta :
				e.originalEvent.deltaY * -1;

			delta = ( 10 * ( delta < 0 ? -1 : 1 )  );

			$( canvas ).css( {
				width: parseInt( $( canvas ).css( "width" ) ) + delta,
				height: parseInt( $( canvas ).css( "height" ) ) + delta
			} );
		} );

	}

	editor.on( "editorinit", init );
}

module.exports = ZoomPlugin;
