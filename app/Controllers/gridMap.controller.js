var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var GridMap = require('./../../app/Models/gridMap.model.js');
var Tile = require('./../../app/Models/tile.model.js');

var TilesController = require('./../../app/Controllers/tiles.controller.js')




// Gestion des erreurs
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



exports.generateNewMap = function(seed, size, callback) {
	console.log('generateNewMap');

	var gridMap = new GridMap();
	if (typeof seed !== 'undefined') gridMap.seed = seed;
	if (typeof size !== 'undefined') gridMap.size = size;

	// Insertion de la carte dans la BD
	create(gridMap, function(responseMap) {
		if (responseMap.err.status == 200) {
			// Génération de toutes les tuiles de la carte et insertion dans la BD
			TilesController.generateTilesByMap(responseMap.doc, function() {
				if (typeof callback === 'function') callback(responseMap);
			});
		}
	});
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
var create = function(gridMap, next) {
	gridMap.save(function(err, doc) {
		if (err) doc = null;
		else err = {status: 200};
		var response = {err: err, doc: doc};
		next(response);
	});
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
