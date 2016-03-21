var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var randomizeGrid = require('./../../app/Core/Utils/randomizeGrid');
var utils = require('./../../app/Core/Utils/utils');

var Tile = require('./../../app/Models/tile.model.js')
var GridMapController = require('./../../app/Controllers/gridMap.controller.js')


// Gestion des erreurs
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


// Create a tile
var create = function(tile, next) {
	tile.save(function(err, doc) {
		if (err) doc = null;
		else err = {status: 200};
		var response = {err: err, doc: doc};
		next(response);
	});
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

exports.generateTilesByMap = function(gridMap, next) {
	// Création des tuiles associées à la carte
	gridMapMinx = gridMap.size.minx;
	gridMapMiny = gridMap.size.miny;
	gridMapMaxx = gridMap.size.maxx;
	gridMapMaxy = gridMap.size.maxy;
	// gridMapTiles = [];

	for (var j = gridMapMiny; j <= gridMapMaxy; j++) {
		for (var i = gridMapMinx; i <= gridMapMaxx; i++) {
			var tile = new Tile();
			tile.gridMapId = gridMap._id;
			tile.coord.x = i;
			tile.coord.y = j;
			tile.owner = generateOwnerByTile(gridMap.seed, tile.coord);
			tile.field = generateFieldByTile(gridMap.seed, tile.coord);

			create(tile, function(response) {
				// gridMapTiles.push(response.doc);
				// next(gridMapTiles);
			});
		}
	}
	next();
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
				var response = {tiles: transformMatrixArray(collection, data.size)}
				deferred.resolve(response);
			})
			.catch(function(err) {
				console.log('------------------------------');
				console.log('Catch error');
				console.log();
				deferred.reject(err);
			})
			.finally(function() {
			});

		return deferred.promise;
	}
}

exports.generateLocalMatrixTiles = function(maxxTiles, maxyTiles, maxx, maxy, currentx, currenty) {
	// Cast des parametre
	var maxxTiles = parseInt(maxxTiles),
		maxyTiles = parseInt(maxyTiles),
		maxx = parseInt(maxx),
		maxy = parseInt(maxy),
		currentx = parseInt(currentx),
		currenty = parseInt(currenty);

	// Work with nbX, nbY odd !
	var gridSeed = 'GrideLand#1',
		randField = [],
		randOwner = [],
		nbX = maxxTiles,
		nbY = maxyTiles,
		fromX = 0; //Math.floor(nbX / 2) * -1,
		toX = nbX; //Math.floor(nbX / 2),
		fromY = 0,
		toY = nbY;

	randField = randomizeGrid.generateLocalWithSeed(gridSeed, maxx, maxy, currentx, currenty, {
		mountain:0.2,
		forest:0.2,
		desert:0.2,
		sea:0.1,
		lowland:0.3,
	});
	randOwner = randOwner.generateLocalWithSeed(gridSeed, maxx, maxy, currentx, currenty, {
		nature:0.95,
		barbarian:0.05,
	});
	// for (i in randOwner) {
	// 	console.log('i %s', randOwner[i]);
	// }

	var mountain = 0,
		forest = 0,
		desert = 0,
		sea = 0,
		lowland = 0
		totalField = 0;

	var nature = 0,
		barbarian = 0,
		totalBarbarian = 0;

	var mountainpc,
		forestpc,
		desertpc,
		seapc,
		lowlandpc,
		totalFieldpc,
		naturepc,
		barbarianpc,
		totalBarbarianpc;

	for (var i in randField) {
		if (randField[i] == 'mountain') mountain++;
		if (randField[i] == 'forest') forest++;
		if (randField[i] == 'desert') desert++;
		if (randField[i] == 'sea') sea++;
		if (randField[i] == 'lowland') lowland++;
		totalField++;
	}
	mountainpc = (mountain * 100) / totalField;
	forestpc = (forest * 100) / totalField;
	desertpc = (desert * 100) / totalField;
	seapc = (sea * 100) / totalField;
	lowlandpc = (lowland * 100) / totalField;
	totalFieldpc = (totalField * 100) / totalField;

	console.log('Type\t\t\t: Total\t%percent');
	console.log('----------------------------------------');

	console.log('mountain\t\t: %s\t%s%', mountain, mountainpc.toFixed(2));
	console.log('forest\t\t\t: %s\t%s%', forest, forestpc.toFixed(2));
	console.log('desert\t\t\t: %s\t%s%', desert, desertpc.toFixed(2));
	console.log('sea\t\t\t: %s\t%s%', sea, seapc.toFixed(2));
	console.log('lowland\t\t\t: %s\t%s%', lowland, lowlandpc.toFixed(2));
	console.log('#totalField#\t\t: %s\t%s%', totalField, totalFieldpc.toFixed(2));

	for (var i in randOwner) {
		if (randOwner[i] == 'nature') nature++;
		if (randOwner[i] == 'barbarian') barbarian++;
		totalBarbarian++;
	}
	naturepc = (nature * 100) / totalBarbarian;
	barbarianpc = (barbarian * 100) / totalBarbarian;
	totalBarbarianpc = (totalBarbarian * 100) / totalBarbarian;

	console.log();
	console.log('nature\t\t\t: %s\t%s%', nature, naturepc.toFixed(2));
	console.log('barbarian\t\t: %s\t%s%', barbarian, barbarianpc.toFixed(2));
	console.log('#totalBarbarian#\t: %s\t%s%', totalBarbarian, totalBarbarianpc.toFixed(2));

	var matrix = [[]],
		f, o, c,
		id = 0,
		ipos = 0, //currentx+32,
		jpos = 0, //currenty+32,
		tabi = 0;

	// console.log();
	// console.log('(%s | %s)', currentx, currenty);
	// console.log();

	for (var j = 0; j < maxy; j++) {
		id = ((currenty + j) * maxyTiles) + currentx;
		// console.log('----------');
		// console.log('j %s %s', j, id);
		// console.log('----------');
		matrix[jpos] = [];
		matrix[jpos] = new Array(maxx);
		for (var i = 0; i < maxx; i++) {
			id++;
			// console.log('i %s %s', i, id);
			f = {type: randField[tabi]};
			o = {id: 0, type: randOwner[tabi], name: randOwner[tabi].capitalizeFirstLetter(), class: randOwner[tabi]};
			c = {x: currentx + i, y: currenty + j};
			matrix[jpos][ipos] = {id: id, coord: c, owner: o, field: f};
			ipos++;
			tabi++;
		}
		// tabi = ipos + (jpos * nbX);
		ipos = 0;
		jpos++;
	}

	// console.log(beautify(JSON.stringify(matrix), {indent_size: 2}));
	return matrix;
}
