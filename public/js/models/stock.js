var Stock = Backbone.Model.extend({
	idAttribute: '_id',
  defaults: {
  	currentPrice: 0,
  	priceDifference: 0
  }
});

module.exports = Stock;