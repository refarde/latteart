
/*!
 * Extracted from requestAnimationFrame polyfill by Erik Möller.
 * ( Fixes from Paul Irish and Tino Zijdel )
 * MIT license
 *
 * https://gist.github.com/paulirish/1579671
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */

module.export = function() {
	"use strict";

	var lastTime = 0,
		rAF = window.requestAnimationFrame,
		cAF = window.cancelAnimationFrame ||
			window.cancelRequestAnimationFrame;

	if ( !rAF ) {
		rAF = function( callback ) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
				id = window.setTimeout( function() {
						callback( currTime + timeToCall );
					}, timeToCall );

			lastTime = currTime + timeToCall;

			return id;
		};
	}

	if ( !cAF ) {
		cAF = function( requestID ) {
			window.clearTimeout( requestID );
		};
	}

	return {
		request: rAF,
		cancel: cAF
	};
};
