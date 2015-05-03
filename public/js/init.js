// Set global APP variable
window.APP = window.APP || {};
var Router = require('./routers/main.js');

// Retrieve latest ftse100 data from api
$.getJSON('https://spreadsheets.google.com/feeds/list/0AhySzEddwIC1dEtpWF9hQUhCWURZNEViUmpUeVgwdGc/1/public/basic?alt=json', function(data){
	var
	formatted_data = data.feed.entry,
	ftse100_data = {},
	current_entry;

	for (var i = 0; i < formatted_data.length; i++) {
		current_entry = formatted_data[i];

		// Modify data format to contain stock symbol as key and current price as the value i.e. BLT: 1500
		ftse100_data[current_entry['title']['$t'].split('.')[0]] = parseInt(current_entry['content']['$t'].split(',')[1].split(': ')[1], 10);
	}

	APP.ftse100 = ftse100_data;

	// Start the Backbone application
  new Router();
  Backbone.history.start();
});


