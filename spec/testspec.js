var Stock = require('../public/js/models/stock.js');
var StocksCollection = require('../public/js/collections/stocks.js');
var StockView = require('../public/js/views/stock.js');
var StocksView = require('../public/js/views/stocks.js');

describe("General", function() {
	it("Should initialise a new stock model", function(){
		var stock_instance = new Stock();

		expect(stock_instance instanceof Backbone.Model).toBe(true);
	});

	it("Should initialise a new stocks collection", function(){
		var stock_collection_instance = new StocksCollection();

		expect(stock_collection_instance instanceof Backbone.Collection).toBe(true);
	});

	it("Should initialise a new stock view", function(){
		var stock_view_instance = new StockView();

		expect(stock_view_instance instanceof Backbone.View).toBe(true);
	});

	it("Should initialise a new stocks view", function(){
		var collection_instance = new StocksCollection();
		var stocks_view_instance = new StocksView({
			collection: collection_instance
		});

		expect(stocks_view_instance instanceof Backbone.View).toBe(true);
	});
});