var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var Player = require('./../../app/Models/player.model.js');


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
// -- [Methodes custom]  -- //
exports.getByConnection = function(data) {
	console.log('------------------------------');
	console.log('getByConnection');
	console.log('data: ', data);
	console.log();

	return function() {
		var deferred = Q.defer();

		Q().then(getByAuthentification(data))
			.then(function(player) {
				console.log('------------------------------');
				console.log('then');
				console.log('data player: ', player);
				console.log();
				var response = player;
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

exports.create = function(data) {
	console.log('------------------------------');
	console.log('createPlayer');
	console.log('data: ', data);
	console.log();

	return function() {
		var deferred = Q.defer();

		var player = new Player();

		if (typeof data.email !== 'undefined') player.email = data.email;
		if (typeof data.login !== 'undefined') player.login = data.login;
		if (typeof data.pseudo !== 'undefined') player.pseudo = data.pseudo;
		if (typeof data.password !== 'undefined') player.password = data.password;

		Q().then(save(player))
			.then(function(player) {
				console.log('------------------------------');
				console.log('then');
				console.log('data player: ', player);
				console.log();
				var response = player;
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



// #################################################################################################### //
// -- [Methodes CRUD]  -- //
function getByAuthentification(data) {
	console.log('------------------------------');
	console.log('getByAuthentification');
	console.log('data: ', data);
	console.log();
	return function() {
		var deferred = Q.defer();
		Player.find({
			login: data.login,
			password: data.password
		}).select('pseudo class')
		.exec(deferred.makeNodeResolver());

		return deferred.promise;
	}
}

function save(player) {
	console.log('------------------------------');
	console.log('save');
	console.log('player: ', player);
	console.log();
	return function() {
		var deferred = Q.defer();
		player.save(deferred.makeNodeResolver());
		return deferred.promise;
	}
}
