module.exports = function( $, env ) {
	require( "./core.js" )( $, env );
	require( "./widget.js" )( $ );
	require( "./container.js" )( $ );
	require( "./renderer.js" )( $ );
	require( "./button.js" )( $ );
};
