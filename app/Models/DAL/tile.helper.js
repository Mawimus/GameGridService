var mongoose = require('mongoose');
var Tile = require('./../tile.model.js');

exports.findById = function(id, next) {
	Tile.findOne({'_id': id})
		.select('_id worldId coord owner field')
		.exec(next);
}

exports.findByWorldId = function(worldId, next) {
	Tile.find({'worldId': worldId})
		.select('_id worldId coord owner field')
		.exec(next);
}

exports.countByWorldId = function(worldId, next) {
	Tile.count({'worldId': worldId})
		.exec(next);
}

exports.findLocalById = function(local, next) {
	// pour ordonner les valeurs
	// http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
	Tile.find({
			worldId: local.worldId,
			'coord.x': {$gte: local.fromx, $lte: local.tox},
			'coord.y': {$gte: local.fromy, $lte: local.toy}
		})
		.select('_id field owner coord')
		.sort({
			'coord.y': 'asc',
			'coord.x': 'asc'
		})
		.exec(next);
}

exports.listByWorldId = function(worldId, skip, limit, next) {
	Tile.find({'worldId': worldId})
		.select('_id worldId coord owner field')
		.skip(skip)
		.limit(limit)
		.sort({
			'coord.x': 'asc',
			'coord.y': 'asc'
		})
		.exec(next);
}

exports.save = function(tile, next) {
	tile.save(next);
}

exports.deleteByWorld = function(worldId, next) {
	Tile.find({worldId: worldId})
		.remove()
		.exec(next);
}
