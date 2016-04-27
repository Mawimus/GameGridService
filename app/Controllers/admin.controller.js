var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var PlayerHelper = require('./../../app/Models/DAL/player.helper.js');
var WorldHelper = require('./../../app/Models/DAL/world.helper.js');

exports.delete = function(option) {

	var deferred = Q.defer();

	if (!option) deferred.reject({msg: 'No options found'});
	else {
		// Suppression d'un monde ?
		if (option.world) {
			if (option.world == 'all') {
				WorldHelper.list(0, 0, function(err, worlds) {
					if (err) deferred.reject(err);
					if (worlds) {
						worlds.forEach(function(world) {
							WorldHelper.delete(world._id, function(err, doc) {
								if (err) deferred.reject(err);
								else deferred.resolve(option);
							});
						});
					}
				});
			} else {
				WorldHelper.findById(option.world, function(err, world) {
					if (err) deferred.reject(err);
					if (!world) deferred.reject({msg: 'This world don\'t exist'});
					else {
						WorldHelper.delete(world._id, function(err, doc) {
							if (err) deferred.reject(err);
							else deferred.resolve(option);
						});
					}
				});
			}
		}
	}

	// deferred.resolve(option);
	return deferred.promise;
}
