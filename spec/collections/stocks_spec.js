var StocksCollection = require('../../public/js/collections/stocks.js');

describe("Stocks Collection", function() {
  beforeEach(function() {
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
  });

  it("Should initialise a new stocks collection", function(){
    expect(this.stocksCollection instanceof Backbone.Collection).toBe(true);
  });

  it("Should be able to add models to stocks collection", function(){
    expect(this.stocksCollection.length).toBe(3);
  });
});