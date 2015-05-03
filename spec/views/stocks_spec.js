window.APP = window.APP || {};

var StocksView = require('../../public/js/views/stocks.js');
var StocksCollection = require('../../public/js/collections/stocks.js');

describe("Stocks view", function() {
  beforeEach(function() {
    window.APP.ftse100 = {
      dge: 1800,
      rr: 1039,
      gsk: 1506
    };

    this.stocksCollection = new StocksCollection([
      {
        companyName: 'Diageo',
        currentPrice: 1800,
        group: 'ftse100',
        priceDifference: 63,
        symbol: 'dge',
        targetPrice: 1100
      },
      {
        companyName: 'Rolls Royce',
        currentPrice: 1039,
        group: 'ftse100',
        priceDifference: 73,
        symbol: 'rr',
        targetPrice: 600
      },
      {
        companyName: 'GlaxoSmithKline',
        currentPrice: 1506,
        group: 'ftse100',
        priceDifference: 50,
        symbol: 'gsk',
        targetPrice: 1000
      }
    ]);

    this.StocksView = new StocksView({
      collection: this.stocksCollection
    });
  });

  it("Should initialise a new stocks view", function(){
    expect(this.StocksView instanceof Backbone.View).toBe(true);
  });

  it("Should contain a collection", function(){
    expect(this.StocksView.collection.length).toEqual(3);
  });
});