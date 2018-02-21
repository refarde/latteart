function VintageFilter( editor ) {
	console.log( editor.id + ": Vintage filter" );

	function applyVintage() {
		var canvas = editor.canvas,
			ctx = editor.context2d,
			width = canvas.width,
			height = canvas.height,
			pixels = ctx.getImageData( 0, 0, width, height );

		editor.filters.vintage( pixels.data, width, height );
		ctx.putImageData( pixels, 0, 0 );
		editor.history.push();
	}

	editor.ui.widgets.filter_vintage.element.on( "click", applyVintage );
}

module.exports = VintageFilter;
