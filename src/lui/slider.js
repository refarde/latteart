module.exports = function( $ ) {
	$.widget( "lui.slider", {
		_create: function() {
			this.htmlData = {
				tag: "input",
				attr: {
					className: [ "lui-slider" ],
					type: "range"
				}
			};
		}
	} );
};
