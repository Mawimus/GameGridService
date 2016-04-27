var Q = require('q');

var routeUtils = require('../../app/Routes/route.utils');

var GridMap = require('./../../app/Controllers/gridMap.controller')
var Tiles = require('../../app/Controllers/tiles.controller');

module.exports = function(router) {
	// Récupération de tous les mondes
	router.route('/worlds/:skip/:limit')
		.get(function(req, res) {

			var skip = parseInt(req.params.skip),
				limit = parseInt(req.params.limit);
			var data = {skip: skip, limit: limit};

			console.log('GET: /worlds/%s/%s', skip, limit);

			GridMap.Worlds(data)
				.then(routeUtils.sendResponseTo(res, 200))
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

			GridMap.generateNewMap(data)
				.then(routeUtils.sendResponseTo(res, 201))
				.catch(routeUtils.sendErrorTo(res, 422))
				.finally(routeUtils.answerEnd());
		});

	// Récupération local des tuiles d'une map
	router.route('/localtiles/:worldid/:maxx/:maxy/:currentx/:currenty')
		.get(function(req, res) {

			var worldId = req.params.worldid,
				maxx = req.params.maxx,
				maxy = req.params.maxy,
				currentx = req.params.currentx,
				currenty = req.params.currenty;
			var data = {worldId: worldId, size: {maxx: maxx, maxy:maxy}, coord: {currentx: currentx, currenty:currenty}};

			console.log('GET: /localtiles/%s/%s/%s/%s/%s/', worldId, maxx, maxy, currentx, currenty);

			Tiles.getLocalWorldTiles(data)
				.then(routeUtils.sendResponseTo(res, 200))
				.catch(routeUtils.sendErrorTo(res, 422))
				.finally(routeUtils.answerEnd());
		});
}
