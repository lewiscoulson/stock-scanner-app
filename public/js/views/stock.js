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