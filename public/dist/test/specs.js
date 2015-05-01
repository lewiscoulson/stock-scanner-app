(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var StockModel = require('../models/stock.js');

module.exports = Backbone.Collection.extend({
  model: StockModel,
  url: 'stocks/'
});
},{"../models/stock.js":2}],2:[function(require,module,exports){
var Stock = Backbone.Model.extend({
	idAttribute: '_id',
  defaults: {
  	currentPrice: 0,
  	priceDifference: 0
  }
});

module.exports = Stock;
},{}],3:[function(require,module,exports){
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
},{"../collections/stocks.js":1,"../views/new_stock.js":4,"../views/stocks.js":6}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var Stock = Backbone.View.extend({
  template: _.template('<h2><%= companyName %><h2><p><strong>target price:</strong> <%= targetPrice %></p><p><strong>current price</strong> <%= currentPrice %></p><p><%= priceDifference %>% overpriced</p> <button class="edit-stock btn btn-default">Edit</button> <button class="delete-stock btn btn-default">Delete</button><div class="edit-area"><input name="companyName" class="company-name" value="<%= companyName %>" type="text" /><input name="targetPrice" class="target-price" value="<%= targetPrice %>" type="text" /><button class="done-editing btn btn-default">Done</button></div>'),

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
},{}],6:[function(require,module,exports){
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
},{"./stock.js":5}],7:[function(require,module,exports){
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
},{"../../public/js/collections/stocks.js":1}],8:[function(require,module,exports){
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

},{"../../public/js/models/stock.js":2}],9:[function(require,module,exports){
var Main = require('../../public/js/routers/main.js');

describe("Main Router", function() {
  beforeEach(function() {
    this.router = new Main();
  });

  it("Should initialise a new main router", function(){
    expect(this.router instanceof Backbone.Router).toBe(true);
  });

  it("Should contain new route", function(){
    expect(this.router.routes.new).toBeDefined();
  });
});

},{"../../public/js/routers/main.js":3}],10:[function(require,module,exports){
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

  it("Should an 'el' property", function(){
    expect(this.stock.el.nodeName).toEqual("DIV");
  });
});

},{"../../public/js/views/stock.js":5}],11:[function(require,module,exports){
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

  it("Should have a collection", function(){
    expect(this.StocksView.collection.length).toEqual(3);
  });
});
},{"../../public/js/collections/stocks.js":1,"../../public/js/views/stocks.js":6}]},{},[7,8,9,10,11]);