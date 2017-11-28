/*!
 * Extracted from threejs r84
 * https://threejs.org/
 *
 * Copyright © 2010-2017 three.js authors
 * Released under the MIT license
 * https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE
 */
module.export = function() {
	"use strict";

	function Vector2( x, y ) {
		this.x = x || 0;
		this.y = y || 0;
	}

	Vector2.prototype = {
		set: function( x, y ) {
			this.x = x || 0;
			this.y = y || 0;
		},

		clone: function() {
			return new Vector2( this.x, this.y );
		},

		copy: function( vector ) {
			this.x = vector.x;
			this.y = vector.y;
			return this;
		},

		clamp: function( minimum, maximum ) {
			var minimumSet = minimum !== null && minimum !== undefined,
				maximumSet = maximum !== null && maximum !== undefined;

			if ( minimumSet ) {
				if ( !( minimum instanceof Vector2 ) ) {
					minimum = new Vector2( minimum, minimum );
				}

				this.x = Math.max( minimum.x, this.x );
				this.y = Math.max( minimum.y, this.y );
			}

			if ( maximumSet ) {
				if ( !( maximum instanceof Vector2 ) ) {
					maximum = new Vector2( maximum, maximum );
				}

				this.x = Math.min( maximum.x, this.x );
				this.y = Math.min( maximum.y, this.y );
			}

			return this;
		},

		divide: function( vector ) {
			this.x /= vector.x;
			this.y /= vector.y;
			return this;
		},

		multiply: function( vector ) {
			this.x *= vector.x;
			this.y *= vector.y;
			return this;
		},

		subtract: function( vector ) {
			this.x -= vector.x;
			this.y -= vector.y;
			return this;
		},

		add: function( vector ) {
			this.x += vector.x;
			this.y += vector.y;
			return this;
		},

		equals: function( vector ) {
			return ( this.x === vector.x && this.y === vector.y );
		},

		round: function() {
			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			return this;
		},

		ceil: function() {
			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			return this;
		}
	};

	return Vector2;
};
