// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
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

// Controllers
var gridMap = require('./app/Controllers/gridMap.controller.js');
var tiles = require('./app/Controllers/tiles.controller.js');
var players = require('./app/Controllers/players.controller.js');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/map/')
	.post(function(req, res) {
		console.log('POST: /map/');
		console.log(req.body);

		var seed = req.body.seed,
			size = req.body.size;

		gridMap.generateNewMap(seed, size, function(response) {
			res.json(response);
		});
	});

router.get('/users', function(req, res) {
	res.send([
		{name:'Mawimus'},
		{name:'Poudjik'}
	]);
});

router.route('/localtiles/:gridmapid/:maxx/:maxy/:currentx/:currenty/')
	.get(function(req, res) {

		var gridmapid = req.params.gridmapid,
			maxx = req.params.maxx,
			maxy = req.params.maxy,
			currentx = req.params.currentx,
			currenty = req.params.currenty;

		console.log('GET: /localtiles/%s/%s/%s/%s/%s/', gridmapid, maxx, maxy, currentx, currenty);
		// var maxxTiles = req.params.maxxtiles,
		// 	matrixTiles = [[]];

		// matrixTiles = tiles.getLocalMatrixTiles(maxxTiles, maxyTiles, maxx, maxy, currentx, currenty);
		// res.json(matrixTiles);

		var size = {maxx: maxx, maxy:maxy};
		var coord = {currentx: currentx, currenty:currenty};
		tiles.getlocalGridMapTiles(gridmapid, size, coord, function(response) {
			res.json(response);
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port, function() {
	console.log();
	console.log('Listening on port ' + port);
});
