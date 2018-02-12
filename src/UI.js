
function UI( editor ) {
	var self = this,
		$;

	self.editor = editor;
	self.$ = $ = editor.$;
	self.$container = null;
	self.$canvas = null;
	self.context2d = null;

	if ( !$.lui ) {
		require( "./lui/lui.js" )( $, editor.env );
	}
}

UI.prototype = {
	create: function( data ) {
		var self = this,
			$ = self.$,
			target, uiData;

		if ( !data || !data.targetId ) {
			return;
		}

		target = $( "#" + data.targetId )[ 0 ];

		if ( !target ) {
			return;
		}

		uiData = self._init( {
			configs: data.configs
		} );

		self.widgets = uiData.widgets;
		self.configs = uiData.configs;

		self._render( target, uiData.htmlData );
	},

	_init: function( data ) {
		var self = this,
			$ = self.$,
			uiData = {
				widgets: {},
				htmlData: null,
				configs: {}
			};

		data = data || {};
		uiData.configs = $.extend( {
			navbar: {
				left: [ "undo", "redo" ],
				right: [ "load", "save" ]
			},
			toolbar: [ "rotation", "flip", "crop", "brightness", "contrast", "saturation", "text", "brush" ]
		}, data.configs );

		self._createContainer( uiData );
		self._createRenderer( uiData );
		self._createNavbar( uiData );
		self._createToolbar( uiData );

		return uiData;
	},

	_createContainer: function( uiData ) {
		var $ = this.$,
			widget = $.lui.container(),
			widgetData = widget.getHTMLData();

		widgetData.attr.className.push( "lui-latteart", "lui-skin-default" );
		uiData.htmlData = widgetData;
		uiData.widgets.container = widget;
	},

	_createNavbar: function( uiData ) {
		var $ = this.$,
			configs = uiData.configs || {},
			navbarConfig = configs.navbar,
			navbar = $.lui.container(),
			navbarData = navbar.getHTMLData(),
			createControlSet = function( pos ) {
				var posLowerCase = pos.toLowerCase(),
					config = navbarConfig[ posLowerCase ],
					i, length,
					controlConfig, control, controlData,
					controlSet, controlSetData;

				if ( !config ) {
					return;
				}

				controlSet = $.lui.container();
				controlSetData = controlSet.getHTMLData();
				length = config.length;

				for ( i = 0; i < length; i++ ) {
					controlConfig = config[ i ];
					control = $.lui.button( {
						label: controlConfig,
						icons: {
							primary: controlConfig
						}
					} );
					controlData = control.getHTMLData();
					controlSetData.contents.push( controlData );
					uiData.widgets[ controlConfig ] = control;
				}

				controlSetData.attr.className.push( "lui-bar-" + posLowerCase );
				navbarData.contents.push( controlSetData );
				uiData.widgets[ "navbar" + pos ] = controlSet;
			};

		if ( navbarConfig !== false ) {
			createControlSet( "Left" );
			createControlSet( "Right" );
		}

		navbarData.attr.className.push( "lui-area", "lui-bar", "lui-navbar" );
		uiData.htmlData.contents.push( navbarData );
		uiData.widgets.navbar = navbar;
	},

	_createRenderer: function( uiData ) {
		var $ = this.$,
			renderer = $.lui.container(),
			rendererData = renderer.getHTMLData(),
			canvaswrap = $.lui.container(),
			canvaswrapData = canvaswrap.getHTMLData(),
			canvas = $.lui.canvas(),
			canvasData = canvas.getHTMLData();

		canvaswrapData.contents.push( canvasData );
		uiData.widgets.canvas = canvas;

		canvaswrapData.attr.className.push( "lui-canvas-wrap" );
		rendererData.contents.push( canvaswrapData );
		uiData.widgets.canvaswrap = canvaswrap;

		rendererData.attr.className.push( "lui-area lui-renderer" );
		uiData.htmlData.contents.push( rendererData );
		uiData.widgets.renderer = renderer;
	},

	_createToolbar: function( uiData ) {
		var self = this,
			$ = self.$,
			configs = uiData.configs || {},
			toolbar = $.lui.container(),
			toolbarData = toolbar.getHTMLData();

		if ( configs.toolbar === false ) {
			return;
		}

		self._createMainbar( uiData, toolbarData );
		self._createRangebar( uiData, toolbarData );

		toolbarData.attr.className.push( "lui-area", "lui-bar", "lui-toolbar" );
		uiData.htmlData.contents.push( toolbarData );
		uiData.widgets.mainbar = toolbar;
	},

	_createMainbar: function( uiData, toolbarData ) {
		var $ = this.$,
			configs = uiData.configs || {},
			mainbar = $.lui.container(),
			mainbarData = mainbar.getHTMLData(),
			config = configs.toolbar,
			length = config.length,
			i, controlConfig, control, controlData;

		for ( i = 0; i < length; i++ ) {
			controlConfig = config[ i ];
			control = $.lui.button( {
				label: controlConfig,
				icons: {
					primary: controlConfig
				}
			} );
			controlData = control.getHTMLData();
			mainbarData.contents.push( controlData );
			uiData.widgets[ controlConfig ] = control;
		}

		mainbarData.attr.className.push( "lui-bar", "lui-mainbar" );
		toolbarData.contents.push( mainbarData );
		uiData.widgets.mainbar = mainbar;
	},

	_createRangebar: function( uiData, toolbarData ) {
		var $ = this.$,
			rangebar = $.lui.container(),
			rangebarData = rangebar.getHTMLData(),
			backButton, backButtonData,
			backButtonWrap, backButtonWrapData,
			slider, sliderData;

		backButtonWrap = $.lui.container();
		backButtonWrapData = backButtonWrap.getHTMLData();
		backButton = $.lui.button( {
			label: "back",
			icons: {
				primary: "back"
			}
		} );
		backButtonData = backButton.getHTMLData();
		backButtonWrapData.attr.className.push( "lui-part-back" );
		backButtonWrapData.contents.push( backButtonData );
		rangebarData.contents.push( backButtonWrapData );
		uiData.widgets.rangebarback = backButton;

		slider = $.lui.slider();
		sliderData = slider.getHTMLData();
		backButtonData.attr.className.push( "lui-part-slider" );
		rangebarData.contents.push( sliderData );
		uiData.widgets.slider = slider;

		rangebarData.attr.className.push( "lui-rangebar" );
		toolbarData.contents.push( rangebarData );
		uiData.widgets.rangebar = rangebar;
	},

	_render: function( target, htmlData ) {
		var self = this,
			editor = self.editor,
			$ = self.$,
			$target = $( target ),
			$container = $( $.lui.makeHTML( htmlData ) );

		$target.one( "drewui", function( e ) {
			var $buildedContainer = $( e.relatedTarget ),
				result = true;

			$buildedContainer.css( "display", "block" );

			try {
				self._postRender();
			} catch ( err ) {

				// !주:
				// IE에서 메모리 누수 없이 DOM 을 삭제하려면 Node.removeChild()를 사용하는 것보다
				// outerHTML을 빈문자열로 치환해주는 것이 더 효과적임.
				// 이는 경험적인 내용으로, 타 브라우저에는 적용이 안되거나 업데이트 등을 통해 변경될 수 있음.
				$buildedContainer[ 0 ].outerHTML = "";
				$target.css( "display", $target.attr( "data-la-before" ) || "block" );
				result = false;
			} finally {
				if ( result ) {
					self.$container = $buildedContainer;
				}

				editor.trigger( result ? "uicreate" : "uicreatefail" );
			}
		} );

		// draw UI
		this.$target =
			$target
				.attr( "data-la-before", $target.css( "display" ) )
				.css( "display", "none" )
				.after( $container )
				.trigger( {
					type: "drewui",
					relatedTarget: $container[ 0 ]
				} );
	},

	_postRender: function() {
		var widgets = this.widgets,
			key;

		for ( key in widgets ) {
			widgets[ key ].init();
		}
	},

	_final: function() {
		var self = this,
			$ = self.$,
			$target = self.$target;

		if ( $target ) {
			$target.css( "display", $target.attr( "data-la-before" ) || "block" );

			// 완벽한 데이터 삭제를 위해 show hide시 jQuery에 의해 자동 저장되는
			// target에 대한 olddisplay 데이터도 제거
			$._removeData( $target[ 0 ], "olddisplay" );

			self.$target = $target = null;
		}
	},

	destroy: function() {
		var key, widget,
			widgetList = [],
			self = this,
			widgets = self.widgets,
			container = self.getContainer();

		for ( key in widgets ) {
			widgetList.push( widgets[ key ] );
		}

		while ( widgetList.length ) {
			widget = widgetList.pop();
			widget.destroy();
			widget = null;
		}

		self._final( container );

		container.remove();

		self.$container = container = null;
		self.widgets = widgets = null;
		self.editor = null;
	},

	getContainer: function() {
		var self = this;

		if ( !self.$container ) {
			return null;
		}

		return self.$container[ 0 ];
	},

	getCanvas: function() {
		var self = this,
			$container = self.$container;

		if ( !$container ) {
			return null;
		}

		if ( !self.$canvas ) {
			self.$canvas = $container.find( ".lui-canvas" );
		}

		return self.$canvas[ 0 ];
	}
};

module.exports = UI;
