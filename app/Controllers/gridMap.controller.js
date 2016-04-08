var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var GridMap = require('./../../app/Models/gridMap.model.js');
var Tile = require('./../../app/Models/tile.model.js');

var TilesController = require('./../../app/Controllers/tiles.controller.js')


// #################################################################################################### //
// -- [Gestion des erreurs]  -- //
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'GridMap already exists';
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



exports.generateNewMap = function(data) {
	console.log('------------------------------');
	console.log('generateNewMap');
	console.log();

	return function() {
		var deferred = Q.defer();
		var gridMap = new GridMap();

		if (typeof data.seed !== 'undefined') gridMap.seed = data.seed;
		if (typeof data.size !== 'undefined') gridMap.size = data.size;

		Q().then(create(gridMap))
			.then(TilesController.generateTilesByMap)
			.then(function(res) {
				deferred.resolve(res);
			})
			.catch(function(err) {
				console.log('------------------------------');
				console.log('Catch error: generateNewMap');
				console.log(err);
				console.log();
				deferred.reject(err);
			})
			.finally(function() {
			});

			console.log('end 3');

		return deferred.promise;
	}
}

exports.getGridMapById = function(gridMapId) {
	return function () {
		var deferred = Q.defer();

		GridMap.findOne({'_id': gridMapId}, deferred.makeNodeResolver());

		return deferred.promise;
	}
}

// ------------------------------ //
//              CRUD              //
// ------------------------------ //

// Create
function create(gridMap) {
	return function() {
		var deferred = Q.defer();

		gridMap.save(deferred.makeNodeResolver());

		return deferred.promise;
	}
}

// Read
exports.read = function() {

}

// Update
exports.update = function() {

}

// Delete
exports.delete = function() {

}
