var Q = require('q');

var routeUtils = require('../../app/Routes/route.utils');

var gridMap = require('./../../app/Controllers/gridMap.controller')
var tiles = require('../../app/Controllers/tiles.controller');

module.exports = function(router) {
	// Récupération de tous les mondes
	router.route('/worlds/')
		.get(function(req, res) {
			console.log('GET: /worlds/');

			Q().then(gridMap.list())
				.then(routeUtils.sendResponseTo(res, 201))
				.catch(routeUtils.sendErrorTo(res, 422))
				.finally(routeUtils.answerEnd());
		});

	// Création d'une map
	router.route('/map/')
		.post(function(req, res) {
			console.log('POST: /map/');
			console.log(req.body);

			var seed = req.body.seed,
				size = req.body.size,
				world = req.body.world;
			var data = {seed: seed, size: size, world: world};

			Q().then(gridMap.generateNewMap(data))
				.then(routeUtils.sendResponseTo(res, 201))
				.catch(routeUtils.sendErrorTo(res, 422))
				.finally(routeUtils.answerEnd());
		});

	// Récupération local des tuiles d'une map
	router.route('/localtiles/:gridmapid/:maxx/:maxy/:currentx/:currenty')
		.get(function(req, res) {

			var gridmapid = req.params.gridmapid,
				maxx = req.params.maxx,
				maxy = req.params.maxy,
				currentx = req.params.currentx,
				currenty = req.params.currenty;
			var data = {gridmapid: gridmapid, size: {maxx: maxx, maxy:maxy}, coord: {currentx: currentx, currenty:currenty}};

			console.log('GET: /localtiles/%s/%s/%s/%s/%s/', gridmapid, maxx, maxy, currentx, currenty);

			Q().then(tiles.getlocalGridMapTiles(data))
				.then(routeUtils.sendResponseTo(res, 200))
				.catch(routeUtils.sendErrorTo(res, 422))
				.finally(routeUtils.answerEnd());
		});
}
