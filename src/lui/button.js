module.exports = function( $ ) {
	var lastActive,
		clsStateActive = "lui-state-active",
		clsIcon = "lui-icon";

	$.widget( "lui.button", {
		options: {

			// custom
			togglable: false,
			click: null,
			pressed: false,
			iconOnly: false,

			disabled: false,
			label: null,
			tooltip: true,
			icons: {
				primary: null,
				secondary: null
			}
		},

		_create: function() {
			var options = this.options,
				buttonText = options.label || "&#160;",
				icons = options.icons,
				tooltip = options.tooltip,
				buttonClasses = "lui-button lui-widget lui-state-default lui-corner-all",
				contents = [ "<span class=\"lui-button-text\">" + buttonText + "</span>" ];

			this.htmlData = {
				tag: "button",
				attr: {
					type: "button",
					role: "button"
				}
			};

			if ( icons.primary || icons.secondary ) {
				if ( icons.primary ) {
					contents.unshift( "<span class='" +  this._makeIconClasses( "primary" ) + "'></span>" );
				}

				if ( icons.secondary ) {
					contents.push( "<span class='" + this._makeIconClasses( "secondary" ) + "'></span>" );
				}
			}

			if ( tooltip ) {
				this._title = $.trim( ( typeof tooltip === "string" ) ? tooltip : buttonText );
				this.htmlData.attr.title = this._title;
			}

			if ( options.pressed ) {
				buttonClasses.push( "lui-toggle-on" );
				this.htmlData.attr[ "aria-pressed" ] = "true";
			}

			if ( options.disabled ) {
				buttonClasses.push( "lui-state-disabled" );
				this.htmlData.attr.disabled = "true";
			}

			this.htmlData.attr.className = buttonClasses;
			this.htmlData.contents = contents;
		},

		_init: function() {
			var options = this.options,
				toggleButton = options.togglable,
				activeClass = !toggleButton ? clsStateActive : "";

			if ( typeof this.options.disabled !== "boolean" ) {
				this.options.disabled = !!this.element.prop( "disabled" );
			} else {
				this.element.prop( "disabled", this.options.disabled );
			}

			this.buttonElement = this.element;

			if ( options.label === null ) {
				options.label = ( this.type === "input" ? this.buttonElement.val() : this.buttonElement.html() );
			}

			this._hoverable( this.buttonElement );

			this.buttonElement
				.on( "mouseenter" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return;
					}
					if ( this === lastActive ) {
						$( this ).addClass( clsStateActive );
					}
				} )
				.on( "mouseleave" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return;
					}
					$( this ).removeClass( activeClass );
				} )
				.on( "click" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						event.preventDefault();
						event.stopImmediatePropagation();
					}

					if ( options.click && $.isFunction( options.click ) ) {
						options.click( event );
					}
				} );

				this._manageToggle();
		},

		_destroy: function() {
			this.buttonElement.off();
		},

		widget: function() {
			return this.buttonElement;
		},

		_manageToggle: function() {
			var that = this,
				options = this.options,
				toggleButton = options.togglable,
				namespace = this.eventNamespace;

			if ( toggleButton ) {
				this.buttonElement.on( "click.togglable" + namespace, function() {
					if ( options.disabled ) {
						return false;
					}

					that._press( !options.pressed );
				} );
			} else {
				this.buttonElement
					.on( "mousedown" + namespace, function() {
						if ( options.disabled ) {
							return false;
						}
						$( this ).addClass( clsStateActive );
						lastActive = this;
						that.document.one( "mouseup" + namespace, function() {
							lastActive = null;
						} );
					} )
					.on( "mouseup" + namespace, function() {
						if ( options.disabled ) {
							return false;
						}
						$( this ).removeClass( clsStateActive );
					} )
					.on( "keydown" + namespace, function( event ) {
						if ( options.disabled ) {
							return false;
						}
						if ( event.keyCode === $.lui.keyCode.SPACE || event.keyCode === $.lui.keyCode.ENTER ) {
							$( this ).addClass( clsStateActive );
						}
					} )
					.on( "keyup" + namespace + " blur" + namespace, function() {
						$( this ).removeClass( clsStateActive );
					} );
			}
		},

		_setOption: function( key, value ) {
			var buttonElement;

			this._super( key, value );

			if ( key === "disabled" ) {
				buttonElement = this.buttonElement;
				this.widget().toggleClass( "lui-state-disabled", !!value );
				this.element.prop( "disabled", !!value );

				if ( value ) {
					if ( this.option.togglable ) {
						buttonElement.removeClass( "lui-state-focus" );
					} else {
						buttonElement.removeClass( "lui-state-focus " + clsStateActive );
					}

					this._trigger( "disabled" );

					if ( buttonElement.attr( "title" ) ) {
						buttonElement.removeAttr( "title" );
					}
				} else {
					if ( this._title ) {
						buttonElement.attr( "title", this._title );
					}

					this._trigger( "enabled" );
				}
				return;
			} else if ( key === "togglable" ) {
				this._manageToggle();
			} else if ( key === "pressed" ) {
				this._press();
				return;
			}

			this._resetButton();
		},

		refresh: function() {
			var isDisabled = this.element.is( "input, button" ) ?
								this.element.is( ":disabled" ) :
									this.element.hasClass( "lui-button-disabled" );

			if ( isDisabled !== this.options.disabled ) {
				this._setOption( "disabled", isDisabled );
			}
		},

		_makeButtonClasses: function( classes ) {
			var icons = this.options.icons,
				multipleIcons = icons.primary && icons.secondary,
				addition;

			if ( icons.primary || icons.secondary ) {
				if ( !this.options.iconOnly ) {
					addition = "lui-button-text-icon";

					if ( multipleIcons ) {
						addition += "s";
					} else {
						addition = icons.primary ? "-primary" : "-secondary";
					}
				} else if ( multipleIcons ) {
					addition = "lui-button-icons-only";
				} else {
					addition = "lui-button-icon-only";
				}
			} else {
				addition = classes.push( "lui-button-text-only" );
			}

			classes.push( addition );

			return classes;
		},

		_makeIconClasses: function( type ) {
			var icons = this.options.icons;
			return "lui-button-icon-" + type + " " + clsIcon + " " + clsIcon + "-" + icons[ type ];
		},

		_resetButton: function() {
			var buttonElement = this.buttonElement.removeClass(
					"lui-button-icons-only " +
					"lui-button-icon-onlyc " +
					"lui-button-text-icons " +
					"lui-button-text-icon-primary " +
					"lui-button-text-icon-secondary " +
					"lui-button-text-only"
				),
				buttonText = $( "<span></span>", this.document[ 0 ] )
					.addClass( "lui-button-text" )
					.html( this.options.label )
					.appendTo( buttonElement.empty() )
					.text(),
				icons = this.options.icons,
				tooltip = this.options.tooltip;

			if ( icons.primary || icons.secondary ) {
				if ( icons.primary ) {
					buttonElement.prepend( "<span class='" + this._makeIconClasses( "primary" ) + "'></span>" );
				}

				if ( icons.secondary ) {
					buttonElement.append( "<span class='" + this._makeIconClasses( "secondary" ) + "'></span>" );
				}
			} else {
				buttonElement.addClass( "lui-button-text-only" );
			}

			if ( tooltip ) {
				buttonElement.attr( "title", $.trim( ( typeof tooltip === "string" ) ? tooltip : buttonText ) );
			}

			this._press();
		},

		_press: function( pressed ) {
			if ( typeof pressed === "undefined" ) {
				pressed = this.options.pressed;
			}

			this.buttonElement[ pressed ? "addClass" : "removeClass" ]( "lui-toggle-on" )
				.attr( "aria-pressed", pressed );

			this.options.pressed = pressed;
		}
	} );

	return $.lui.Button;
};
