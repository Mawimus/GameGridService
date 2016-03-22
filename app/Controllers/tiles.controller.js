var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var randomizeGrid = require('./../../app/Core/Utils/randomizeGrid');
var utils = require('./../../app/Core/Utils/utils');

var Tile = require('./../../app/Models/tile.model.js')
var GridMapController = require('./../../app/Controllers/gridMap.controller.js')


// #################################################################################################### //
// -- [Gestion des erreurs]  -- //
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Tile already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	return message;
}

// #################################################################################################### //
// -- [CRUD]  -- //
// Create a tile
function create(tile) {
	return function() {
		var deferred = Q.defer();

		tile.save(deferred.makeNodeResolver());

		return deferred.promise;
	}
}

// Read a tile

// Update a tile

// delete a tile

// list tiles by gridMapId
function getLocalTilesByGridMapId(data) {
	return function(gridmap) {
		var deferred = Q.defer();

		var size = data.size,
			coord = data.coord,
			maxx = size.maxx -1,
			maxy = size.maxy -1,
			tox, toy;

		if (parseInt(gridmap.size.maxx) < parseInt(maxx) + parseInt(coord.currentx)) maxx = parseInt(gridmap.size.maxx) - parseInt(coord.currentx) -1;
		if (parseInt(gridmap.size.maxy) < parseInt(maxy) + parseInt(coord.currenty)) maxy = parseInt(gridmap.size.maxy) - parseInt(coord.currenty) -1;

		tox = parseInt(coord.currentx) + parseInt(maxx);
		toy = parseInt(coord.currenty) + parseInt(maxy);

		// console.log('x between %s %s', coord.currentx, tox);
		// console.log('y between %s %s', coord.currenty, toy);

		// pour ordonner les valeurs
		// http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
		Tile.find({
			gridMapId: gridmap._id,
			'coord.x': {$gte: coord.currentx, $lte: tox},
			'coord.y': {$gte: coord.currenty, $lte: toy}
		})
		.select('_id field owner coord')
		.sort({
			'coord.y': 'asc',
			'coord.x': 'asc'
		})
		.exec(deferred.makeNodeResolver());
		// .exec(function(err, collection) {
		// 	if (err) deferred.reject(err);
		// 	else deferred.resolve({gridmap: gridmap, collection: collection});
		// });

		return deferred.promise;
	}
}

var getTilesByGridMapId = function(gridMapId, next) {
	Tile.find({'gridMapId': gridMapId}, function(err, collections) {
		next(err, collections);
	});
}

exports.generateTilesByMap = function(gridmap) {
	// return function(gridmap) {
		var deferred = Q.defer();
		var gridmap = gridmap[0]; // le gridmap retourné est un tableau


		console.log('------------------------------');
		console.log('generateTilesByMap');
		console.log('gridmap: ', gridmap);
		console.log('gridmap.size: ', gridmap.size);
		console.log();

		// Création des tuiles associées à la carte
		gridMapMinx = gridmap.size.minx;
		gridMapMiny = gridmap.size.miny;
		gridMapMaxx = gridmap.size.maxx;
		gridMapMaxy = gridmap.size.maxy;
		// gridMapTiles = [];

		for (var j = gridMapMiny; j <= gridMapMaxy; j++) {
			for (var i = gridMapMinx; i <= gridMapMaxx; i++) {
				var tile = new Tile();
				tile.gridMapId = gridmap._id;
				tile.coord.x = i;
				tile.coord.y = j;
				tile.owner = generateOwnerByTile(gridmap.seed, tile.coord);
				tile.field = generateFieldByTile(gridmap.seed, tile.coord);

				// console.log('Ask for creation for tile: %s %s', i, j);

				Q().then(create(tile))
					.then(function(res) {
					})
					.catch(function(err) {
						console.log('------------------------------');
						console.log('Catch error: generateTilesByMap');
						console.log(err);
						console.log();
						deferred.reject(err);
					})
					.finally(function() {
					});
			}
		}

		deferred.resolve(gridmap);
		return deferred.promise;
	// }
}

function generateOwnerByTile(seed, coord) {
	randOwner = randomizeGrid.generateLocalWithSeed(seed, 1, 1, coord.x, coord.y, {
		nature:0.95,
		barbarian:0.05,
	});
	return randOwner;
}

function generateFieldByTile(seed, coord) {
	randField = randomizeGrid.generateLocalWithSeed(seed, 1, 1, coord.x, coord.y, {
		mountain:0.2,
		forest:0.2,
		desert:0.2,
		sea:0.1,
		lowland:0.3,
	});
	return randField;
}

function transformMatrixArray(array, size) {
	var arrayArray = [[]]
		tabi = 0;

		for (var j = 0; j < size.maxy; j++) {
			arrayArray[j] = [];
			arrayArray[j] = new Array(size.maxx);
			for (var i = 0; i < size.maxx; i++) {
				arrayArray[j][i] = array[tabi];
				tabi++;
			}
		}

	return arrayArray;
}

// Promise
// http://blog.valtech.fr/2013/11/03/promesses-q-nodejs/comment-page-1/
exports.getlocalGridMapTiles = function(data) {
	console.log('------------------------------');
	console.log('getlocalGridMapTiles');
	console.log();

	return function() {
		var deferred = Q.defer();

		Q().then(GridMapController.getGridMapById(data.gridmapid))
			.then(getLocalTilesByGridMapId(data))
			.then(function(collection) {
				var response = {tiles: transformMatrixArray(collection, data.size)};
				deferred.resolve(response);
			})
			.catch(function(err) {
				console.log('------------------------------');
				console.log('Catch error: getlocalGridMapTiles');
				console.log(err);
				console.log();
				deferred.reject(err);
			})
			.finally(function() {
			});

		return deferred.promise;
	}
}
