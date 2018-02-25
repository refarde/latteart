function LomoFilter( editor ) {
	console.log( editor.id + ": Lomo filter" );

	function applyLomo() {
		var canvas = editor.canvas,
			ctx = editor.context2d,
			width = canvas.width,
			height = canvas.height,
			pixels = ctx.getImageData( 0, 0, width, height );

		editor.filters.lomo( pixels.data, width, height );
		ctx.putImageData( pixels, 0, 0 );
		editor.history.push();
	}

	editor.ui.widgets.filter_lomo.element.on( "click", applyLomo );
}

module.exports = LomoFilter;
