var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var randomizeGrid = require('./../../app/Core/Utils/randomizeGrid');
var utils = require('./../../app/Core/Utils/utils');

var TileModel = require('./../../app/Models/tile.model.js');
var TileHelper = require('./../../app/Models/DAL/tile.model.helper.js');
var GridmapHelper = require('./../../app/Models/DAL/gridMap.model.helper.js');
var GridMapController = require('./../../app/Controllers/gridMap.controller.js')

exports.generateTilesForMap = function(gridmap) {
	// return function(gridmap) {
		var deferred = Q.defer();
		//var gridmap = gridmap[0]; // le gridmap retourné est un tableau

		console.log('------------------------------');
		console.log('generateTilesForMap');
		console.log('gridmap: ', gridmap);
		console.log('gridmap.size: ', gridmap.size);
		console.log();

		// Création des tuiles associées à la carte
		gridMapMinx = gridmap.size.minx;
		gridMapMiny = gridmap.size.miny;
		gridMapMaxx = gridmap.size.maxx;
		gridMapMaxy = gridmap.size.maxy;

		for (var j = gridMapMiny; j <= gridMapMaxy; j++) {
			for (var i = gridMapMinx; i <= gridMapMaxx; i++) {
				var tile = new TileModel();
				tile.gridMapId = gridmap._id;
				tile.coord.x = i;
				tile.coord.y = j;
				tile.owner = generateOwnerByTile(gridmap.seed, tile.coord);
				tile.field = generateFieldByTile(gridmap.seed, tile.coord);

				TileHelper.save(tile, function(err, doc) {
					if (err) deferred.reject(err);
				});
			}
		}

		deferred.resolve(gridmap);
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

	GridmapHelper.findById(data.worldId, function(err, doc) {
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
