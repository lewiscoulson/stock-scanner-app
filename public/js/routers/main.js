var StocksCollection = require('../collections/stocks.js');
var StocksView = require('../views/stocks.js');
var NewStockView = require('../views/new_stock.js');

var MainRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'new': 'new'
  },

  index: function() {
    APP.stocks_collection = new StocksCollection();
    APP.stocks_collection.fetch({
      success: function(){
          new StocksView({collection: APP.stocks_collection});
          console.log(APP.stocks_collection);
      },
      error: function(){
          console.log('error fetching stocks');
      }
    });
  },

  new: function() {
    new NewStockView();
  }
});

module.exports = MainRouter;