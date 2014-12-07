(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
},{"../models/stock.js":3}],2:[function(require,module,exports){
window.APP = window.APP || {};
var Router = require('./routers/main.js');

$.getJSON('https://spreadsheets.google.com/feeds/list/0AhySzEddwIC1dEtpWF9hQUhCWURZNEViUmpUeVgwdGc/1/public/basic?alt=json', function(data){
	var 
	formatted_data = data.feed.entry,
	ftse100_data = {},
	current_entry;

	for (var i = 0; i < formatted_data.length; i++) {
		current_entry = formatted_data[i];

		ftse100_data[current_entry['title']['$t'].split('.')[0]] = parseInt(current_entry['content']['$t'].split(',')[1].split(': ')[1], 10);
	}

	APP.ftse100 = ftse100_data;

	$.getJSON('https://spreadsheets.google.com/feeds/list/0AhySzEddwIC1dEtpWF9hQUhCWURZNEViUmpUeVgwdGc/2/public/basic?alt=json', function(data){
		var 
		formatted_data = data.feed.entry,
		ftse250_data = {},
		current_entry;

		for (var i = 0; i < formatted_data.length; i++) {
			current_entry = formatted_data[i];

			ftse250_data[current_entry['title']['$t'].split('.')[0]] = parseInt(current_entry['content']['$t'].split(',')[1].split(': ')[1], 10);
		}

		APP.ftse250 = ftse250_data;

		new Router();
		Backbone.history.start();
	});
});



},{"./routers/main.js":4}],3:[function(require,module,exports){
var Stock = Backbone.Model.extend({
	idAttribute: '_id',
  defaults: {
  	currentPrice: 0,
  	priceDifference: 0
  }
});

module.exports = Stock;
},{}],4:[function(require,module,exports){

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
},{"../collections/stocks.js":1,"../views/new_stock.js":5,"../views/stocks.js":7}],5:[function(require,module,exports){

var NewStock = Backbone.View.extend({
	initialize: function() {
    this.render();
	},
	render: function() {
		$('.stocks').html('');
		$('.new-stock').show();
	}
});

module.exports = NewStock;
},{}],6:[function(require,module,exports){

var Stock = Backbone.View.extend({
  template: _.template('<%= companyName %> is a buy at <%= targetPrice %> but is currently selling at <%= currentPrice %> which is <%= priceDifference %>% too expensive <button class="edit-stock btn btn-default">Edit</button> <button class="delete-stock btn btn-default">Delete</button><div class="edit-area"><input name="companyName" class="company-name" value="<%= companyName %>" type="text" /><input name="targetPrice" class="target-price" value="<%= targetPrice %>" type="text" /><button class="done-editing btn btn-default">Done</button></div>'),

  events: {
  	'click .edit-stock': 'showEditArea',
  	'click .delete-stock': 'deleteStock',
  	'click .done-editing': 'hideEditArea'
  },

  deleteStock: function(event) {
  	event.preventDefault();
  	console.log('deleted');

  	this.model.destroy({success: function(model, response) {
  	  console.log('success');
  	  console.log(model);
  	  console.log(response);
  	}, error: function(model, response) {
  	  console.log('error');
  	  console.log(model);
  	  console.log(response);
  	}});
  },

  showEditArea: function(event) {
  	event.preventDefault();

  	this.$el.find('.edit-area').show();
  },

  hideEditArea: function(event) {
  	event.preventDefault();

  	this.updateModel();

  	this.$el.find('.edit-area').hide();
  },

  updateModel: function() {
  	this.model.save({
  		'companyName': this.$el.find('.company-name').val(),
  		'targetPrice': this.$el.find('.target-price').val()
  	});
  },

  render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
  }
});

module.exports = Stock;
},{}],7:[function(require,module,exports){
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
},{"./stock.js":6}]},{},[2,3,1,4,5,6,7]);