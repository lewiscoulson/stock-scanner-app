(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var StockModel = require('../models/stock.js');

module.exports = Backbone.Collection.extend({
  model: StockModel,
  url: 'stocks/'
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

  new Router();
  Backbone.history.start();
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
  template: _.template('<h2><%= companyName %></h2><p><strong>target price:</strong> <%= targetPrice %> / <strong>current price</strong> <%= currentPrice %></p><p><%= priceDifference %>% overpriced</p> <button class="edit-stock btn btn-default">Edit</button> <button class="delete-stock btn btn-default">Delete</button><div class="edit-area"><input name="companyName" class="company-name" value="<%= companyName %>" type="text" /><input name="targetPrice" class="target-price" value="<%= targetPrice %>" type="text" /><button class="done-editing btn btn-default">Done</button></div>'),

  events: {
  	'click .edit-stock': 'showEditArea',
  	'click .delete-stock': 'deleteStock',
  	'click .done-editing': 'hideEditArea'
  },

  deleteStock: function(event) {
  	event.preventDefault();

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

  this.collection.comparator = 'priceDifference';
  this.collection.sort();
},

mostOvervalued: function(event) {
  event.preventDefault();

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
    }
  });
},

render: function() {
  $('.new-stock').hide();
  this.$el.html("");
  this.$el.append('<h2>sort by:</h2> <a href="#" class="most-undervalued">most undervalued</a> <a href="#" class="most-overvalued">most overvalued</a>');

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