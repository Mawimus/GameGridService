var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var WorldModel = require('./../../app/Models/world.model.js');
var WorldHelper = require('./../../app/Models/DAL/world.helper.js');
var TilesController = require('./../../app/Controllers/tiles.controller.js');


exports.generateNewMap = function(data) {
	console.log('------------------------------');
	console.log('generateNewMap');
	console.log();

	var deferred = Q.defer();
	var world = new WorldModel();

	if (typeof data.seed !== 'undefined') world.seed = data.seed;
	if (typeof data.size !== 'undefined') world.size = data.size;
	if (typeof data.world !== 'undefined') world.world = data.world;

	WorldHelper.save(world, function(err, doc) {
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

	WorldHelper.list(data.skip, data.limit, function(err, col) {
		if (err) deferred.reject(err);
		else deferred.resolve(col);
	});

	return deferred.promise;
}
