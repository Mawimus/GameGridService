var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var GridmapModel = require('./../../app/Models/gridMap.model.js');
var GridmapHelper = require('./../../app/Models/DAL/gridMap.helper.js');
var TilesController = require('./../../app/Controllers/tiles.controller.js');


exports.generateNewMap = function(data) {
	console.log('------------------------------');
	console.log('generateNewMap');
	console.log();

	var deferred = Q.defer();
	var gridmap = new GridmapModel();

	if (typeof data.seed !== 'undefined') gridmap.seed = data.seed;
	if (typeof data.size !== 'undefined') gridmap.size = data.size;
	if (typeof data.world !== 'undefined') gridmap.world = data.world;

	GridmapHelper.save(gridmap, function(err, doc) {
		if (err) deferred.reject(err);
		else {
			TilesController.generateTilesForMap(doc)
				.then(function(doc) {
					deferred.resolve(doc);
				})
				.catch(function(err) {
					deferred.reject(err);
				});
		}
	});

	return deferred.promise;
}

exports.Worlds = function(data) {
	console.log('------------------------------');
	console.log('Worlds');
	console.log();

	var deferred = Q.defer();

	GridmapHelper.list(data.skip, data.limit, function(err, col) {
		if (err) deferred.reject(err);
		else deferred.resolve(col);
	});

	return deferred.promise;
}
