var StockModel = require('../models/stock.js');

module.exports = Backbone.Collection.extend({
  model: StockModel,
  url: 'stocks/'
});