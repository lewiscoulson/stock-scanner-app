var Stock = require('./stock.js');

var Stocks = Backbone.View.extend({
  el: '.stocks',

initialize: function() {
  this.updateStockvalues();
  this.render();
  this.listenTo(this.collection, 'sort', this.render);
  this.listenTo(this.collection, 'change', this.render);
  this.listenTo(this.collection, 'destroy', this.render);
},

events: {
  'click .most-undervalued': 'mostUndervalued',
  'click .most-overvalued': 'mostOvervalued'
},

mostUndervalued: function(event) {
  event.preventDefault();

  console.log('sorted');

  this.collection.comparator = 'priceDifference';
  this.collection.sort();
},

mostOvervalued: function(event) {
  event.preventDefault();

  console.log('sorted');

  this.collection.comparator = function(stock) {
    return -stock.get("priceDifference");
  };;

  this.collection.sort();
},

updateStockvalues: function() {
  this.collection.each(function(model){
    var 
    symbol = model.get('symbol').toUpperCase();

    function calculatepriceDifference(targetprice, currentPrice) {
    	return Math.floor((((currentPrice / targetprice) - 1) * 100));
    }

    if( APP.ftse100[symbol] ) {
    	model.set('currentPrice', APP.ftse100[symbol]);
    	model.set('priceDifference', calculatepriceDifference(model.get('targetPrice'), APP.ftse100[symbol]));
    } else if( APP.ftse250[symbol] ) {
    	model.set('currentPrice', APP.ftse250[symbol]);
    	model.set('priceDifference', calculatepriceDifference(model.get('targetPrice'), APP.ftse250[symbol]));
    }
  });
},

render: function() {
  $('.new-stock').hide();
  this.$el.html("");
  this.$el.append('<div class="btn-group"><button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">Sort <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="most-undervalued">most undervalued</a></li><li><a href="#" class="most-overvalued">most overvalued</a></li></ul></div>');

  this.collection.each(function( stock ) {
    this.renderStock( stock );
  }, this );
},

renderStock: function( stock ) {
  var stockView = new Stock({
    model: stock
  });

  this.$el.append( stockView.render().el );
  }
});

module.exports = Stocks;