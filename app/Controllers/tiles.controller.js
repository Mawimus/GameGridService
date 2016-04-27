var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var randomizeGrid = require('./../../app/Core/Utils/randomizeGrid');
var utils = require('./../../app/Core/Utils/utils');

var TileModel = require('./../../app/Models/tile.model.js');
var TileHelper = require('./../../app/Models/DAL/tile.helper.js');
var WorldHelper = require('./../../app/Models/DAL/world.helper.js');
//var WorldController = require('./../../app/Controllers/world.controller.js')

exports.generateTilesForMap = function(world) {
	// return function(world) {
		var deferred = Q.defer();
		//var world = world[0]; // le world retourné est un tableau

		console.log('------------------------------');
		console.log('generateTilesForMap');
		console.log('world: ', world);
		console.log('world.size: ', world.size);
		console.log();

		// Création des tuiles associées à la carte
		worldMinx = world.size.minx;
		worldMiny = world.size.miny;
		worldMaxx = world.size.maxx;
		worldMaxy = world.size.maxy;

		for (var j = worldMiny; j <= worldMaxy; j++) {
			for (var i = worldMinx; i <= worldMaxx; i++) {
				var tile = new TileModel();
				tile.worldId = world._id;
				tile.coord.x = i;
				tile.coord.y = j;
				tile.owner = generateOwnerByTile(world.seed, tile.coord);
				tile.field = generateFieldByTile(world.seed, tile.coord);

				TileHelper.save(tile, function(err, doc) {
					if (err) deferred.reject(err);
				});
			}
		}

		deferred.resolve(world);
		return deferred.promise;
	// }
}


// Promise
// http://blog.valtech.fr/2013/11/03/promesses-q-nodejs/comment-page-1/
exports.getLocalWorldTiles = function(data) {
	console.log('------------------------------');
	console.log('getLocalWorldTiles');
	console.log();

	var deferred = Q.defer();

	WorldHelper.findById(data.worldId, function(err, doc) {
		if (err) deferred.reject(err);
		else {
			getLocalTilesByWorld(doc, data)
				.then(function(col) {
					var response = {tiles: arrayToMatrix(col, data.size)};
					deferred.resolve(response);
				})
				.catch(function(err) {
					deferred.reject(err);
				});
		}
	});

	return deferred.promise;
}


function getLocalTilesByWorld(world, data) {

	var deferred = Q.defer();

	var size = data.size,
		coord = data.coord,
		maxx = size.maxx -1,
		maxy = size.maxy -1,
		tox, toy;

	if (parseInt(world.size.maxx) < parseInt(maxx) + parseInt(coord.currentx)) maxx = parseInt(world.size.maxx) - parseInt(coord.currentx) -1;
	if (parseInt(world.size.maxy) < parseInt(maxy) + parseInt(coord.currenty)) maxy = parseInt(world.size.maxy) - parseInt(coord.currenty) -1;

	tox = parseInt(coord.currentx) + parseInt(maxx);
	toy = parseInt(coord.currenty) + parseInt(maxy);


	var searchData = {
		worldId: world._id,
		fromx: coord.currentx,
		tox: tox,
		fromy: coord.currenty,
		toy: toy
	};

	TileHelper.findLocalById(searchData, function(err, col) {
		if (err) deferred.reject(err);
		else deferred.resolve(col);
	});

	return deferred.promise;
}


function generateOwnerByTile(seed, coord) {
	randOwner = randomizeGrid.generateLocalWithSeed(seed, 1, 1, coord.x, coord.y, {
		nature: 0.95,
		barbarian: 0.05,
	});
	return randOwner;
}

function generateFieldByTile(seed, coord) {
	randField = randomizeGrid.generateLocalWithSeed(seed, 1, 1, coord.x, coord.y, {
		mountain: 0.2,
		forest: 0.2,
		desert: 0.2,
		sea: 0.1,
		lowland: 0.3,
	});
	return randField;
}

function arrayToMatrix(array, size) {
	var matrix = [[]],
		tabi = 0;

		for (var j = 0; j < size.maxy; j++) {
			matrix[j] = [];
			matrix[j] = new Array(size.maxx);
			for (var i = 0; i < size.maxx; i++) {
				matrix[j][i] = array[tabi];
				tabi++;
			}
		}

	return matrix;
}
