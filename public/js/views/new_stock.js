
var NewStock = Backbone.View.extend({
	initialize: function() {
    this.render();
	},
	render: function() {
		$('.stocks').html('');
		$('.new-stock').show();
	}
});

module.exports = NewStock;