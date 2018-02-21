var UI = require( "./UI.js" ),
	History = require( "./History.js" );

function Editor( id, editorManager ) {
	var self = this;

	self.id = id;
	self.$ = editorManager.$;
	self.env = editorManager.env;
	self.filters = editorManager.filters;
	self.configs = null;
	self.language = null;
	self.history = null;
	self.userFilters = null;
	self.finalTasks = [];
	self.ui = null;
	self.canvas = null;
	self.context2d = null;
	self.dummyCanvas = null;
	self.dummyContext2d = null;
	self.info = {};
}

Editor.prototype = {
	create: function( loaded ) {
		var self = this,
			$ = self.$,
			ui = self.ui = new UI( self ),
			plugins = loaded.plugins,
			name, configs;

		self.configs = configs = $.extend( { id: self.id }, loaded.configs );
		self.language = configs.language || "ko_KR";
		self.history = new History( self );
		self.userFilters = loaded.userFilters || [];

		for ( name in plugins ) {
			plugins[ name ]( self );
		}

		self
			.one( "uicreatefail", function() {
				self.off( "uicreate" );
				self.editorManager.destroy( self );
			} )
			.one( "uicreate", function() {
				self.off( "uireatefail" );
				self.trigger( "editorcreate" );
				self._init();
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
		var self = this,
			canvas = self.ui.getCanvas();

		self.canvas = canvas;
		self.context2d = canvas.getContext( "2d" );
		self.dummyCanvas = self.$( "<canvas />" )[ 0 ];
		self.dummyContext2d = self.dummyCanvas.getContext( "2d" );

		self.trigger( "editorinit" );
	},

	_final: function() {
		var self = this,
			finalTasks = this.finalTasks,
			task;

		self.dummyCanvas = null;
		self.dummyContext2d = null;
		self.context2d = null;
		self.canvas = null;

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
	 *  latte.destroy( id )를 이용해야 더 효과적인 삭제 가능.
	 */
	destroy: function() {
		var self = this;

		self._final();

		self.info = null;
		self.userFilters = null;
		self.history = null;
		self.ui = null;
		self.finalTasks = null;
		self.browser = null;
		self.os = null;
		self.id = null;
		self.language = null;
		self.configs = null;
		self.filters = null;
		self.env = null;
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

	addFinalTask: function( task ) {
		this.finalTasks.push( task );
	}
};

module.exports = Editor;
