var mongoose = require('mongoose');
var World = require('./../world.model.js');

exports.findById = function(id, next) {
	World.findOne({'_id': id})
		.select('_id token seed size world')
		.exec(next);
}

exports.findByWorldName = function(worldName, next) {
	World.findOne({'world.name': worldName})
		.select('_id token seed size world')
		.exec(next);
}

exports.count = function(next) {
	World.count()
		.exec(next);
}

exports.list = function(skip, limit, next) {
	World.find()
		.select('_id token seed size world')
		.skip(skip)
		.limit(limit)
		.sort({
			created: 'asc',
			_id: 'asc'
		})
		.exec(next);
}

exports.save = function(world, next) {
	world.save(next);
}
