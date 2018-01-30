module.exports = function( $ ) {
	$.widget( "lui.container", {
		_create: function() {
			this.htmlData = {
				tag: "div",
				attr: {
					className: [ "lui-container" ]
				}
			};

			this.htmlData.contents = [];
		}
	} );
};
