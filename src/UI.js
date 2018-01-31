
function UI( editor ) {
	var self = this,
		$;

	self.editor = editor;
	$ = self.$ = editor.$;

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
				left: [ "load", "save", "undo", "redo" ],
				right: [ "zoom" ]
			},
			toolbar: [ "rotation", "flip", "crop", "brightness", "contrast", "saturation", "text", "brush" ]
		}, data.configs );

		self._createContainer( uiData );
		self._createNavbar( uiData );
		self._createRenderer( uiData );
		self._createToolbar( uiData );

		return uiData;
	},

	_createContainer: function( uiData ) {
		var $ = this.$,
			widget = $.lui.container(),
			widgetData = widget.getHTMLData();

		widgetData.attr.className.push( "la-latteart", "la-border-all" );
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
				var config = navbarConfig[ pos.toLowerCase() ],
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

				navbarData.contents.push( controlSetData );
				uiData.widgets[ "navbar" + pos ] = controlSet;
			};

		if ( navbarConfig !== false ) {
			createControlSet( "Left" );
			createControlSet( "Right" );
		}

		uiData.htmlData.contents.push( navbarData );
		uiData.widgets.navbar = navbar;
	},

	_createRenderer: function( uiData ) {
		var $ = this.$,
			renderer = $.lui.renderer(),
			rendererData = renderer.getHTMLData();

		uiData.htmlData.contents.push( rendererData );
		uiData.widgets.renderer = renderer;
	},

	_createToolbar: function( uiData ) {
		var $ = this.$,
			configs = uiData.configs || {},
			toolbar = $.lui.container(),
			toolbarData = toolbar.getHTMLData(),
			controlConfig, control, controlData,
			i, length, config;

		if ( configs.toolbar !== false ) {
			config = configs.toolbar;
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
				toolbarData.contents.push( controlData );
				uiData.widgets[ controlConfig ] = control;
			}
		}

		uiData.htmlData.contents.push( toolbarData );
		uiData.widgets.toolbar = toolbar;
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
		container = null;
		self.widgets = widgets = null;
		self.editor = null;
	}
};

module.exports = UI;
