
function History( editor ) {
	this.stack = [];
	this.current = -1;
	this.editor = editor;
}

History.prototype = {
	_fire: function() {
		var self = this,
			editor = self.editor;

		editor.trigger(
			editor.$.Event( "historychange", {
				current: self.current,
				histories: self.stack.length
			}
		) );
	},

	_getData: function() {
		var editor = this.editor,
			canvas = editor.canvas,
			width = canvas.width,
			height = canvas.height;

		return {
			imgData: canvas.toDataURL(),
			width: width,
			height: height,
			info: editor.info
		};
	},

	_setData: function( item ) {
		var self = this,
			editor = self.editor,
			canvas = editor.canvas,
			ctx = editor.context2d,
			img, width, height;

		canvas.width = item.width;
		canvas.height = item.height;
		canvas.info = item.info;

		img = new window.Image();
		img.onload = function() {
			ctx.clearRect( 0, 0, width, height );
			ctx.drawImage( img, 0, 0 );
			self._fire();
		};
		img.src = item.imgData;
	},

	push: function() {
		var self = this;

		self.current++;
		if ( self.current < self.stack.length ) {
			self.stack.length = self.current;
		}
		self.stack.push( self._getData() );
		self._fire();
	},

	undo: function() {
		var self = this,
			item;

		if ( self.current > 0 ) {
			self.current--;
			item = self.stack[ self.current ];
			self._setData( item );
		}
	},

	redo: function() {
		var self = this,
			item;

		if ( self.current < self.stack.length - 1 ) {
			self.current++;
			item = self.stack[ self.current ];
			self._setData( item );
		}
	},

	clear: function() {
		var self = this;

		self.stack = [];
		self.current = -1;
		self._fire();
	}
};

module.exports = History;
