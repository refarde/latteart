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
					className: [ "lui-slider" ]
				},
				contents: [ {
					tag: "input",
					attr: {
						className: [ "lui-slider-range" ],
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
			var self = this;

			self._$rangeInput =
				self.element.find( ".lui-slider-range" )
					.on( "change", function( e ) {
						var value = self.options.value = e.target.value;
						self._trigger( "change", e, { value: value } );
					} );
		},

		_setOption: function( key, value ) {
			var self = this;

			self._super( key, value );
			self.element.attr( self.options );
		},

		stepUp: function( step ) {
			this._$rangeInput[ 0 ].stepUp( step );
		},

		stepDown: function( step ) {
			this._$rangeInput[ 0 ].stepDown( step );
		}
	} );
};
