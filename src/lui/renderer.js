module.exports = function( $ ) {
	$.widget( "lui.renderer", {
		_create: function() {
			this.htmlData = {
				tag: "div",
				attr: {
					className: [ "lui-renderer" ]
				},
				contents: [ {
					tag: "canvas",
					attr: {
						className: [ "lui-canvas" ]
					}
				} ]
			};
		}
	} );
};
