var StockView = require('../../public/js/views/stock.js');

describe("Stock View", function() {
  beforeEach(function() {
    this.stock = new StockView({
      companyName: 'Diageo',
      currentPrice: 1800,
      group: 'ftse100',
      priceDifference: 63,
      symbol: 'dge',
      targetPrice: 1100
    });
  });

  it("Should initialise a new stock view", function(){
    expect(this.stock instanceof Backbone.View).toBe(true);
  });

  it("Should have an 'el' property", function(){
    expect(this.stock.el.nodeName).toEqual("DIV");
  });
});
