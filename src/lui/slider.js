module.exports = function( $ ) {
	$.widget( "lui.slider", {
		options: {
			value: 0,
			min: 0,
			max: 100,
			step: 1
		},

		_create: function() {
			var options = this.options;

			this.htmlData = {
				tag: "div",
				attr: {
					className: [ "lui-slider-wrap" ]
				},
				contents: [ {
					tag: "input",
					attr: {
						className: [ "lui-slider" ],
						type: "range",
						min: options.min,
						max: options.max,
						step: options.step,
						value: options.value
					}
				} ]
			};
		},

		_init: function() {
			var self = this,
				element =
					self.element.find( ".lui-slider" )
						.on( "change", function( e ) {
							var value = self.options.value = e.target.value;
							self._trigger( "change", e, { value: value } );
						} );

			self.element = element;
			self.wrap = element.parent();
		},

		_setOption: function( key, value ) {
			var self = this;

			self._super( key, value );
			self.element.prop( key, value + "" );
		},

		stepUp: function( step ) {
			this.element[ 0 ].stepUp( step );
		},

		stepDown: function( step ) {
			this.element[ 0 ].stepDown( step );
		}
	} );
};
