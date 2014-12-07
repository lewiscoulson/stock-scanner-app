// Require mongoose
var mongoose = require('mongoose');

// Configure conenction URL (only needs to happen once per app)
mongoose.connect('mongodb://admin:admin@kahana.mongohq.com:10046/fem');

// Create a database schema for our Post object, which will describe both it's
// data and it's behavior.
var stockSchema = mongoose.Schema({
    companyName:String,
    symbol:String,
    targetPrice:String,
    group:String
});

// Create a model object constructor that will have ODM functionality like .save()...
var Stock = mongoose.model('Stock', stockSchema);

// Expose out model as the module interface
module.exports = Stock;