module.exports = function( $ ) {
	var uiPrefix = "lui-";

	$.lui = $.lui || {};

	$.extend( $.lui, {
		prefix: uiPrefix,

		keyCode: {
			BACKSPACE: 8,
			COMMA: 188,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			LEFT: 37,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SPACE: 32,
			TAB: 9,
			UP: 38
		},

		/**
		 * _isFunction check function
		 *
		 * @param {function} func function object
		 * @return {boolean} check function object
		 */
		isFunction: function( func ) {
			return ( typeof func === "function" );
		},

		addPrefixToClasses: function( classes ) {
			for ( var i = 0, length = classes.length; i < length; i++ ) {
				classes[ i ] = uiPrefix + classes[ i ];
			}

			return classes;
		},

		makeHTML: function( htmlData ) {
			var str, attr, contents, key, value, i, length;

			if ( !htmlData || !htmlData.tag ) {
				return ( typeof htmlData === "string" ) ? htmlData : "";
			}

			str = "<" + htmlData.tag;
			attr = htmlData.attr;
			if ( attr ) {
				for ( key in attr ) {
					value = attr[ key ];
					str += " " + ( key === "className" ? "class" : key ) + "=\"" +
						( Array.isArray( value ) ? value.join( " " ) : value ) + "\"";
				}
			}
			str += ">";

			contents = htmlData.contents;

			if ( contents ) {
				for ( i = 0, length = contents.length; i < length; i++ ) {
					str += this.makeHTML( contents[ i ] );
				}
			}

			str += "</" + htmlData.tag + ">";

			if ( htmlData.after ) {
				str += this.makeHTML( htmlData.after );
			}

			return str;
		},

		// http://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
		getScrollbarWidth: function() {
			var document = window.document,
				widthNoScroll, inner, widthWithScroll, outer;

			if ( this._scrollbarWidth ) {
				return this._scrollbarWidth;
			}

			outer = document.createElement( "div" );
			outer.style.visibility = "hidden";
			outer.style.width = "100px";
			document.body.appendChild( outer );

			widthNoScroll = outer.offsetWidth;

			// force scrollbars
			outer.style.overflow = "scroll";

			// add innerdiv
			inner = document.createElement( "div" );
			inner.style.width = "100%";
			outer.appendChild( inner );

			widthWithScroll = inner.offsetWidth;

			// remove divs
			outer.parentNode.removeChild( outer );

			this._scrollbarWidth = widthNoScroll - widthWithScroll;

			return this._scrollbarWidth;
		}
	} );

	// plugins
	$.fn.extend( {
		uniqueId: ( function() {
			var uuid = 0;

			return function() {
				return this.each( function() {
					if ( !this.id ) {
						this.id = uiPrefix + "id-" + ( ++uuid );
					}
				} );
			};
		} )(),

		removeUniqueId: function() {
			return this.each( function() {
				if ( new RegExp( "^" + uiPrefix + "id-\\d+$" ).test( this.id ) ) {
					$( this ).removeAttr( "id" );
				}
			} );
		}
	} );

	function focusable( element, isTabIndexNotNaN ) {
		var map, mapName, img, result,
			nodeName = element.nodeName.toLowerCase();

		if ( "area" === nodeName ) {
			map = element.parentNode;
			mapName = map.name;
			if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
				return false;
			}
			img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
			return !!img && visible( img );
		}

		if ( /input|select|textarea|button|object/.test( nodeName ) ) {
			result = !element.disabled;
		} else if ( "a" === nodeName ) {
			result = element.href || isTabIndexNotNaN;
		} else {
			result = isTabIndexNotNaN;
		}

		// the element and all of its ancestors must be visible
		return result && visible( element );
	}

	function visible( element ) {
		return $.expr.filters.visible( element ) &&
			!$( element ).parents().addBack().filter( function() {
				return $.css( this, "visibility" ) === "hidden";
			} ).length;
	}

	$.extend( $.expr[ ":" ], {
		data: $.expr.createPseudo( function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		} ),

		focusable: function( element ) {
			return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
		},

		tabbable: function( element ) {
			var tabIndex = $.attr( element, "tabindex" ),
				isTabIndexNaN = isNaN( tabIndex );
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
		}
	} );

	// $.lui.plugin is deprecated. Use $.widget() extensions instead.
	$.lui.plugin = {
		add: function( module, option, set ) {
			var i,
				proto = $.lui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},

		call: function( instance, name, args, allowDisconnected ) {
			var i,
				set = instance.plugins[ name ];

			if ( !set ) {
				return;
			}

			if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	};
};
