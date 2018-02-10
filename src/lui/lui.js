module.exports = function( $, env ) {
	require( "./core.js" )( $, env );
	require( "./widget.js" )( $ );
	require( "./container.js" )( $ );
	require( "./canvas.js" )( $ );
	require( "./button.js" )( $ );
	require( "./slider.js" )( $ );
};
