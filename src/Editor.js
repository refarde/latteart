var UI = require( "./UI.js" );

function Editor( id, configs, editorManager ) {
	var self = this,
		$ = self.$ = editorManager.$;

	self.configs = configs = $.extend( { id: id }, configs );
	self.language = configs.language || "ko_KR";
	self.id = id;
	self.env = editorManager.env;
	self.finalTasks = [];
	self.ui = null;
	self.canvasContext = null;
}

Editor.prototype = {
	create: function() {
		var self = this,
			configs = self.configs,
			ui = self.ui = new UI( self );

		// 플러그인 로드

		self
			.one( "uicreatefail", function() {
				self.off( "uicreate" );
				self.editorManager.destroy( self );
			} )
			.one( "uicreate", function() {
				self.off( "uicreatefail" );
				self._init();
				self.trigger( "editorcreate" );
			} );

		ui.create( {
			targetId: self.id,
			configs: configs,
			menuItems: self.menuItems,
			buttons: self.buttons,
			panels: self.panels,
			dialogs: self.dialogs
		} );
	},

	_init: function() {
		var self = this;

		self.trigger( "editorinit" );
	},

	_final: function() {
		var task,
			finalTasks = this.finalTasks;

		while ( finalTasks && finalTasks.length ) {
			task = finalTasks.pop();

			if ( typeof task === "function" ) {
				task();
			}

			task = null;
		}
	},

	/**
	 * 에디터 관련 DOM elements, event handler, object들을 메모리 상에서 삭제.
	 *
	 * !주:
	 *  에디터 인스턴스는 editorManager에서 계속 관리되지 때문에 해당 메소드로는 삭제되지 않음.
	 *  latteart.destroy( id )를 이용해야 더 효과적인 삭제 가능.
	 */
	destroy: function() {
		var self = this;

		self._final();

		self.canvasContext = null;
		self.ui = null;
		self.finalTasks = null;
		self.browser = null;
		self.os = null;
		self.id = null;
		self.language = null;
		self.configs = null;
		self.$ = null;
	},

	getVersion: function() {
		return this.editorManager.version;
	},

	getEdition: function() {
		return this.editorManager.edition;
	},

	on: function( types, selector, data, fn ) {
		return this.$( this ).on( types, selector, data, fn );
	},

	off: function( types, selector, fn ) {
		return this.$( this ).off( types, selector, fn );
	},

	one: function( types, selector, data, fn ) {
		return this.$( this ).one( types, selector, data, fn );
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		return this.$( this ).trigger( event, data, elem, onlyHandlers );
	},

	setContent: function( content, args ) {
		console.log( args );
	},

	getContent: function( args ) {
		console.log( args );
	},

	getContext: function() {
		var self = this,
			canvas;

		if ( !self.canvasContext ) {
			canvas = self.uiManager.getCanvas();

			if ( canvas ) {
				self.canvasContext = canvas.contentWindow;
			}
		}
		return self.canvasContext;
	},

	addFinalTask: function( task ) {
		this.finalTasks.push( task );
	}
};

module.exports = Editor;
