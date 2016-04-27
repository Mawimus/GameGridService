var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var PlayerModel = require('./../../app/Models/player.model.js');
var PlayerHelper = require('./../../app/Models/DAL/player.helper.js');

exports.getByConnection = function(data) {
	console.log('------------------------------');
	console.log('getByConnection');
	console.log('data: ', data);
	console.log();

	var deferred = Q.defer();
	var params = {login: data.login, password: data.password};

	PlayerHelper.findByCredential(params, function(err, doc) {
		if (err) deferred.reject(err);
		else deferred.resolve(doc);
	});

	return deferred.promise;
}

exports.create = function(data) {
	console.log('------------------------------');
	console.log('createPlayer');
	console.log('data: ', data);
	console.log();

	var deferred = Q.defer();

	var player = new PlayerModel();

	if (typeof data.email !== 'undefined') player.email = data.email;
	if (typeof data.login !== 'undefined') player.login = data.login;
	if (typeof data.pseudo !== 'undefined') player.pseudo = data.pseudo;
	if (typeof data.password !== 'undefined') player.password = data.password;

	PlayerHelper.save(player, function(err, doc) {
		if (err) deferred.reject(err);
		else deferred.resolve(doc);
	});

	return deferred.promise;
}
