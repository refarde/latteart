function GrayScaleFilter( editor ) {
	console.log( editor.id + ": GrayScale filter" );

	function applyGrayScale() {
		var canvas = editor.canvas,
			ctx = editor.context2d,
			pixels = ctx.getImageData( 0, 0, canvas.width, canvas.height ),
			data = pixels.data,
			length = data.length,
			brightness, i;

		for ( i = 0; i < length; i += 4 ) {
			brightness = 0.34 * data[ i ] + 0.5 * data[ i + 1 ] + 0.16 * data[ i + 2 ];
			data[ i ] = brightness;
			data[ i + 1 ] = brightness;
			data[ i + 2 ] = brightness;
		}

		ctx.putImageData( pixels, 0, 0 );

		editor.history.push();
	}

	editor.ui.widgets.filter_grayscale.element.on( "click", applyGrayScale );
}

module.exports = GrayScaleFilter;
