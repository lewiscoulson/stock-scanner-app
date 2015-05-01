var express = require('express'),
    http = require('http'),
    path = require('path'),
    Stock = require('./Stock');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', function(request, response) {
    response.render('index');
});

app.get('/stocks', function(request, response) {
    Stock.find(function(err, stocks) {
        if (err) {
            response.send(500, 'There was an error - tough luck.');
        }
        else {
            response.json(stocks);
        }
    });
});

app.put('/stocks/:id', function(request, response) {
    Stock.findById( request.params.id, function( err, stock ) {
        stock.companyName = request.body.companyName;
        stock.targetPrice = request.body.targetPrice;

        stock.save( function( err ) {
            if( !err ) {
                console.log( 'book updated' );
            } else {
                console.log( err );
            }
            response.render('index');
        });
    });
});

app.delete('/stocks/:id', function(request, response) {
    Stock.findById( request.params.id, function( err, stock ) {
        stock.remove( function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
});

app.post('/stocks', function(request, response) {
    var stock = new Stock({
        companyName: request.body.companyName,
        symbol: request.body.symbol,
        targetPrice: request.body.targetPrice,
        group: 'ftse100'
    });

    stock.save(function(err, model) {
        if (err) {
            response.send(500, 'There was an error - tough luck.');
        }
        else {
            response.redirect('/');
        }
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
