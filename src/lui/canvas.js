module.exports = function( $ ) {
	$.widget( "lui.canvas", {
		_create: function() {
			this.htmlData = {
				tag: "canvas",
				attr: {
					className: [ "lui-canvas" ]
				}
			};

			this.htmlData.contents = [];
		}
	} );
};
