var Stock = require('../../public/js/models/stock.js');

describe("Stock Model", function() {
  beforeEach(function() {
    this.stock = new Stock({
      companyName: 'Diageo',
      currentPrice: 1800,
      group: 'ftse100',
      priceDifference: 63,
      symbol: 'dge',
      targetPrice: 1100
    });
  });

  it("Should initialise a new stock model", function(){
    expect(this.stock instanceof Backbone.Model).toBe(true);
  });

  it("Should be able to set attributes", function(){
    expect(this.stock.get('companyName')).toEqual('Diageo');
    expect(this.stock.get('currentPrice')).toEqual(1800);
    expect(this.stock.get('group')).toEqual('ftse100');
    expect(this.stock.get('priceDifference')).toEqual(63);
    expect(this.stock.get('symbol')).toEqual('dge');
    expect(this.stock.get('targetPrice')).toEqual(1100);
  });
});
