// var reIdentifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";

function UI( editor ) {
	this.editor = editor;
	this.$ = editor.$;
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
			configs: data.configs || {}
		} );

		this.widgets = uiData.widgets;
		this.configs = uiData.configs;

		this._render( target, uiData.htmlData );
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
		uiData.configs = $.extend( {}, data.configs );

		self._createContainer( uiData );
		self._createCanvas( uiData );
		self._createToolbar( uiData );

		return uiData;
	},

	_createContainer: function( uiData ) {
		var $ = this.$,
			widget = $.ui.container(),
			widgetData = widget.getHTMLData();

		widgetData.attr.className.push( "la-latteart", "la-border-all" );
		uiData.htmlData = widgetData;
		uiData.widgets.container = widget;
	},

	_createCanvas: function( uiData ) {
		var $ = this.$,
			canvas = $.ui.canvas(),
			canvasData = canvas.getHTMLData();

		canvasData.attr.className.push( "la-canvas" );
		uiData.htmlData.contents.push( canvasData );
		uiData.widgets.canvas = canvas;
	},

	_createToolbar: function( uiData ) {
		var $ = this.$,
			configs = uiData.configs || {},
			toolbar = $.ui.container(),
			toolbarData = toolbar.getHTMLData();

		if ( configs.toolbar !== false ) {

			// 버튼 생성
		}

		uiData.htmlData.contents.push( toolbarData );
		uiData.widgets.toolbar = toolbar;
	},

	_render: function( target, htmlData ) {
		var self = this,
			editor = self.editor,
			$ = self.$,
			$target = $( target ),
			$container = $( $.ui.makeHTML( htmlData ) );

		$target.one( "drewui", function( e ) {
			var $buildedContainer = $( e.relatedTarget ),
				result = true;

			$buildedContainer.show();

			try {
				self._postRender();
			} catch ( err ) {

				// !주:
				// IE에서 메모리 누수 없이 DOM 을 삭제하려면 Node.removeChild()를 사용하는 것보다
				// outerHTML을 빈문자열로 치환해주는 것이 더 효과적임.
				// 이는 경험적인 내용으로, 타 브라우저에는 적용이 안되거나 업데이트 등을 통해 변경될 수 있음.
				$buildedContainer[ 0 ].outerHTML = "";
				$target.show();
				result = false;
			} finally {
				editor.trigger( result ? "uicreate" : "uicreatefail" );
			}
		} );

		// draw UI
		this.$target =
			$target
				.hide()
				.after( $container )
				.trigger( {
					type: "drewui",
					relatedTarget: $container[ 0 ]
				} );
	},

	_postRender: function() {
		var self = this,
			$ = self.$,
			widgets = this.widgets,
			editor = this.editor,
			key;

		for ( key in widgets ) {
			widgets[ key ].init();
		}

		editor.one( "editorcreate", function() {
			var $body = $( editor.getBody() ),
				configs = editor.configs;

			$body.css( "minHeight",
				configs.height -
				parseFloat( $body.css( "margin-top" ) ) -
				parseFloat( $body.css( "margin-bottom" ) )
			);
		} );
	},

	_final: function() {
		var self = this,
			$ = self.$;

		if ( self.$target ) {
			self.$target.show();

			// 완벽한 데이터 삭제를 위해 show hide시 jQuery에 의해 자동 저장되는
			// target에 대한 olddisplay 데이터도 제거
			$._removeData( self.$target[ 0 ], "olddisplay" );

			self.$target = null;
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

module.export = UI;
