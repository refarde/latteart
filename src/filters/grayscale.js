function GrayScaleFilter( editor ) {
	console.log( editor.id + ": GrayScale filter" );

	function applyGrayScale() {
		var canvas = editor.canvas,
			ctx = editor.context2d,
			pixels = ctx.getImageData( 0, 0, canvas.width, canvas.height );

		editor.filter.grayscale( pixels.data );
		ctx.putImageData( pixels, 0, 0 );
		editor.history.push();
	}

	editor.ui.widgets.filter_grayscale.element.on( "click", applyGrayScale );
}

module.exports = GrayScaleFilter;
