
var StockModel = require('../models/stock.js');

module.exports = Backbone.Collection.extend({
  model: StockModel,
  url: 'stocks/',

  filterFtse100: function() {
  	
  	return this.filter(function(model){
  		return  model.get('group') === 'ftse100'
  	});
  },

  filterFtse250: function() {
  	return this.filter(function(model){
  		return  model.get('group') === 'ftse250'
  	});
  }
});