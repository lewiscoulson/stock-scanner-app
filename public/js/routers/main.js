
var StocksCollection = require('../collections/stocks.js');
var StocksView = require('../views/stocks.js');
var NewStockView = require('../views/new_stock.js');

var MainRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'new': 'new',
    'ftse100': 'ftse100',
    'ftse250': 'ftse250'
  },

  index: function() {
    APP.stocks_collection = new StocksCollection();
    APP.stocks_collection.fetch({               
      success: function(){
          new StocksView({collection: APP.stocks_collection});
      },
      error: function(){
          console.log('error fetching stocks');
      }
    });
  },

  new: function() {
    new NewStockView();
  },

  ftse100: function() {
  	var ftse_100_stocks = APP.stocks_collection.filterFtse100();

  	var filtered_collection = new StocksCollection(ftse_100_stocks);

  	new StocksView({collection: filtered_collection});
  },

  ftse250: function() {
  	var ftse_250_stocks = APP.stocks_collection.filterFtse250();

  	var filtered_collection = new StocksCollection(ftse_250_stocks);

  	new StocksView({collection: filtered_collection});
  }
});

module.exports = MainRouter;