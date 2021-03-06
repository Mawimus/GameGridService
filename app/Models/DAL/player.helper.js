var mongoose = require('mongoose');
var Player = require('./../player.model.js');

exports.findById = function(id, next) {
	Player.findOne({'_id': id})
		.select('_id email pseudo login worldId nation')
		.exec(next);
}

exports.findByCredential = function(data, next) {
	Player.findOne({
			login: data.login,
			password: data.password,
			worldId: data.worldId
		})
		.select('_id email pseudo login worldId nation')
		.exec(next);
}

exports.count = function(next) {
	Player.count()
		.exec(next);
}

exports.list = function(skip, limit, next) {
	Player.find()
		.select('_id email pseudo login worldId nation')
		.skip(skip)
		.limit(limit)
		.sort({
			created: 'asc',
			_id: 'asc'
		})
		.exec(next);
}

exports.save = function(player, next) {
	player.save(next);
}

exports.deleteByWorld = function(worldId, next) {
	Player.find({worldId: worldId})
		.remove()
		.exec(next);
}
