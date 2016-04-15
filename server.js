// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

// debug extention
var beautify = require('js-beautify').js_beautify;
var fs = require('fs');


// Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gamegride');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {


// });

// configure app to use bodyParser()
// this will let us get the data from a POST
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:8080'}));

var port = process.env.PORT || 3000;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/')
	.get(function(req, res) {
    	res.status(200).jsonp({ message: 'hooray! welcome to our api!' });
	});

require('./app/Routes/player.route')(router);
require('./app/Routes/tile.route')(router);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port, function() {
	console.log();
	console.log('Listening on port ' + port);
});
